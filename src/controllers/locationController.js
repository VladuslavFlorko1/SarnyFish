import { Location } from '../models/local.js';
import createHttpError from 'http-errors'
import { uploadToCloudinary } from '../services/uploadToCloudinary.js';

export const getLocations = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    city,
    type,
    fish,
    owner,
    sort
  } = req.query;

  const skip = (page - 1) * perPage;

  const locationsQuery = Location.find().populate(
    "owner",
    "username avatar"
  );

  if (city) {
    locationsQuery.where({
      city: { $regex: city, $options: 'i' },
    });
  }

  if (type) {
    locationsQuery.where('type').equals(type);
  }

  if (fish) {
    const fishes = fish.split(',');
    locationsQuery.where('fish').in(fishes);
  }

  if (owner) {
    locationsQuery.where('owner').equals(owner);
  }

  if (sort === 'popular') {
    locationsQuery.sort({ 'likes.count': -1 });
  }

  if (sort === 'newest') {
    locationsQuery.sort({ createdAt: -1 });
  }

  const [totalItems, locations] = await Promise.all([
    locationsQuery.clone().countDocuments(),
    locationsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  const locationsWithLikeStatus = locations.map((location) => {
    const obj = location.toObject();
    obj.isLiked = req.user
      ? location.likes.users.some((userId) => userId.equals(req.user._id))
      : false;
    return obj;
  });

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    locations: locationsWithLikeStatus,
  });
};

export const getLocationById = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findById(id).populate(
    "owner",
    "username avatar"
  );

  if (!location) {
    throw createHttpError(404, 'Локація не знайдена');
  }

  const obj = location.toObject();
  obj.isLiked = req.user
    ? location.likes.users.some((userId) => userId.equals(req.user._id))
    : false;

  res.status(200).json(obj);
}

export const createLocation = async (req, res) => {
  if (!req.user.isVerified) {
    throw createHttpError(403, 'Підтвердіть email, щоб додавати локації');
  }

  const imageUrls = await Promise.all(
    req.files.map(async (file) => {
      const result = await uploadToCloudinary(file.buffer, 'locations');
      return result.secure_url;
    })
  );

  const location = await Location.create({
    ...req.body,
    coordinates: {
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
    },
    owner: req.user._id,
    images: imageUrls,
  });

  res.status(201).json(location);
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findOneAndDelete({
    _id: id,
    owner: req.user._id,
  });

  if (!location) {
    throw createHttpError(
      404,
      'Локацію не знайдено або у вас немає доступу',
    );
  }

  res.status(200).json(location);
};

export const updateLocation = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findOneAndUpdate(
    {
      _id: id,
      owner: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!location) {
    throw createHttpError(
      404,
      'Локацію не знайдено або у вас немає доступу',
    );
  }

  res.status(200).json(location);
};

export const patchLocation = async (req, res) => {
  const { id } = req.params;
  const { removeImages, lat, lng, ...rest } = req.body;

  const location = await Location.findOne({ _id: id, owner: req.user._id });

  if (!location) {
    throw createHttpError(
      404,
      'Локацію не знайдено або у вас немає доступу',
    );
  }

  let updatedImages = location.images;

  if (removeImages) {
    const toRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
    updatedImages = updatedImages.filter((img) => !toRemove.includes(img));
  }

  if (req.files && req.files.length > 0) {
    const newImageUrls = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, 'locations');
        return result.secure_url;
      })
    );
    updatedImages = [...updatedImages, ...newImageUrls];
  }

  if (updatedImages.length > 10) {
    throw createHttpError(400, 'Максимум 10 фотографій на локацію');
  }

  if (updatedImages.length === 0) {
    throw createHttpError(400, 'Локація повинна мати хоча б одне фото');
  }

  const updateData = { ...rest, images: updatedImages };

  if (lat !== undefined || lng !== undefined) {
    updateData.coordinates = {
      lat: lat !== undefined ? Number(lat) : location.coordinates.lat,
      lng: lng !== undefined ? Number(lng) : location.coordinates.lng,
    };
  }

  const updatedLocation = await Location.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('owner', 'username avatar');

  res.status(200).json(updatedLocation);
};

export const toggleLike = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findById(id);

  if (!location) {
    throw createHttpError(404, "Локацію не знайдено");
  }

  const alreadyLiked = location.likes.users.some((userId) =>
    userId.equals(req.user._id)
  );

  if (alreadyLiked) {
    location.likes.users.pull(req.user._id);
    location.likes.count -= 1;
  } else {
    location.likes.users.push(req.user._id);
    location.likes.count += 1;
  }
  await location.save();

  res.status(200).json(location.likes);
};

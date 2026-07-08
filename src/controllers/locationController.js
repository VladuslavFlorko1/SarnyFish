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
    sort
  } = req.query;

  const skip = (page - 1) * perPage;

  const locationsQuery = Location.find();

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

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    locations,
  });
};

export const getLocationById = async (req, res) => {
  const { id } = req.params;

  const location = await Location.findById(id);

  if (!location) {
    throw createHttpError(404, 'Локація не знайдена');
  }
  res.status(200).json(location);
}

export const createLocation = async (req, res) => {
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

import { Location } from '../models/local.js';
import createHttpError from 'http-errors'

export const getLocations = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;

  const skip = (page - 1) * perPage;

  const locationQuery = Location.find();

  const [totalItems, locations] = await Promise.all([
    locationQuery.clone().countDocuments(),
    locationQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
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
  const location = await Location.create(req.body);
  res.status(201).json(location);
}

export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  const location = await Location.findByIdAndDelete(id);
  if (!location) {
    throw createHttpError(404, 'Локація не знайдена');
  }
  res.status(200).json(location);
}

export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const location = await Location.findByIdAndUpdate({ _id: id },
    req.body,
    { returnDocument: 'after' },
  );
  if (!location) {
    throw createHttpError(404, 'Локація не знайдена');
  }
  res.status(200).json(location);
}

export const patchLocation = async (req, res) => {
  const { id } = req.params;
  const location = await Location.findByIdAndUpdate({ _id: id },
    req.body,
    { returnDocument: 'after' },
  );
  if (!location) {
    throw createHttpError(404, 'Локація не знайдена');
  }
  res.status(200).json(location);
}

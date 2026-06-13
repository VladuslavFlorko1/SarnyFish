import { Location } from '../models/local.js';
import createHttpError from 'http-errors'

export const getLocations = async (req, res) => {
  console.log('DB:', Location.db.name);

  const locations = await Location.find();

  console.log('Count:', locations.length);

  res.json(locations);
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

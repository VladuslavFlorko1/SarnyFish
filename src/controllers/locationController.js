import { Location } from '../models/local.js';

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
    return res.status(404).json({
      error: 'Локація не знайдена',
    });
  }

  res.status(200).json(location);
} 

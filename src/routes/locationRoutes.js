import { Router } from 'express';
import { getLocations, getLocationById, createLocation, deleteLocation, updateLocation } from '../controllers/locationController.js';
import { celebrate, Segments } from 'celebrate';
import  locationSchema  from '../validations/localValidation.js';

const localRouter = Router();

localRouter.get('/locations', getLocations);

localRouter.get('/locations/:id', getLocationById);

localRouter.post('/locations', celebrate({ [Segments.BODY]: locationSchema }), createLocation);

localRouter.delete('/locations/:id', deleteLocation);

localRouter.put('/locations/:id', updateLocation);

export default localRouter;

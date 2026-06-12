import { Router } from 'express';
import { getLocations, getLocationById } from '../controllers/locationController.js';

const localRouter = Router();

localRouter.get('/locations', getLocations);

localRouter.get('/locations/:id', getLocationById);


export default localRouter;

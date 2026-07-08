import { Router } from 'express';
import { getLocations, getLocationById, createLocation, deleteLocation, updateLocation, patchLocation, toggleLike } from '../controllers/locationController.js';
import { celebrate, Segments } from 'celebrate';
import {locationSchema,updateLocationSchema, getLocationSchema} from '../validations/localValidation.js';
import { idValidationSchema } from '../validations/objectIdValidator.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const localRouter = Router();


localRouter.get('/locations',celebrate(getLocationSchema), getLocations);

localRouter.get('/locations/:id',celebrate(idValidationSchema), getLocationById);

localRouter.post('/locations',authenticate,upload.array('images', 10),celebrate(locationSchema),createLocation,);

localRouter.delete('/locations/:id',authenticate, celebrate(idValidationSchema), deleteLocation);

localRouter.put('/locations/:id',authenticate, celebrate(idValidationSchema), updateLocation);

localRouter.patch('/locations/:id', authenticate, celebrate(updateLocationSchema), patchLocation);

localRouter.patch("/locations/:id/like",authenticate,celebrate(idValidationSchema),toggleLike);

export default localRouter;

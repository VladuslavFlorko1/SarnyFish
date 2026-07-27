import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { authenticate } from '../middlewares/authenticate.js';
import {
  updateUserAvatar,
  getCurrentUser,
  getUserById,
} from '../controllers/userController.js';
import { upload } from '../middlewares/multer.js';

const objectIdValidator = (value, helpers) => {
  return isValidObjectId(value)
    ? value
    : helpers.message('Невірний формат ObjectId');
};

const userIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};

const userRouter = Router();

userRouter.get('/users/me', authenticate, getCurrentUser);

userRouter.get(
  '/users/:id',
  authenticate,
  celebrate(userIdParamSchema),
  getUserById,
);

userRouter.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default userRouter;

import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { updateUserAvatar, getCurrentUser } from '../controllers/userController.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.get('/users/me', authenticate, getCurrentUser);

userRouter.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default userRouter;

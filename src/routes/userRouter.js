import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { updateUserAvatar } from '../controllers/userController.js';
import { upload } from '../middlewares/multer.js';

const userRouter = Router();

userRouter.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default userRouter;

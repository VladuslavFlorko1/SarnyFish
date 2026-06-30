import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetEmail,
} from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';


const router = Router();

router.post('/auth/register', celebrate(registerSchema), registerUser);
router.post('/auth/login', celebrate(loginSchema), loginUser);
router.post('/auth/logout', logoutUser);
router.post('/auth/refresh', refreshSession);
router.post('/auth/reset-password', requestResetEmail);

export default router;

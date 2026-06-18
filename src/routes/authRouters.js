import { Router } from 'express';
import { celebrate } from 'celebrate';
import { registerUser } from '../controllers/authController.js';
import { registerSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/auth/register', celebrate(registerSchema), registerUser);

export default router;

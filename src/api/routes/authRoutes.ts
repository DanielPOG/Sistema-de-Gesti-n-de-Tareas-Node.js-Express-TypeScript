import { Router } from 'express';
import { registerController, loginController } from '../../controllers/authController';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../../utils/schemas';

const router:Router = Router()

router.post("/register", validate(registerSchema), registerController)

router.post("/login", validate(loginSchema), loginController)

export default router 
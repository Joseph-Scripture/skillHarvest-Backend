import { Router } from 'express';

import { register, login, logout } from '../controllers/userAuthentication.js';
import { registerValidator, loginValidator } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/authMiddleware.js";


const router = Router();


router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", logout);

export default router   
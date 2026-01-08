import { Router } from 'express';

import { register, login, logout } from '../controllers/userAuthentication.js';
import { registerValidator, loginValidator } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {protect} from '../middleware/authMiddleware.js'


const router = Router();


router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.post("/logout", logout);
router.get("/me", protect, (req, res) => {
    res.json(req.user);
});

export default router   
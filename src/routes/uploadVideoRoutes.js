import {Router} from 'express';
import {uploadVideo} from '../middleware/uploadVideoMiddleware.js';
import {createVideo} from '../controllers/videoCreationController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = Router();

router.post('/upload', protect, uploadVideo, createVideo);

export default router;
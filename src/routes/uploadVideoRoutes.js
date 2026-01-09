import { Router } from 'express';
import { uploadVideo } from '../middleware/uploadVideoMiddleware.js';
import { createVideo } from '../controllers/videoCreationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getGlobalVideos, getVideosByTag, getVideosByUser } from '../controllers/getVideosController.js';

const router = Router();

/**
 * @swagger
 * /api/video/upload:
 *   post:
 *     summary: Upload a new video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/upload', protect, uploadVideo, createVideo);

/**
 * @swagger
 * /api/video:
 *   get:
 *     summary: Get global videos
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of videos
 *       500:
 *         description: Internal server error
 */
router.get('/', getGlobalVideos);

/**
 * @swagger
 * /api/video/user/{userId}:
 *   get:
 *     summary: Get videos by user ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user videos
 *       500:
 *         description: Internal server error
 */
router.get('/user/:userId', getVideosByUser);

/**
 * @swagger
 * /api/video/tag/{tag}:
 *   get:
 *     summary: Get videos by tag
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of videos
 *       500:
 *         description: Internal server error
 */
router.get('/tag/:tag', getVideosByTag);

export default router;
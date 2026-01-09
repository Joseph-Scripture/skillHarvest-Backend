import { Router } from 'express';
import { rateVideo, getVideoRating } from '../controllers/ratingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/ratings/{videoId}:
 *   post:
 *     summary: Rate a video
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating value between 1 and 5
 *     responses:
 *       200:
 *         description: Video rated successfully
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get video rating statistics
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Rating statistics retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.post('/:videoId', protect, rateVideo);
router.get('/:videoId', getVideoRating);

export default router;

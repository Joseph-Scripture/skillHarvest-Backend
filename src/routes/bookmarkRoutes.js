import { Router } from 'express';
import { toggleBookmark, getMyBookmarks } from '../controllers/bookmarksController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/{videoId}/bookmark:
 *   post:
 *     summary: Toggle bookmark for a video
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Bookmark toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 bookmarked:
 *                   type: boolean
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.post('/:videoId/bookmark', protect, toggleBookmark);

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get my bookmarks
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Bookmarks
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/bookmarks', protect, getMyBookmarks);

export default router;

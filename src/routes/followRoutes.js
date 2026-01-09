import { Router } from 'express';
import { toggleFollow, getFollowers } from '../controllers/followController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/follow/{userId}:
 *   post:
 *     summary: Toggle follow status for a user
 *     description: Follow or unfollow a user. If already following, this will unfollow. If not following, this will follow.
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow/unfollow
 *     responses:
 *       200:
 *         description: Successfully toggled follow status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 following:
 *                   type: boolean
 *                   description: True if now following, false if unfollowed
 *                   example: true
 *                 followersCount:
 *                   type: integer
 *                   description: Total followers count for the target user
 *                   example: 42
 *                 followingCount:
 *                   type: integer
 *                   description: Total following count for the target user
 *                   example: 15
 *       400:
 *         description: Cannot follow yourself
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Failed to toggle follow
 */
router.post('/:userId', protect, toggleFollow);

/**
 * @swagger
 * /api/follow/{userId}/followers:
 *   get:
 *     summary: Get followers of a user
 *     description: Retrieve a list of all users who follow the specified user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose followers to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Total number of followers
 *                   example: 42
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       follower:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "user123"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           experience:
 *                             type: string
 *                             example: "3 years farming"
 *       500:
 *         description: Failed to fetch followers
 */
router.get('/:userId/followers', getFollowers);

export default router;

import { Router } from 'express';
import { passwordReset, sendEmail, verifyCode } from '../controllers/passwordResetController.js';
import { passwordResetLimit } from '../middleware/rateLimit.js';

const router = Router();

/**
 * @swagger
 * /api/password-reset/send-email:
 *   post:
 *     summary: Request a password reset code
 *     description: Sends a 4-digit reset code to the user's email. Code expires in 15 minutes.
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user requesting password reset
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reset code sent
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: System error
 */
router.post('/send-email', passwordResetLimit, sendEmail);

/**
 * @swagger
 * /api/password-reset/verify-code:
 *   post:
 *     summary: Verify a password reset code
 *     description: Validates the reset code sent to the user's email
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - resetCode
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: user@example.com
 *               resetCode:
 *                 type: string
 *                 description: 4-digit reset code received via email
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Code verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code verified
 *       401:
 *         description: Invalid or expired code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid code
 */
router.post('/verify-code', passwordResetLimit, verifyCode);

/**
 * @swagger
 * /api/password-reset/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password after code verification. Clears the reset code and expiration.
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 description: 4-digit reset code received via email
 *                 example: "1234"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password for the user account
 *                 example: "NewSecureP@ss123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       401:
 *         description: Invalid or expired code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid code
 */
router.post('/reset-password', passwordResetLimit, passwordReset);

export default router;

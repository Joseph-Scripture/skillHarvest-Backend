import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import generateResetCode from "../utils/generateResetCode.js";
import { sendResetCodeEmail } from "../services/email.js";

/**
 * Helper to validate a reset code.
 * @param {string} email - The user's email address.
 * @param {string} code - The reset code provided by the user.
 * @returns {Promise<{valid: boolean, message?: string, user?: object}>} An object indicating validity and potentially the user object.
 */
const validateCode = async (email, code) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.resetCode || !user?.resetCodeExpiresAt) return { valid: false, message: "Invalid request" };

    if (new Date() > user.resetCodeExpiresAt) return { valid: false, message: "Code has expired" };

    const isMatch = await bcrypt.compare(code, user.resetCode);
    return isMatch ? { valid: true, user } : { valid: false, message: "Invalid code" };
};

export const sendEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetCode = generateResetCode();
        const hashedResetCode = await bcrypt.hash(resetCode, 10);

        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { resetCode: hashedResetCode, resetCodeExpiresAt: expiresAt },
        });

        await sendResetCodeEmail(email, resetCode);
        res.status(200).json({ message: 'Reset code sent' });
    } catch (error) {
        console.error("Error in sendEmail:", error);
        res.status(500).json({ message: 'System error' });
    }
};

/**
 * Verify a password reset code.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const verifyCode = async (req, res) => {
    const { email, resetCode } = req.body;
    const result = await validateCode(email, resetCode);

    if (!result.valid) return res.status(401).json({ message: result.message });

    res.status(200).json({ message: 'Code verified' });
};

/**
 * Reset a user's password using a reset code.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const passwordReset = async (req, res) => {
    const { email, code, newPassword } = req.body;

    const result = await validateCode(email, code);
    if (!result.valid) return res.status(401).json({ message: result.message });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: {
            password: hashedPassword,
            resetCode: null,
            resetCodeExpiresAt: null
        }
    });

    res.status(200).json({ message: "Password updated successfully" });
};
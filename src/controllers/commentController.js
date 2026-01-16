import prisma from "../config/db.js";

/**
 * Create a new comment on a video.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const createComment = async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({
            message: "Comment content is required",
        });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                userId: req.user.id,
                videoId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        experience: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            comment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create comment",
        });
    }
};

/**
 * Get all comments for a specific video.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const getVideoComments = async (req, res) => {
    const { videoId } = req.params;

    try {
        const comments = await prisma.comment.findMany({
            where: { videoId },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            count: comments.length,
            comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch comments",
        });
    }
};

/**
 * Delete a comment.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete comment",
        });
    }
};

/**
 * Update a comment.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to update this comment" });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });

        res.status(200).json({
            success: true,
            comment: updatedComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update comment",
        });
    }
};
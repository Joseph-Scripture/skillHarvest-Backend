import prisma from "../config/db.js";

/**
 * Rate a video.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const rateVideo = async (req, res) => {
    const { videoId } = req.params;
    const { value } = req.body;

    if (value < 1 || value > 5) {
        return res.status(400).json({
            message: "Rating must be between 1 and 5",
        });
    }

    try {
        const rating = await prisma.rating.upsert({
            where: {
                userId_videoId: {
                    userId: req.user.id,
                    videoId,
                },
            },
            update: {
                value,
            },
            create: {
                value,
                userId: req.user.id,
                videoId,
            },
        });

        res.json({
            success: true,
            rating,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to rate video",
        });
    }
};

/**
 * Get average rating and total counts for a specific video.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const getVideoRating = async (req, res) => {
    const { videoId } = req.params;

    try {
        const stats = await prisma.rating.aggregate({
            where: { videoId },
            _avg: { value: true },
            _count: true,
        });

        res.json({
            success: true,
            average: stats._avg.value || 0,
            totalRatings: stats._count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch rating",
        });
    }
};


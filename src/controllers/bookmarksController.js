
import prisma from "../config/db.js";

/**
 * Toggle a bookmark for a video.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */

export const toggleBookmark = async (req, res) => {
    const { videoId } = req.params;

    try {
        const existing = await prisma.bookmark.findUnique({
            where: {
                userId_videoId: {
                    userId: req.user.id,
                    videoId,
                },
            },
        });

        if (existing) {
            await prisma.bookmark.delete({
                where: {
                    userId_videoId: {
                        userId: req.user.id,
                        videoId,
                    },
                },
            });

            return res.json({
                success: true,
                bookmarked: false,
            });
        }

        await prisma.bookmark.create({
            data: {
                userId: req.user.id,
                videoId,
            },
        });

        res.json({
            success: true,
            bookmarked: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to toggle bookmark",
        });
    }
};


/**
 * Get the current user's bookmarks.
 * 
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const getMyBookmarks = async (req, res) => {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: req.user.id },
            include: {
                video: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        tags: { include: { tag: true } },
                        _count: {
                            select: {
                                comments: true,
                                ratings: true,
                                bookmarks: true,
                                likes: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedBookmarks = bookmarks.map(b => ({
            ...b,
            video: {
                ...b.video,
                views: b.video.views || 0,
                tags: b.video.tags.map(vt => vt.tag),
            }
        }));

        res.json({
            success: true,
            count: formattedBookmarks.length,
            bookmarks: formattedBookmarks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bookmarks",
        });
    }
};

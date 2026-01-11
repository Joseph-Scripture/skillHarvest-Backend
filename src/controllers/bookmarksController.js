
import prisma from "../config/db.js";

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
                },
            },
            },
        });

        res.json({
            success: true,
            bookmarks,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bookmarks",
        });
        }
};

import prisma from '../config/db.js';


export const toggleLike = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const existing = await prisma.like.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId: id,
                },
            },
        });

        if (existing) {
            await prisma.like.delete({
                where: {
                    userId_videoId: {
                        userId,
                        videoId: id,
                    },
                },
            });

            return res.json({
                success: true,
                liked: false,
            });
        }

        await prisma.like.create({
            data: {
                userId,
                videoId: id,
            },
        });
        const likeCount = await prisma.like.count({
            where: { videoId: id },
        });


        res.json({
            success: true,
            liked: true,
            likeCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to toggle like",
        });
    }
};
export const getLikedVideos = async (req, res) => {
    try {
        const userId = req.user.id;

        const likedVideos = await prisma.like.findMany({
            where: { userId },
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
            orderBy: {
                createdAt: "desc",
            },
        });

        const formattedVideos = likedVideos.map(l => ({
            ...l.video,
            views: l.video.views || 0,
            tags: l.video.tags.map(vt => vt.tag),
        }));

        res.json({
            success: true,
            count: formattedVideos.length,
            videos: formattedVideos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch liked videos",
        });
    }
};

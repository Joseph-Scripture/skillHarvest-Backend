import prisma from '../config/db.js'


export const getTrendingVideos = async (req, res) => {
    try {
        const videos = await prisma.video.findMany({
            orderBy: [
                { views: "desc" },
                { createdAt: "desc" },
            ],
            take: 10,
            include: {
                user: { select: { id: true, name: true } },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        ratings: true,
                        bookmarks: true,
                    },
                },
            },
        });

        const formattedVideos = videos.map(video => ({
            ...video,
            views: video.views || 0,
        }));

        res.json({
            success: true,
            count: formattedVideos.length,
            videos: formattedVideos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch trending videos",
        });
    }
};


export const getSimilarVideos = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await prisma.video.findUnique({
            where: { id },
            include: {
                tags: { select: { tagId: true } },
                crops: { select: { cropId: true } },
            },
        });

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const tagIds = video.tags.map(t => t.tagId);
        const cropIds = video.crops.map(c => c.cropId);

        const similarVideos = await prisma.video.findMany({
            where: {
                id: { not: id },
                OR: [
                    {
                        tags: {
                            some: {
                                tagId: { in: tagIds },
                            },
                        },
                    },
                    {
                        crops: {
                            some: {
                                cropId: { in: cropIds },
                            },
                        },
                    },
                ],
            },
            take: 10,
            include: {
                user: { select: { id: true, name: true } },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                        ratings: true,
                        bookmarks: true,
                    },
                },
            },
        });

        const formattedVideos = similarVideos.map(video => ({
            ...video,
            views: video.views || 0,
        }));

        res.json({
            success: true,
            count: formattedVideos.length,
            videos: formattedVideos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch similar videos",
        });
    }
};


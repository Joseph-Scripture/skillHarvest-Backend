import prisma from '../config/db.js';

export const getVideosByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const videos = await prisma.video.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        experience: true,
                    },
                },
                tags: {
                    include: {
                        tag: true,
                    },
                },
                crops: {
                    include: {
                        crop: true,
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                experience: true,
                            },
                        },
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        ratings: true,
                        bookmarks: true,
                    },
                },
            },
        });

        const formattedVideos = videos.map(video => ({
            ...video,
            tags: video.tags.map(vt => vt.tag),
            crops: video.crops.map(vc => vc.crop)
        }));

        return res.status(200).json({
            success: true,
            count: formattedVideos.length,
            videos: formattedVideos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user videos",
        });
    }
};


// Get videos by tag
export const getVideosByTag = async (req, res) => {
    const { tag } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [videos, total] = await Promise.all([
            prisma.video.findMany({
                where: {
                    tags: {
                        some: {
                            tag: {
                                name: tag
                            }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            experience: true,
                        },
                    },
                    tags: {
                        include: { tag: true },
                    },
                    crops: {
                        include: { crop: true },
                    },
                    _count: {
                        select: {
                            comments: true,
                            ratings: true,
                            bookmarks: true,
                        },
                    },
                },
            }),
            prisma.video.count({
                where: {
                    tags: {
                        some: {
                            tag: {
                                name: tag
                            }
                        }
                    }
                }
            }),
        ]);

        const formattedVideos = videos.map(video => ({
            ...video,
            tags: video.tags.map(vt => vt.tag),
            crops: video.crops.map(vc => vc.crop)
        }));

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalVideos: total,
            videos: formattedVideos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch videos by tag",
        });
    }
};


export const getGlobalVideos = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const [videos, total] = await Promise.all([
            prisma.video.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            experience: true,
                        },
                    },
                    tags: {
                        include: { tag: true },
                    },
                    crops: {
                        include: { crop: true },
                    },
                    _count: {
                        select: {
                            comments: true,
                            ratings: true,
                            bookmarks: true,
                        },
                    },
                },
            }),
            prisma.video.count(),
        ]);

        const formattedVideos = videos.map(video => ({
            ...video,
            tags: video.tags.map(vt => vt.tag),
            crops: video.crops.map(vc => vc.crop)
        }));

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(total / limit),
            totalVideos: total,
            videos: formattedVideos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch videos",
        });
    }
};

import prisma from "../config/db.js";
export const toggleFollow = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
        return res.status(400).json({
            message: "You cannot follow yourself",
        });
    }

    try {
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: userId,
                },
            },
        });

        let following;

        if (existingFollow) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: userId,
                    },
                },
            });

            following = false;
        } else {
            await prisma.follow.create({
                data: {
                    followerId: currentUserId,
                    followingId: userId,
                },
            });

            following = true;
        }

        // FAST COUNTS (DB-level)
        const [followersCount, followingCount] = await Promise.all([
            prisma.follow.count({
                where: { followingId: userId },
            }),
            prisma.follow.count({
                where: { followerId: userId },
            }),
        ]);

        return res.json({
            success: true,
            following,
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to toggle follow",
        });
    }
};




export const getFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const [followers, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followingId: userId },
                include: {
                    follower: {
                        select: {
                            id: true,
                            name: true,
                            experience: true,
                        },
                    },
                },
            }),
            prisma.follow.count({
                where: { followingId: userId },
            }),
        ]);

        res.json({
            success: true,
            count: total,
            followers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch followers",
        });
    }
};



export const getFollowStats = async (req, res) => {
    const { userId } = req.params;

    try {
        const [followersCount, followingCount] = await Promise.all([
            prisma.follow.count({
                where: { followingId: userId },
            }),
            prisma.follow.count({
                where: { followerId: userId },
            }),
        ]);

        return res.json({
            success: true,
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch follow stats",
        });
    }
};

export const checkFollowStatus = async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    try {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: userId,
                },
            },
        });

        res.json({
            success: true,
            isFollowing: !!follow,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to check follow status",
        });
    }
};


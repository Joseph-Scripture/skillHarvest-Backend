import prisma from "../config/db.js";

export const incrementViews = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.video.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
        res.status(204).send()

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to increment views" })
    }
}

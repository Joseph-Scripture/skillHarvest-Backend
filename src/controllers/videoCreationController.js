import cloudinary from "../config/cloudinary.js";
import prisma from "../config/db.js";


export const createVideo = async (req, res) => {
    let { title, description, tags = [] } = req.body;


    if (typeof tags === 'string') {
        try {
            if (tags.trim().startsWith('[') && tags.includes("'")) {
                tags = tags.replace(/'/g, '"');
            }
            tags = JSON.parse(tags);
        } catch (e) {
            tags = tags.split(',').map(tag => tag.trim());
        }
    }


    try {

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Video file is required" });
        }

        // Upload directly from buffer to get duration in the same response
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "skillharvest/videos",
                    resource_type: "video",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const durationInSeconds = uploadResult.duration;
        const publicId = uploadResult.public_id;

        // Generate transformed URL using Cloudinary SDK for robustness
        const videoUrl = cloudinary.url(publicId, {
            resource_type: "video",
            secure: true,
            transformation: [
                { width: 1280, crop: "scale", quality: "auto", fetch_format: "auto" }
            ]
        });

        if (!durationInSeconds || durationInSeconds < 120 || durationInSeconds > 300) {

            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            }

            return res.status(400).json({
                message: "Invalid video: Duration must be between 2 and 5 minutes."
            });
        }

        const video = await prisma.video.create({
            data: {
                title,
                description,
                videoUrl,
                userId: req.user.id,
            },
        });

        for (const tagName of tags) {
            const normalized = tagName.trim().toLowerCase();
            const tag = await prisma.tag.upsert({
                where: { name: normalized },
                update: {},
                create: { name: normalized },
            });

            await prisma.videoTag.create({
                data: {
                    videoId: video.id,
                    tagId: tag.id,
                },
            });
        }

        return res.status(201).json({
            success: true,
            message: "Video created successfully",
            video,
        });
    } catch (error) {
        console.error("Error in createVideo:", error);
        return res.status(500).json({ message: "Failed to create video" });
    }
};
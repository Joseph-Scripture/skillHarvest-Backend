import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        // 1. Read token from cookie or Authorization header
        let token;

        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated, token missing",
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Fetch user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                experience: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists",
            });
        }

        // 4. Attach user to request
        req.user = user;

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

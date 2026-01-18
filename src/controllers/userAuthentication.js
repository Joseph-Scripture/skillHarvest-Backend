import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 24 * 60 * 60 * 1000,
};


export const register = async (req, res) => {
    const { name, email, password, farmLocation, farmType, gender, phoneNumber, DateOfBirth, experience } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                farmLocation,
                farmType,
                gender,
                phoneNumber,
                DateOfBirth: DateOfBirth && !Number.isNaN(new Date(DateOfBirth).getTime()) ? new Date(DateOfBirth) : null,
                experience,
            },
        });

        const token = generateToken(user.id);

        res.cookie("token", token, cookieOptions);

        const { password: _p, email: _e, ...userWithoutPassword } = user;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req, res) => {
    const { email, password, phoneNumber, name } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        if (phoneNumber !== user.phoneNumber || name !== user.name) {
            return res.status(401).json({ message: "Invalid phone number or name" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user.id);

        res.cookie("token", token, cookieOptions);

        const { password: _p, email: _e, resetCode:_resetCode,...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
    const token = jwt.sign({ id: user.id,email:user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return token;
};
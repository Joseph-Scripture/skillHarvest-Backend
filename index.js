import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'


// Importing routes
import AuthenticationRoutes from "./src/routes/AuthenticationRoutes.js";
import uploadVideoRoutes from "./src/routes/uploadVideoRoutes.js";


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());



// Using routes
app.use("/api/auth", AuthenticationRoutes);
app.use("/api/video", uploadVideoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message || "Unknown error"
    });
});

const server = app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
});

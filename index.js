import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.js';


// Importing routes
import AuthenticationRoutes from "./src/routes/AuthenticationRoutes.js";
import uploadVideoRoutes from "./src/routes/uploadVideoRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import ratingsRoutes from "./src/routes/ratingsRoutes.js";
import bookmarkRoutes from './src/routes/bookmarkRoutes.js';
import followRoutes from './src/routes/followRoutes.js';


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Using routes
app.use("/api/auth", AuthenticationRoutes);
app.use("/api/video", uploadVideoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/", bookmarkRoutes);
app.use("/api/follow", followRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

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
import passwordResetRoutes from './src/routes/passwordResetRoutes.js';


const app = express();



// app.use(cors(corsOptions));


const allowedOrigins = [
    'https://skill-harvest.vercel.app',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://127.0.0.1:5000'
];

const corsOptions = {
    origin: (origin, callback) => {
        // 1. Allow internal/non-browser requests (like Postman or mobile)
        if (!origin) {
            return callback(null, true);
        }

        // 2. Check if the origin is in our whitelist
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // 3. Block unauthorized origins
            console.error(`[CORS Error] Blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
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
app.use("/api/password-reset", passwordResetRoutes);
// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;

    // Only log actual 500 server errors to the terminal
    if (statusCode === 500) {
        console.error("Internal Server Error:", err);
    }

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Internal Server Error" : err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

const server = app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
});

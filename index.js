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
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5000',
    'http://localhost:5000',
];

// 2. Robust CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Log the origin for debugging on Render
        console.log('[CORS Filter] Incoming Request Origin:', origin);

        // Fail-safe for missing origin during redirects
        const effectiveOrigin = origin || '';

        if (!effectiveOrigin) {
            console.log('[CORS Filter] Allowing missing origin (likely direct or redirect)');
            return callback(null, true);
        }

        if (allowedOrigins.includes(effectiveOrigin)) {
            callback(null, true);
        } else {
            console.log(`[CORS Filter] Blocked Origin: ${effectiveOrigin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
};



// 2. CORS (Must be before any routes or body parsers)
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
server.timeout = 300000; // 5 minutes

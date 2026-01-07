import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";


// Importing routes
import AuthenticationRoutes from "./src/routes/AuthenticationRoutes.js";


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Using routes
app.use("/api/auth", AuthenticationRoutes);

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }   
    console.log(`Server is running on port ${process.env.PORT}`);
});
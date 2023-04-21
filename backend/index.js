import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connection from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();
connection();

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "https://code-daily-sachanayush47.vercel.app",
            "http://192.168.43.197:3000",
            "http://localhost:5173",
            "http://192.168.1.2:5173",
        ],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server started at port " + port));

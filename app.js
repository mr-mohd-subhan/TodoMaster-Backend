import cookieParser from "cookie-parser";
import express from "express";
import authRouter from "./routers/authRouter.js";
import cors from "cors";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import generalRouter from "./routers/generalRouter.js";
import taskRouter from "./routers/taskRouter.js";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
} else {
    app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use("/auth", authRouter);
app.use("/", generalRouter);
app.use("/task", taskRouter);

connectDB();

export default app;

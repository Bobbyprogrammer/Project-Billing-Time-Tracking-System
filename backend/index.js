import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
// Routes
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import timeLogRoutes from "./routes/timelog.routes.js";

dotenv.config();

const app = express();

connectDB();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/timelogs", timeLogRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

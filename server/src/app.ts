import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Api Working !" });
});

app.use("/api/v1/users", userRouter);

export default app;

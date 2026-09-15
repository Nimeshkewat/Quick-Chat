import "dotenv/config";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

//* Initialize socket server
export const io = new Server(server, {
  cors: { origin: "*" },
});

//* Store online users
export const userSocketMap: Record<string, string> = {};

//* Socker connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected: ", userId);

  if (userId) {
    userSocketMap[userId.toString()] = socket.id;
  }

  //* Emit online users to all connected client
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected: ", userId);
    delete userSocketMap[userId?.toString()!];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//* Middlewares
app.use(express.json({ limit: "4mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

//* Routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "Api Working !" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

export default app;

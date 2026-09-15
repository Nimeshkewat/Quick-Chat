import type { Request, Response } from "express";
import User from "../models/User.js";
import Message from "../models/Message.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { io, userSocketMap } from "../app.js";

//* Get all user except the logged in user
export const getUserForSidebar = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );

    //* count number of messages not seen
    const unseenMessages: Record<string, number> = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id.toString()] = messages.length;
      }
    });

    await Promise.all(promises);

    res
      .status(200)
      .json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

//* get all messages for selected user
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user.userId;

    if (typeof selectedUserId !== "string") return;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });

    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      {
        seen: true,
      },
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

//* api to mark messsage as seen using message
export const markMessageAsSeen = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

//* Send message to selected user
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    const receiverId = req.params.id;
    if (typeof receiverId !== "string") return;

    const senderId = req.user.userId;

    let imageUrl = "";
    if (req.file?.buffer) {
      const result = await uploadToCloudinary(req);
      imageUrl = result.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //* Emit the new message to the receiver's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

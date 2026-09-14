import type { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password, bio } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Account already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Account doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(400)
        .json({ success: false, message: "Jwt secret is not defined" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;
    const { fullname, bio } = req.body;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (user.profilePicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicId);
      } catch (error) {
        console.log("Failed to delete old profile photo", error);
      }
    }
    const result = await uploadToCloudinary(req);

    user.profilePic = result.secure_url || "";
    user.profilePicId = result.public_id || "";
    user.fullname = fullname || user.fullname;
    user.bio = bio || user.bio;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

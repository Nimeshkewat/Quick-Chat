import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
      };
    }
  }
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Not Authorized" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT Secret configuration missing on server.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = { userId: decoded.userId };
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: true,
      message:
        error instanceof Error ? error.message : "An Unknown error occured",
    });
  }
};

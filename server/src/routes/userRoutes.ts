import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/userController.js";
import { profile } from "console";
import { protectRoute } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";
import {
  imageLimiter,
  loginLimiter,
  registerLimiter,
} from "../middlewares/rateLimiters.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.get("/profile", protectRoute, profile);
router.put(
  "/update-profile",
  imageLimiter,
  protectRoute,
  upload.single("profilePic"),
  updateProfile,
);
router.get("/check-auth", protectRoute, checkAuth);

export default router;

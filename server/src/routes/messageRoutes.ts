import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  getMessages,
  getUserForSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", protectRoute, getUserForSidebar);
router.get("/:id", protectRoute, getMessages);
router.patch("/mark/:id", protectRoute, markMessageAsSeen);
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

export default router;

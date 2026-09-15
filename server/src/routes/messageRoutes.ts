import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import {
  getMessages,
  getUserForSidebar,
  markMessageAsSeen,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", protectRoute, getUserForSidebar);
router.get("/:id", protectRoute, getMessages);
router.patch("/mark/:id", protectRoute, markMessageAsSeen);

export default router;

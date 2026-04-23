import {createReel, getAllReels,getReelById,deleteReelById,addCommentReel,toggleLikeReel  } from "../controllers/reel.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/uploadCloudinary.js";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    authMiddleware,
    uploadCloudinary.single("media"),
    createReel,
);

router.get("/all", authMiddleware, getAllReels);
router.get("/:id", authMiddleware, getReelById);
router.delete("/:id", authMiddleware, deleteReelById);
router.put("/:id/like", authMiddleware, toggleLikeReel);
router.post("/:id/comment", authMiddleware, addCommentReel);

export default router;
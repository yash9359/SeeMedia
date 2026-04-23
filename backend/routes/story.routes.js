import {addCommentStory,createStory,deleteStoryById,getAllStories,toggleLikeStory,viewStory} from "../controllers/story.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/uploadCloudinary.js";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    authMiddleware,
    uploadCloudinary.single("media"),
    createStory,
);
router.get("/all", authMiddleware, getAllStories);
router.put("/:id/view", authMiddleware, viewStory);
router.delete("/:id", authMiddleware, deleteStoryById);
router.put("/:id/like", authMiddleware, toggleLikeStory);
router.post("/:id/comment", authMiddleware, addCommentStory);

export default router;
import {
    addCommentPost,
    createPost,
    deletePostById,
    getAllPosts,
    getPostById,
    toggleLikePost,
    toggleSavedPost, 
} from "../controllers/post.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/uploadCloudinary.js";
import { Router } from "express";

const router = Router();

router.post(
    "/create",
    authMiddleware,
    uploadCloudinary.single("media"),
    createPost,
);

router.get("/all", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPostById);
router.delete("/:id", authMiddleware, deletePostById);
router.put("/:id/like", authMiddleware, toggleLikePost);
router.post("/:id/comment", authMiddleware, addCommentPost);
router.put("/:postId/save", authMiddleware, toggleSavedPost);


export default router;

import { Router } from "express";
import {
    allUsers,
    followUser,
    getfollowers,
    getfollowing,
    getSuggestedUsers,
    getUserById,
    loginUser,
    logoutUser,
    profileUser,
    registerUser,
    unfollowUser,
    updateProfileData,
    uploadProfileImage,
} from "../controllers/user.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/uploadCloudinary.js";

const router = Router();

router.get("/suggested/users",authMiddleware,getSuggestedUsers)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", authMiddleware, profileUser);

router.get("/:id", authMiddleware, getUserById);
router.post("/follow/:targetId", authMiddleware, followUser);
router.post("/unfollow/:targetId", authMiddleware, unfollowUser);
router.get("/:id/followers", authMiddleware, getfollowers);
router.get("/:id/followings", authMiddleware, getfollowing);





///profile image ke liye bhi login hona jaruri hai isliye authMiddleware lagaya hai taki koi bhi user profile image upload naa kar sake bina login kiye huye
router.post(
    "/upload-profile",
    authMiddleware,
    uploadCloudinary.single("profileImage"),
    uploadProfileImage,
);

router.put(
    "/update-profile",
    authMiddleware,
    updateProfileData
);

/// authMidlleware users mai iss liye lagaya taki koi erra gerra ake naa dekhe bhai kitne ussres hai without login but abhi ke liye nahi lagayege
router.get("/all", authMiddleware, allUsers);

// default se naam badal  skte hai use karte time
export default router;

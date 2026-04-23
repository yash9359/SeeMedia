import { sendMessage ,getAllUsersForMessage,getMessages} from "../controllers/message.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadCloudinary from "../middleware/uploadCloudinary.js";
import { Router } from "express";

const router = Router();



router.get("/users", authMiddleware, getAllUsersForMessage);
router.get("/:receiverId", authMiddleware, getMessages);

router.post(
    "/send/:receiverId",
    authMiddleware,
    uploadCloudinary.single("media"),
    sendMessage,
);




export default router;

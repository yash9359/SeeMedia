import Message from "../models/message.model.js";
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { getReceiverSocketID, io } from "../socket/socket.js";
// send
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const senderId = req.user?._id;


        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { receiverId } = req.params;

        let mediaType = null;
        let mediaUrl = null;


        if (!text && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });
        }


        if (req.file && req.file.path) {
            mediaUrl = req.file?.path; // cloudinary URL
            mediaType = req.file.mimetype.startsWith("video")
                ? "video"
                : "image";
        }

        // create then save
        const newMessage = Message({
            senderId,
            receiverId,
            mediaType,
            mediaUrl,
            text,
        })

        await newMessage.save();

        //  emit message via webSocket.io

        const receiverSocketId = getReceiverSocketID(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }


        return res.status(200).json({
            success: true,
            data: newMessage,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong while sending message",
        });
    }
}

export const getMessages = async (req, res) => {
    try {

        const senderId = req.user?._id;

        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // const { text } = req.body;
        const { receiverId } = req.params;

        const message = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },


            ]
        }).sort({ createdAt: 1 }) // sort by createdAt in ascending order


        return res.status(200).json({
            success: true,
            data: message,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message || "Error something wrong while getting  messages",
        });
    }
}


export const getAllUsersForMessage = async (req, res) => {
    try {

        const loggedInUserId = req.user?._id;

        if (!loggedInUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }


        // const { id: receiverId } = req.params;

        const users = await User.find({
            _id: { $ne: loggedInUserId }
        }).select("-password")


        return res.status(200).json({
            success: true,
            users,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error something wrong while getting  users for  messaging",
        });
    }
}
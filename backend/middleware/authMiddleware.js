import jwt, { decode } from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req,res,next) => {

    try {
        const token = req.cookies.token || req.header("Authorization")?.split(" ")[1]; // ye dono tarike se token le sakte hai, cookie se ya header se

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not Found"
            })
        }

        req.user = user;
        next();



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error with authMiddleware"
        });
    }

}
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getReceiverSocketID, io } from "../socket/socket.js";

const isProduction = process.env.NODE_ENV === "production";

const getAuthCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 5 * 365 * 24 * 60 * 60 * 1000,
    path: "/",
});

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(422).json({ message: "All fields are Required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already used" });
        }
        const hashedPassword = bcrypt.hashSync(password, 8);
        //create new user
        const userData = new User({
            username,
            email,
            password: hashedPassword,
        });
        // save user to database
        const user = await userData.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1y",
        });
        const options = getAuthCookieOptions();

        // Exclude password from the response
        const { password: pass, ...rest } = user._doc;

        res.status(201).cookie("token", token, options).json({
            success: true,
            message: "User registered successfully",
            token,

            // rest of the user data without password
            user: rest,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Error with user registration" });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(422).json({ message: "All fields are Required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatchPassword = bcrypt.compareSync(password, user.password);

        if (!isMatchPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5y",
        });

        const options = getAuthCookieOptions();

        // Exclude password from the response
        const { password: pass, ...rest } = user._doc;

        res.status(201).cookie("token", token, options).json({
            success: true,
            message: "User logged in successfully",
            token,
            // rest of the user data without password
            user: rest,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Error with user login" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const options = getAuthCookieOptions();
        return res.status(200).clearCookie("token", options).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error with user logout",
        });
    }
};

export const profileUser = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
        success: true,
        user,
    });
};

export const uploadProfileImage = async (req, res) => {
    const userId = req.user._id;
    const profileImage = req.file?.path;
    try {
        if (!profileImage) {
            return res.status(400).json({
                success: false,
                message: "No profile image provided",
            });
        }

        const updateUserProfile = await User.findByIdAndUpdate(
            userId,
            { profileImage },
            { new: true },
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            user: updateUserProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading profile image",
        });
    }
};

export const allUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something Wrong With users!",
        });
    }
};

export const updateProfileData = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { username, email, phone, bio } = req.body;

        const updateData = {}
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (bio) updateData.bio = bio;



        const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Updated Successfully!",
            user,

        })



    } catch (error) {
        console.log("Error Something wrong while updating user details:", error);
        return res.status(500).json({
            success: false,
            message: "Something wrong while updating user details",
        })
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .select("-password")
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: "user",
                        select: "username profileImage",
                    },
                    {
                        path: "comments.user",
                        select: "username profileImage",
                    },
                ],
            })
            .populate({
                path: "reels",
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: "user",
                        select: "username profileImage",
                    },
                    {
                        path: "comments.user",
                        select: "username profileImage",
                    },
                ],
            })
            .populate({
                path: "savedPosts",
                options: { sort: { createdAt: -1 } },
                populate: [
                    {
                        path: "user",
                        select: "username profileImage",
                    },
                    {
                        path: "comments.user",
                        select: "username profileImage",
                    },
                ],
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            })
        }

        res.status(200).json({
            success: true,
            message: "Successfully!",
            user,
            posts: user.posts,
            reels: user.reels,
            saved: user.savedPosts,

        })



    } catch (error) {
        console.log("Error Something wrong while getting user by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Something wrong while getting user by ID",
        })
    }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.user?._id // follow karne wala user
        const targetId = req.params.targetId // jisko follow kar rahe hai

        if (userId.toString() === targetId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't follow yourself",
            });
        }
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user?.following.includes(targetId)) user.following.push(targetId);// A=>B
        if (!targetUser?.followers.includes(userId)) targetUser.followers.push(userId); //B=>A

        await user.save();
        await targetUser.save();

        //  socket notification for follow
        const followers = await User.findById(userId).select("username profileImage");



        const receiverSocketId = getReceiverSocketID(targetId);
        if (receiverSocketId) {

            //  follow notification
            const notification = {
                type: "follow",
                userId: userId,
                targetUserId: targetId,
                userDetails: followers,
                message: `${followers.username} started following you`,
                createdAt: new Date(),
            }
            io.to(receiverSocketId).emit("notification", notification);

        }




        return res.status(200).json({
            success: true,
            message: "Followed successfully",
            followers: targetUser.followers,
            following: user.following,
        });



    } catch (error) {
        console.log("Error Something wrong while following user", error);
        return res.status(500).json({
            success: false,
            message: "Something wrong while following user",
        });
    }
}


export const unfollowUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        const targetId = req.params.targetId;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!user || !targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.following.includes(targetId)) {
            return res.status(400).json({
                success: false,
                message: "You are not following this user",
            });
        }

        // A → B remove
        user.following = user.following.filter(
            (id) => id.toString() !== targetId.toString()
        );

        // B → A remove
        targetUser.followers = targetUser.followers.filter(
            (id) => id.toString() !== userId.toString()
        );

        await user.save();
        await targetUser.save();

        const unfollower = {
            _id: user._id,
            username: user.username,
            profileImage: user.profileImage,
        };


        const receiverSocketId = getReceiverSocketID(targetId);
        if (receiverSocketId) {

            //  follow notification
            const notification = {
                type: "unfollow",
                userId: userId,
                targetUserId: targetId,
                userDetails: unfollower,
                message: `${unfollower?.username} unfollowed you`,
                createdAt: new Date(),
                action: "remove"
            }
            
            io.to(receiverSocketId).emit("notification", notification);

        }

        return res.status(200).json({
            success: true,
            message: "Unfollowed successfully",
            followers: targetUser.followers,
            following: user.following,
        });

    } catch (error) {
        console.log("Error Something wrong while Unfollowing user", error);
        return res.status(500).json({
            success: false,
            message: "Something wrong while Unfollowing user",
        });
    }
};


export const getfollowers = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id)
            .select("followers")
            .populate("followers", "username profileImage");


        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Followers Fetched successfully",
            followers: user.followers,

        });

    } catch (error) {
        console.log("Error Something wrong while getting  user's followers", error);
        return res.status(500).json({
            success: false,
            message: "Something wrong while getting user's followers",
        });
    }
}


export const getfollowing = async (req, res) => {
    try {

        const { id } = req.params;
        const user = await User.findById(id).select("following").populate(
            "following",
            "username profileImage"
        )


        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Following fetched successfully",
            following: user.following,

        });

    } catch (error) {
        console.log("Error Something wrong while getting  user's following", error);
        return res.status(500).json({
            success: false,
            message: "Something wrong while getting user's following",
        });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUserId = req.user?._id;
        const suggestedUsers = await User.find({
            _id: { $ne: currentUserId, $nin: req.user.following || [] },
        }).select("username profileImage").limit(10);

        res.status(200).json({
            success: true,
            users: suggestedUsers,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch suggested Users"
        })
    }
}


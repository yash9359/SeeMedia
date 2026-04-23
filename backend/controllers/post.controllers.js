import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { getReceiverSocketID, io } from "../socket/socket.js";

// Create POst
export const createPost = async (req, res) => {
    try {
        const { caption, mediaType } = req.body;
        const userId = req.user._id;
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const mediaUrl = req.file?.path;

        const post = await Post.create({
            user: userId,
            mediaType,
            mediaUrl,
            caption,
        });

        const user = await User.findById(userId);

        if(user){
            user?.posts.push(post?._id);

            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Post created successfully",
            post,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong while creating post",
        });
    }
}


// Get all posts

export const getAllPosts = async (req, res) => {

    try {

        const posts = await Post.find().populate("user", "username profileImage").populate("comments.user", "username profileImage").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            posts,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with all posts",
        });
    }
}



// Get post By Id

export const getPostById = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id).populate("user", "username profileImage").populate("comments.user", "username profileImage");

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post not found",
            });
        }



        return res.status(200).json({
            success: true,
            post,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with Post with Id",
        });
    }
}

// delete post by Id

export const deletePostById = async (req, res) => {

    try {
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);
        if (!post || post.user.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauthorished user or Post Not found",
            });
        }

        // post delete ho gyi
        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted Successfully ",
            post
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with Post with deleting!",
        });
    }
};


// Like or Unlike a post
export const toggleLikePost = async (req, res) => {

    try {

        const userId = req.user._id;
        const {id} = req.params
        let post = await Post.findById(id);

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Post not found"
            })
        }

        const alreadyLiked = post.likes.some((uid)=>uid.toString() === userId.toString());
        if(alreadyLiked){
            await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
        }else{
            await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } });
        }
        
        //why => when we like the post user data has gone disapear
        post = await Post.findById(req.params.id).populate("user","username profileImage").populate({
            path: "comments.user",
            select: "username profileImage",
        })

        // socket notification
        if(post?.user?._id.toString() !== userId.toString()){
            const user = await User.findById(userId).select("username profileImage");
            const receiverSocketId = getReceiverSocketID(post?.user?._id);
            if(receiverSocketId){

                // post like notifuication
                if(!alreadyLiked){
                    const notification ={
                        type:"like",
                        userId:userId,
                        userDetails:user,
                        postId: id,
                        message: `${user.username} liked your post`,
                        createdAt: new Date(),
                    }
                    io.to(receiverSocketId).emit("notification",notification);
                }else{
                    // post unlike notification
                    const notification ={
                        type:"unlike",
                        userId:userId,
                        postId: id,
                        action: "remove",
                        message: `${user.username} unliked your post`,
                        createdAt: new Date(),
                    }
                    io.to(receiverSocketId).emit("notification",notification);
                }
            }
        }

        return res.status(200).json({
            success: true,
            message:"Post like successfully",
            // post: post.likes,
            post,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error toggling like"
        })

    }
};


// Add Comment to a post

export const addCommentPost = async (req, res) => {
    try {
        const {text} = req.body;
        const userId = req.user._id;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({
                success: false,
                message:"Post not Found",
            })
        }


        const comment = {
            user: userId,
            text,
            createdAt: new Date(),
        }

        post.comments.push(comment);

        await  post.save();

        const updatePost = await Post.findById(post._id).populate("comments.user","username profileImage ");
        
        return res.status(200).json({
            success: true,
            message:"Comment successfully",
            comments: updatePost.comments,
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error Something Wrong with while  Commenting"
        })


    }
}


// save or Unsave a post
export const toggleSavedPost = async (req, res) => {

    try {

        const userId = req.user._id;
        const {postId} = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        //return true or false
        const alreadySaved = user.savedPosts.some((id)=> id.toString() === postId.toString());

        if (alreadySaved) {
            user.savedPosts = user.savedPosts.filter((id)=> id.toString() !== postId.toString());

        }
        else {
            user.savedPosts.push(postId);
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message:alreadySaved ?"Post unsaved successfully"
        : "Post saved successfully",
            savedPosts: user.savedPosts,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error something wrong with user save post !"
        })

    }
};


import Reel from "../models/reel.model.js"
import User from "../models/user.model.js"

// Create reel
export const createReel = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.user._id;
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }
        const mediaUrl = req.file?.path;

        const reel = await Reel.create({
            user: userId,
            mediaUrl,
            caption,
        });
        
        const user = await User.findById(userId);

        if(user){
            user?.reels.push(reel?._id);

            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Reel created successfully",
            reel,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong while creating Reel",
        });
    }
}


// Get all Reels

export const getAllReels = async (req, res) => {

    try {

        const reels = await Reel.find().populate("user", "username profileImage").populate("comments.user", "username profileImage").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            reels,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with all Reels",
        });
    }
}



// Get Reel By Id

export const getReelById = async (req, res) => {

    try {

        const reel = await Reel.findById(req.params.id).populate("user", "username profileImage").populate("comments.user", "username profileImage");

        if (!reel) {
            return res.status(400).json({
                success: false,
                message: "Reel not found",
            });
        }



        return res.status(200).json({
            success: true,
            reel,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with Reel by Id",
        });
    }
}


// Like or Unlike a reel
export const toggleLikeReel = async (req, res) => {

    try {

        const userId = req.user._id;
        let reel = await Reel.findById(req.params.id);

        if (!reel) {
            return res.status(400).json({
                success: false,
                message: "Reel not found"
            })
        }

        const alreadyLiked = reel.likes.some((uid) => uid.toString() === userId.toString());

        if (alreadyLiked) {
            await Reel.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });
        }
        else {
            await Reel.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } });
        }

          reel = await Reel.findById(req.params.id).populate("user","username profileImage").populate({
                    path: "comments.user",
                    select: "username profileImage",
                })

        return res.status(200).json({
            success: true,
            message: alreadyLiked ? "Reel unliked successfully" : "Reel liked successfully",
            reel,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error toggling like"
        })

    }
};



// Add comment on Reel

export const addCommentReel = async (req, res) => {
    try {
        const {text} = req.body;
        const userId = req.user._id;
        const reel = await Reel.findById(req.params.id);

        if (!reel) {
            return res.status(400).json({
                success: false,
                message:"reel not Found",
            })
        }


        const comment = {
            user: userId,
            text,
            createdAt: new Date() ,
            
        }

        reel.comments.push(comment);

        await  reel.save();

        const updateReel = await Reel.findById(reel._id).populate("comments.user","username profileImage ");
        
        return res.status(201).json({
            success: true,
            message:"Comment successfully",
            comments: updateReel.comments,
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error Something Wrong with while  Commenting"
        })


    }
};


// delete reel by Id

export const deleteReelById = async (req, res) => {

    try {
        const userId = req.user._id;
        const reel = await Reel.findById(req.params.id);
        if (!reel || reel.user.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauthorished user or Reel Not found",
            });
        }

        // reel delete ho gyi
        await reel.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Reel deleted Successfully ",
            reel,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with  deleting the Reel !",
        });
    }
};
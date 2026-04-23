import Story from "../models/story.model.js";

// Create Story
export const createStory = async (req, res) => {
    try {
        const { mediaType } = req.body;
        const userId = req.user._id;

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const mediaUrl = req.file?.path;

        const story = await Story.create({
            user: userId,
            mediaType,
            mediaUrl,
        });

        return res.status(200).json({
            success: true,
            message: "story created successfully",
            story,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong while creating story",
        });
    }
};

// Get all Stories

export const getAllStories = async (req, res) => {
    try {
        const now = new Date();
        const userId = req.user?._id;
        const stories = await Story.find({
            expiresAt: { $gt: now },
            user: { $ne: userId },
        })
            .populate("user", "username profileImage")
            .populate({path :"comments.user",select: "username profileImage"} )
            .populate("viewers", "username profileImage")
            .sort({ createdAt: 1 });

        const storiesByUser = stories.reduce((acc,story)=>{
            const StoryuserId = story.user?._id;
            if(!acc[StoryuserId]){
                acc[StoryuserId]={
                    user: story.user,
                    stories: [],
                    hasUnViewed: false,

                }
            }
            const hasViewed = story?.viewers?.some((view)=> view?._id.toString() === userId.toString());
            if(!hasViewed){
                acc[StoryuserId].hasUnViewed =true;
            }
            acc[StoryuserId].stories?.push(story);
            return acc;
        },{});

        const userStories = await Story.find({
            user:  userId ,
            expiresAt: { $gt: now },
            
        }) .populate("user", "username profileImage")
            .populate({path :"comments.user",select: "username profileImage"} )
            .populate("viewers", "username profileImage")
            .sort({ createdAt: 1 });

        if(userStories.length>0){
            storiesByUser[userId] ={
                    user: req.user,
                    stories: userStories,
                    hasUnViewed: false,
                    isOwn:true,

            }
        }
        const storyArray = Object.values(storiesByUser);

        const sortedStories = storyArray.sort((a,b)=>{
            if(a.isOwn)return -1;
            if(b.isOwn)return 1;
            return 0;
        })

        return res.status(200).json({
            success: true,
            stories:sortedStories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with all stories",
        });
    }
};

// viewStory

export const viewStory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const story = await Story.findById(id);

        if (!story) {
            return res.status(400).json({
                success: false,
                message: "Story not found",
            });
        }

        if (!story.viewers.includes(userId)) {
            story.viewers.push(userId);
            await story.save();
        }

        return res.status(200).json({
            success: true,
            message: "Story viewed!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with all View story",
        });
    }
};

// Like or Unlike a Story
export const toggleLikeStory = async (req, res) => {
    try {
        const userId = req.user._id;
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(400).json({
                success: false,
                message: "Story not found",
            });
        }

        const index = story.likes.indexOf(userId);

        if (index === -1) {
            story.likes.push(userId);
        } else {
            story.likes.splice(index, 1);
        }

        await story.save();

        return res.status(200).json({
            success: true,
            message: "Story liked successfully",
            // story: story.likes,
            story,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error toggling story like",
        });
    }
};

// Add Comment to a story

export const addCommentStory = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user._id;
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(400).json({
                success: false,
                message: "Post not Found",
            });
        }

        const comment = {
            user: userId,
            text,
            createdAt: new Date(),
        };

        story.comments.push(comment);

        await story.save();

        const updateStory = await Story.findById(story._id).populate(
            "comments.user",
            "username profileImage ",
        );

        return res.status(200).json({
            success: true,
            message: "Comment successfully",
            comments: updateStory.comments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error Something Wrong with while  Commenting",
        });
    }
};

export const deleteStoryById = async (req, res) => {
    try {
        const userId = req.user._id;
        const story = await Story.findById(req.params.id);
        if (!story || story.user.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauthorished user or Story Not found",
            });
        }

        // story delete ho gyi
        await story.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Story deleted Successfully ",
            story,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error something wrong with  deleting the Story !",
        });
    }
};

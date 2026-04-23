import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    mediaUrl:{
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            text: String,
            createdAt: Date,
        }

    ],



}, { timestamps: true })

const Post = mongoose.model("Post", postSchema);

export default Post;
import mongoose, { Schema } from "mongoose";

const reelSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mediaUrl: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
        },
        likes: [
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                text: String,
                createdAt: Date,
            },
        ],
    },
    { timestamps: true },
);

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;

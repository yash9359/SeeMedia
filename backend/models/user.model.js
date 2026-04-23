import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    
    username:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
    },
    profileImage:{
        type: String,
    },
    bio:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default: false,
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    savedPosts :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    reels:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel",
        }
    ],
    story:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story",
        }
    ]


},{timestamps:true})

const User = mongoose.model("User",userSchema);

export default User;
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js"
import reelRouter from "./routes/reel.routes.js"
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";
import connectDb from "./db/connectDb.js"
import { app, server } from "./socket/socket.js";
// const app = express();
const PORT = process.env.PORT || 3000;

const corsInstance = {
    origin: ["http://localhost:5173"],
    credentials: true, // Allow cookies to be sent,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
}



//middleware
app.use(cors(corsInstance));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());



//routers
app.use("/api/users", userRouter); // http:8000/api/user/register
app.use("/api/posts", postRouter);
app.use("/api/reels", reelRouter);
app.use("/api/stories", storyRouter);
app.use("/api/messages", messageRouter)







app.get('/', (req, res) => {
    res.send('Hello kya baat hai');
});

connectDb();


server.listen(PORT, () => {
    console.log(`Your server is listening at http://localhost:${PORT}`);
});


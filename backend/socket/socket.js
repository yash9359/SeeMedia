import { Server } from "socket.io";
import http from "http";
import express from "express"

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://see-media.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);



const server = http.createServer(app);
const io = new Server(server,{
  cors:{
     origin: allowedOrigins,
    credentials: true, // Allow cookies to be sent,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

export const getReceiverSocketID = (userId)=>{
  return onlineUsersMap[userId] ;
}


// Store online Users userId =  socketId
let onlineUsersMap = {};

io.on("connection",(socket)=>{
    console.log("Socket connected:",socket.id);


    // Get userId from query params
    const userId = socket.handshake.query.userId
    if(userId){
      onlineUsersMap[userId] =socket.id;
      console.log(`User connected UserId : ${userId} SocketId : ${socket.id}`);
    }

    // Send updated online Users list to everyone
    io.emit("getOnlineUsers",Object.keys(onlineUsersMap));

    // Handle disconnected

    socket.on("disconnect",()=>{
      console.log("User disconnected: ", socket.id);

      for(const userId in onlineUsersMap){
        if(onlineUsersMap[userId] === socket.id) {
          delete onlineUsersMap[userId];
          break;
        }
      }
    
      io.emit("getOnlineUsers",Object.keys(onlineUsersMap));

    })

});


export {app,server,io}
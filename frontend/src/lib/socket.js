import {io} from 'socket.io-client';


const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.PROD
        ? 'https://seemedia.onrender.com'
        : 'http://localhost:8000');

let socket =null;

export const connectSocket = (userId)=>{

    if(!userId){
        console.warn("Socket connect skipped: missing userId");
        return null;
    }

    // Id socket already exsits and is connected
    if(socket?.connected){
        console.log("Socket already connected :");
        return socket;
    }

    // Id socket already exsits but  disconnected
    if(socket){
        console.log("Cleaning up previous socket");
        socket.disconnect();
        socket = null;
    }

    // Create new socket Connection

    socket = io(backendUrl,{
        query: {userId},
         withCredentials: true,
         transports:["websocket","polling"]
    })

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error?.message || error);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    return socket;




}

export const getSocket = () => socket;
export const disconnectSocket = () => {
    if(socket){
        console.log("Socket Disconnected");
        socket.disconnect();
        socket = null;
    }
};

export const isSocketConnected = () => {
   return socket?.connected || false
};

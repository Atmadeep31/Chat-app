import { PrismaClient } from "@prisma/client";
import { createAdapter } from "@socket.io/redis-adapter";
import { createServer } from "http";
import { Redis } from "ioredis";
import { Server } from "socket.io";

const prisma = new PrismaClient();
const pubClient = new Redis(process.env.REDIS_URL!);
const subClient = pubClient.duplicate();
const httpServer = createServer();

const io = new Server(httpServer,{
    cors: {
        origin: "http://localhost:3000",
    },
    adapter: createAdapter(pubClient,subClient)
});
type ChatMessage = {
    user:string,
    text:string;
}
// Maps to map Username and Rooms to a particukar socket id
let socketUserMap = new Map<string,string>();
let socketRoomMap = new Map<string,any>();
let socketUserIdMap = new Map<string,string>();
// any socket connects to server
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* Server recieves a socket connection with room and username, it will now channel 
    the user's message for that particular room*/
    socket.on("join-room",({room,username,userId})=>{
      socket.join(room);
      socketUserMap.set(socket.id,username);
      socketUserIdMap.set(socket.id, userId);

      const usercheck = socketUserMap.get(socket.id);
      console.log(`${usercheck} joined this ${socket.id}`);
      socketRoomMap.set(socket.id,room);
      console.log(`${username} joined ${room}`);
      // server is sending a message in that particular room that a user has joined
      
      io.to(room).emit("user-joined",{username,room});
    })
    
    // When server recieves chat-message from a server, it broadcasts to every member of that chat-room
    socket.on("chat-message", async ({room,msg,userId}) => {
      console.log(`${msg.user} : ${msg.text}`);
  
      // send to all clients
      socket.broadcast.to(room).emit("chat-message",msg)
      try {
        await prisma.message.create({
          data:{
            content:msg.text,
            roomId:room,
            userId:userId
          }
        })
      } catch (error) {
        console.error("Failed to save message:", error);
      }
    });
    
    // When a socket disconnects from a server
    socket.on("disconnect", () => {
      
      const username = socketUserMap.get(socket.id);
      console.log(`${username}`);
      console.log("User disconnected:", socket.id);
      
      // Server retrieves the room and the username of the socket using socket.id
      const room = socketRoomMap.get(socket.id);
      console.log("Disconnecting user:", username, "Room:", room);
      // Socket broadcasts to that room's other members that an user has left the room by sending taht username,room to all members of that room
      if(room && username){
        socket.broadcast.to(room).emit("user-left", { username, room });
      }
      
    });
  });
  const PORT = process.env.PORT || 3001
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on ${PORT}`);
  });

  //Command to run different servers
  // $env:PORT=3001; npx ts-node socket-server/server.ts
  // $env:PORT=3002; npx ts-node socket-server/server.ts
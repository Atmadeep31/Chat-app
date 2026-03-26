"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { CreateTask } from "./actions/createname";
import { JoinRoom } from "./actions/joinroom";
import { CreateRoom } from "./actions/createroom";
import UserSetup from "@/components/UserSetup";
import RoomSetup from "@/components/RoomSetup";
import ChatBox from "@/components/ChatBox";
import { SignIn, useUser } from "@clerk/nextjs";
import { SyncUser } from "./actions/syncUser";
import { getMessages } from "./actions/getMessages";
import AllRooms from "@/components/AllRooms";
import UserSignIn from "@/components/SignIn";

type ChatMessage = {
  user: string;
  text: string;
};

export default function Page() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joinroom, setjoinRoom] = useState("");
  const [createroom, setcreateRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userSynced, setUserSynced] = useState(false);
  // Use a ref to store the socket instance
  const socketRef = useRef<Socket | null>(null);
  const { user, isLoaded, isSignedIn } = useUser();
  useEffect(() => {
    if (user && isLoaded && isSignedIn) {
      SyncUser(
        user.id,
        user.fullName!,
        user.emailAddresses[0].emailAddress
      ).then(() => {
        setUserSynced(true)
        setUsername(user!.fullName ?? "")
        setUserId(user.id)
      })
    }
  }
    , [user, isLoaded, isSignedIn])
  useEffect(() => {
    // const name = prompt("Enter your name") || "Anonymous";
    // setUsername(name);

    // Create socket connection
    console.log("Connecting to socket at:", "http://localhost:3001")
    socketRef.current = io("http://localhost:3001");
    const socket = socketRef.current;
    //when socket connects to server
    socket.on("connect", () => {
      console.log("Connected with socket ID:", socket.id);
    });
    // When a user joins a room !!
    socket.on("user-joined", ({ username, room }) => {
      console.log("Received user-joined:", username, room);
      setMessages((prev) => [
        ...prev,
        {
          user: "System",
          text: `${username} joined ${room}`
        }
      ]);
    });
    // on event "user left" i.e anyone in the room leaves the room, every socket recieves that room and that username from server
    socket.on("user-left", ({ username, room }) => {
      console.log("Received user-left:", username, room);
      setMessages((prev) => [
        ...prev,
        {
          user: "System",
          text: `${username} left ${room}`
        }
      ]);
    });
    // when socket has a chat message , updates the messages array to add new messages ..check sendMessage function
    socket.on("chat-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    // Once client disconnects, socket closes
    return () => {
      console.log("Cleanup: disconnecting socket");
      socket.disconnect();
    };
  }, []);

  // Function to join room/ create room :- both same here, just filter messages for particular room
  const joinRoom = async (id: string, roomName: string) => {

    if (!roomName || !socketRef.current) return;

    const prevMessages = await getMessages(id);
    setMessages(prevMessages);

    console.log("Joining room:", roomName, "with username:", username);
    // emits the room's name and username to server to make join operation
    socketRef.current.emit("join-room", { room: id, username, userId });
    setRoomId(id);
    setRoom(roomName);
    setJoined(true);
    setcreateRoom("");
    setjoinRoom("");
  };
  // Function to send message to server
  const sendMessage = () => {
    if (!message || !username || !socketRef.current) return;

    const msg: ChatMessage = {
      user: username,
      text: message,
    };
    // socket is emitting message to server. socket 1 sends a message to server. Server then broadcasts that message to everyone.
    setMessages((prev) => [...prev, msg])
    socketRef.current.emit("chat-message", { room: roomId, msg, userId });
    setMessage("");
  };

  // const CreateUser = async () => {
  //   const userId = await CreateTask(username, email);
  //   setUserId(userId);
  // }

  const handleCreateRoom = async () => {
    console.log("createroom value:", createroom);
    const roomId = await CreateRoom(userId, createroom)
    console.log("roomId:", roomId);
    setRoomId(roomId);
    joinRoom(roomId, createroom)
  }

  const handleJoinRoom = async () => {
    const result = await JoinRoom(joinroom, userId)
    if (result.status === 404) {

      console.error("Failed to join room:");
      return
    }
    else {
      joinRoom(result.roomId!, result.roomname!)
    }

  }
  //Loader
  if (!userSynced) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 gap-4">
      
      <svg className="w-8 h-8 animate-spin text-violet-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
  
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-600">
        Loading...
      </p>
  
    </div>
  );


  return (
    <div className="h-screen flex bg-zinc-950 text-zinc-100 font-sans">

      {/* LEFT PANEL — always visible */}
      <div className="w-80 shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800 shadow-xl">

        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800">
          <h1 className="text-sm font-semibold tracking-widest uppercase text-zinc-400">
            Chat App
          </h1>
        </div>

        {/* User badge */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {username?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100 leading-tight">{username}</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {joined ? (
                  <span className="text-emerald-400">● Connected · {room}</span>
                ) : (
                  <span>Not in a room</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Room Setup */}
        <div className="px-6 py-5 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">

          </p>
          <RoomSetup
            createroom={createroom}
            joinroom={joinroom}
            setcreateRoom={setcreateRoom}
            setjoinRoom={setjoinRoom}
            handleCreateRoom={handleCreateRoom}
            handleJoinRoom={handleJoinRoom}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <AllRooms
          userId={userId}
          createroom={createroom}
          onRoomSelect={(roomId, roomName) => joinRoom(roomId, roomName)}
        />
        </div>
        
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="h-14 shrink-0 flex items-center px-6 border-b border-zinc-800 bg-zinc-900">
          <span className="text-sm text-zinc-400">
            {joined ? (
              <>
                <span className="text-zinc-600 mr-2">#</span>
                <span className="font-medium text-zinc-200">{room}</span>
              </>
            ) : (
              <span className="text-zinc-600">No room selected</span>
            )}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-zinc-900">
          {!joined ? (
            <div className="flex flex-col items-center gap-3 select-none">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl shadow-inner">
                💬
              </div>
              <p className="text-zinc-500 text-sm font-medium tracking-wide">
                Join or create a room to start chatting
              </p>
            </div>
          ) : (
            <ChatBox
              messages={messages}
              room={room}
              username={username}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          )}
        </div>

      </div>
    </div>
  );
}




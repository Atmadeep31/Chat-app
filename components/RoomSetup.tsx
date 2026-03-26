"use client"
interface ChildProps  {
    createroom : string,
    joinroom : string,
    setcreateRoom:(createroom:string)=> void,
    setjoinRoom:(joinroom:string)=> void,
    handleCreateRoom :() => void
    handleJoinRoom: () => void
}

const RoomSetup = ({createroom,setcreateRoom,handleCreateRoom,joinroom,setjoinRoom,handleJoinRoom}:ChildProps) => { 

  return (
    <div className="flex flex-col gap-6">
  
      {/* Create Room */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
          Create Room
        </label>
        <input
          value={createroom}
          onChange={(e) => setcreateRoom(e.target.value)}
          placeholder="Room name..."
          className="bg-zinc-800 text-zinc-100 placeholder-zinc-600 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 transition"
          maxLength={50}
        />
        <button
          onClick={handleCreateRoom}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-medium rounded-xl transition duration-150 shadow-lg shadow-violet-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!createroom.trim()}
        >
          Create Room
        </button>
      </div>
  
      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-600">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>
  
      {/* Join Room */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
          Join Room
        </label>
        <input
          value={joinroom}
          onChange={(e) => setjoinRoom(e.target.value)}
          placeholder="Room name..."
          className="bg-zinc-800 text-zinc-100 placeholder-zinc-600 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-500 transition"
          maxLength={50}
        />
        <button
          onClick={handleJoinRoom}
          className="px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 active:scale-95 text-white text-sm font-medium rounded-xl transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled = {!joinroom.trim()}
        >
          Join Room
        </button>
      </div>
  
    </div>
  );
}

export default RoomSetup;
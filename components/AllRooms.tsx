"use client"

import { FetchRooms } from "@/app/actions/fetchrooms"
import { useEffect, useState } from "react"

type roomType = {
    name : string,
    id: string
}
interface ChildProps {
    userId : string,
    createroom:string,
    onRoomSelect : (roomId : string, roomName:string) => void
}

const AllRooms = ({userId,createroom,onRoomSelect}:ChildProps) => {
    const [roomstatus,setRoomStatus] = useState(false)
    const [rooms,setRooms] = useState<roomType[]>([])
    useEffect (()=>{
        const fetchrooms =async () => {
            const allrooms = await FetchRooms(userId);
            setRooms(allrooms);
            setRoomStatus(true);
        }
        console.log("useEffect fired, createroom:", createroom)
        fetchrooms()
    },[userId,createroom])

    return (
        <div className="flex flex-col gap-2">
      
          <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
            Available Rooms
          </label>
      
          {!roomstatus ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-500 text-sm">
              <svg className="w-3.5 h-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Fetching rooms...
            </div>
      
          ) : rooms.length === 0 ? (
            <div className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-600 text-sm text-center italic">
              No rooms yet
            </div>
      
          ) : (
            <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onRoomSelect(room.id, room.name)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] cursor-pointer transition duration-150 group"
                >
                  <span className="text-zinc-600 group-hover:text-violet-400 transition text-sm">#</span>
                  <span className="text-sm text-zinc-200 font-medium truncate">{room.name}</span>
                </div>
              ))}
            </div>
          )}
      
        </div>
      );
}

export default AllRooms;
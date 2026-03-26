"use server"

import { prisma } from "@/lib/prisma"

export const FetchRooms = async (userId:string)=>{
    const rooms = await prisma.roomMember.findMany({
        where : {userId},
        include:{
            room:{
                select:{roomname:true,id:true}
            }
        }
    })
    return rooms.map((it)=>({
        name: it.room.roomname,
        id: it.room.id
    }));
}
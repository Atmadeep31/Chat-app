"use server"

import { prisma } from "@/lib/prisma"


export const CreateRoom = async (userId :string, roomname:string)=>{
    const room = await prisma.room.create({
        data:{
            roomname,
            userId,
            roommembers: {
                create: { userId }
            }
        }
    })

    return room.id;
}
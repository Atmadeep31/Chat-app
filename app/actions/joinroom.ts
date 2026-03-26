"use server"

import { prisma } from "@/lib/prisma"

export async function JoinRoom(roomId:string,userId:string){
    const room = await prisma.room.findUnique({
        where:{id:roomId}
    })
    if(!room) return {
        status: 404,
        roomId: null,
        roomname: null
    }
    const existingMember = await prisma.roomMember.findFirst({
        where: {roomId,userId}
    })
    if(!existingMember){
    await prisma.roomMember.create({
        data:{
            roomId,
            userId
        }
    })}
    return{
        status: 200,
        roomId: room.id,
        roomname: room.roomname
    }
}
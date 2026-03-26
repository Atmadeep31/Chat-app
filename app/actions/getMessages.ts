"use server"

import { prisma } from "@/lib/prisma"

export const getMessages = async(roomId:string)=>{
    const messages = await prisma.message.findMany({
        where : {roomId},
        orderBy : {sentAt: "asc"},
        take: 50,
        include:{
            user: {
                select: {name: true}
            }
        }
    })

    return messages.map((msg)=>({
        user: msg.user.name,
        text:msg.content
    }))
}
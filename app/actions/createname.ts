"use server"

import { prisma } from "@/lib/prisma"

export async function CreateTask(name:string,email:string) {
    const user = await prisma.user.create({
        data:{
            name,
            email
        }
    })
    return user.id;
}
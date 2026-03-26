"use server"

import { prisma } from "@/lib/prisma";

export const SyncUser = async (clerkId:string, name:string, email:string) => {
    
    await prisma.user.upsert({
        where: {email},
        update:{},
        create:{
            id: clerkId,
            name,
            email
        }
    })
    
}

;
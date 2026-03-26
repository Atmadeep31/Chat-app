"use client"

import { UserButton,useUser } from "@clerk/nextjs"

const Navbar = () => {
    const {isSignedIn,isLoaded} = useUser();
    if(!isSignedIn || !isLoaded) return null;

    return (
        <header className="flex justify-end items-center p-4 gap-4 h-16 bg-zinc-950 border-b border-zinc-800">
            <UserButton />
        </header>
    )
}

export default Navbar;
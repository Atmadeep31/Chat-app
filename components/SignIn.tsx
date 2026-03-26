"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs";


const UserSignIn = () => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 gap-6">

            {/* Logo / Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg shadow-violet-900/40">
                💬
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-1.5">
                <h1 className="text-zinc-100 text-xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-zinc-500 text-sm">Sign in or sign up to continue</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 w-64">
                <SignInButton>
                    <button className="w-full px-4 py-2.5 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-medium rounded-xl transition duration-150 shadow-lg shadow-violet-900/40">
                        Sign In
                    </button>
                </SignInButton>
                <SignUpButton>
                    <button className="w-full px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-100 text-sm font-medium rounded-xl transition duration-150">
                        Sign Up
                    </button>
                </SignUpButton>

            </div>

        </div>
    );
}

export default UserSignIn;
// app/sign-in/page.tsx
"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black py-20">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full
          bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent
          blur-[100px]" />
        <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full
          bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent
          blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 max-w-2xl relative z-10">
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Sign In to PureChain
        </h1>
        <p className="text-xl text-gray-300 text-center mb-12">
          Access your account to contribute to decentralized data quality.
        </p>

        {/* Clerk SignIn Component */}
        <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg flex justify-center">
          <SignIn          />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
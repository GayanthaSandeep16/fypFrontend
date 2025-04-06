"use client";

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ClientOnly } from "./ClientOnly"; // Adjust the import path as needed

export default function Navbar() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string | undefined;

  const links = [
    { label: "Transactions", href: "/transactions" },
    { label: "Reputation", href: "/reputation" },
    { label: "Admin Dashboard", href: "/admin-dashboard", requiredRole: "admin" },
    { label: "Contact Us", href: "/#contact" },
  ];

  return (
    <div className="bg-gray-900 border-b border-indigo-800/50 w-full">
      <header className="relative z-10 px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-white text-2xl font-extrabold tracking-tight">
                PureChain
              </span>
            </Link>
            <nav className="hidden ml-10 space-x-6 md:flex">
              {links.map((link) => {
                if (link.requiredRole) {
                  return (
                    <ClientOnly key={link.label}>
                      {userRole?.toLowerCase() === link.requiredRole.toLowerCase() && (
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-indigo-300 text-base font-medium transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      )}
                    </ClientOnly>
                  );
                }
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-300 hover:text-indigo-300 text-base font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-[100px] text-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200 text-sm font-medium">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-[100px] text-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors duration-200 text-sm font-medium">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                    userButtonTrigger: "border-2 border-indigo-500 rounded-full",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>
    </div>
  );
}
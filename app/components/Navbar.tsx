"use client";

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string | undefined;
  
  // Log the raw userRole
  console.log("Raw userRole:", userRole);

  const links = [
    { label: "Transactions", href: "/transactions" },
    { label: "Admin Dashboard", href: "/admin-dashboard", requiredRole: "admin" },
    { label: "Contact Us", href: "/#contact" },
  ];

  return (
    <div className="bg-gray-900 border-b border-indigo-800/50 w-full">
      <header className="relative z-10 px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-white text-2xl font-extrabold tracking-tight">
                PureChain
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden ml-10 space-x-6 md:flex">
              {links.map((link) => {
                // If the link requires a role, check if the user's role matches
                if (link.requiredRole) {
                  // Normalize both roles to lowercase for comparison
                  const normalizedUserRole = userRole?.toLowerCase();
                  const normalizedRequiredRole = link.requiredRole.toLowerCase();

                  // Log the comparison for debugging
                  console.log(
                    `Comparing roles for ${link.label}:`,
                    `userRole=${normalizedUserRole}, requiredRole=${normalizedRequiredRole}, match=${
                      normalizedUserRole === normalizedRequiredRole
                    }`
                  );

                  if (normalizedUserRole !== normalizedRequiredRole) {
                    return null;
                  }
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

          {/* Auth Buttons */}
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
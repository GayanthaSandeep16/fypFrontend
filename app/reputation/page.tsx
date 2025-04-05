"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface ReputationResponse {
  success: boolean;
  walletAddress: string;
  reputation: string; // String since API returns it as a string (e.g., "-1")
}

export default function Reputation() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [reputationData, setReputationData] = useState<ReputationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReputation = async () => {
      if (!isLoaded || !user) return;

      const walletAddress = user.unsafeMetadata.walletAddress as string;
      if (!walletAddress) {
        setError("Wallet address not found in your profile.");
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const response = await fetch("http://localhost:3000/api/reputation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ walletAddress }),
        });

        const data: ReputationResponse = await response.json();
        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch reputation");
        }

        setReputationData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, [isLoaded, user, getToken]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Loading authentication...</p>
      </div>
    );
  }

  const reputation = reputationData ? parseInt(reputationData.reputation) : null;
  const isBlacklisted = reputation !== null && reputation < 0;

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-2xl relative z-10 text-center">
        <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
          Your PureChain Reputation
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          See how your contributions impact the community.
        </p>

        {loading ? (
          <p className="text-white text-lg">Fetching your reputation...</p>
        ) : error ? (
          <p className="text-red-400 text-lg">{error}</p>
        ) : reputationData ? (
          <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg border border-blue-500/30">
            <div className="mb-6">
              <p className="text-gray-200 text-lg">
                Wallet: <span className="font-mono text-blue-400">{reputationData.walletAddress.slice(0, 6)}...{reputationData.walletAddress.slice(-4)}</span>
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              {/* Reputation Gauge */}
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isBlacklisted ? "bg-red-600/20 border-4 border-red-500" : "bg-blue-600/20 border-4 border-blue-500"}`}>
                <span className={`text-4xl font-bold ${isBlacklisted ? "text-red-400" : "text-blue-400"}`}>
                  {reputation}
                </span>
              </div>

              {/* Status Message */}
              <h2 className={`mt-6 text-2xl font-semibold ${isBlacklisted ? "text-red-400" : "text-white"}`}>
                {isBlacklisted ? "Blacklisted" : "Trusted Contributor"}
              </h2>
              <p className="mt-2 text-gray-300">
                {isBlacklisted
                  ? "Your reputation has fallen below zero. Improve it by contributing quality data!"
                  : "Your data helps power trustworthy AI. Keep it up!"}
              </p>
            </div>

            {/* Creative Touch */}
            <div className="mt-8">
              {isBlacklisted ? (
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                </svg>
              ) : (
                <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-lg">No reputation data available.</p>
        )}

        <div className="mt-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
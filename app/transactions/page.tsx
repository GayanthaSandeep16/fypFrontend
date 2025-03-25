"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTransactionStore } from "@/lib/transactionStore"; // Import the store

interface Transaction {
  message: string;
  transactionHash: string;
  from: string;
  status: string;
  events: {
    name: string;
    args: {
      user: string;
      uniqueId: string;
      ipfsHash?: string;
      reputationGain?: string;
    };
  }[];
  gasUsed: string;
}

export default function AllTransactions() {
  const { getToken } = useAuth();
  const setTransactions = useTransactionStore((state) => state.setTransactions); // Get the setTransactions action
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSubmissionsAndTransactions = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        const response = await axios.post(
          "http://localhost:3000/api/allSubmisson",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        console.log("Response from /allSubmisson:", response.data);

        const { transactions } = response.data;

        if (!transactions || transactions.length === 0) {
          setError("No transactions found.");
          setLoading(false);
          return;
        }

        setTransactions(transactions); // Store the transactions in zustand
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch transactions"
        );
        setLoading(false);
      }
    };

    fetchAllSubmissionsAndTransactions();
  }, [getToken, setTransactions]);

  const transactions = useTransactionStore((state) => state.transactions); // Get the transactions from the store

  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <p className="text-xl text-gray-300">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <p className="text-xl text-red-400">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <p className="text-xl text-gray-300">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
          All Transactions
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction, index) => {
            const isPenalized = transaction.events.some(
              (event) => event.name === "UserPenalized"
            );
            const statusColor = isPenalized ? "text-red-400" : "text-green-400";

            return (
              <Card
                key={index}
                className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20"
              >
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    Transaction #{index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-gray-200">
                      <strong>Status:</strong>{" "}
                      <span className={statusColor}>
                        {isPenalized ? "Penalized" : "Successful Submission"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Transaction Hash
                    </h3>
                    <p className="text-gray-200">
                      {shortenAddress(transaction.transactionHash)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">From</h3>
                    <p className="text-gray-200">{shortenAddress(transaction.from)}</p>
                  </div>
                  <Link href={`/transactions/${transaction.transactionHash}`}>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
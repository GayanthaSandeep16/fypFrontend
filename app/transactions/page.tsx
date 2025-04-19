"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useTransactionStore } from "@/lib/transactionStore";
import { Upload, Brain, AlertTriangle } from "lucide-react"; // Add icons from lucide-react

export default function AllTransactions() {
  const { getToken } = useAuth();
  const setTransactions = useTransactionStore((state) => state.setTransactions);
  const groupedTransactions = useTransactionStore(
    (state) => state.groupedTransactions
  );
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
          "https://54.169.111.231/api/allSubmisson",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        const { transactions } = response.data;

        if (!transactions || transactions.length === 0) {
          setError("No transactions found.");
          setLoading(false);
          return;
        }

        setTransactions(transactions);
        setLoading(false);
      } catch (err) {
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

  const shortenAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const getTransactionType = (events) => {
    if (events.some((e) => e.name === "ModelTrained")) return "Training";
    if (events.some((e) => e.name === "UserPenalized")) return "Penalty";
    if (events.some((e) => e.name === "DataSubmitted")) return "Submission";
    return "Other";
  };

  const getCardStyles = (type) => {
    switch (type) {
      case "Training":
        return {
          border: "border-purple-500",
          icon: <Brain className="h-5 w-5 text-purple-400" />,
          bg: "bg-purple-500/10",
        };
      case "Penalty":
        return {
          border: "border-red-500",
          icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
          bg: "bg-red-500/10",
        };
      case "Submission":
        return {
          border: "border-blue-500",
          icon: <Upload className="h-5 w-5 text-blue-400" />,
          bg: "bg-blue-500/10",
        };
      default:
        return {
          border: "border-gray-500",
          icon: null,
          bg: "bg-gray-500/10",
        };
    }
  };

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

  if (groupedTransactions.length === 0) {
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
          {groupedTransactions.map((transaction, index) => {
            const type = getTransactionType(transaction.events);
            const { border, icon, bg } = getCardStyles(type);
            const timestamp = new Date(transaction.created_at).toLocaleString();

            return (
              <Card
                key={index}
                className={`border-2 ${border} ${bg} transition-transform hover:scale-105`}
              >
                <CardHeader className="flex flex-row items-center gap-2">
                  {icon}
                  <CardTitle className="text-white text-lg">
                    {type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-200">
                    <strong>Hash:</strong> {shortenAddress(transaction.txHash)}
                  </p>
                  <p className="text-gray-200">
                    <strong>From:</strong> {shortenAddress(transaction.walletAddress)}
                  </p>
                  <p className="text-gray-200 text-sm">
                    <strong>When:</strong> {timestamp}
                  </p>
                  <Link href={`/transactions/${transaction.txHash}`}>
                    <Button className="w-full mt-2 bg-blue-600 text-white hover:bg-blue-700">
                      Details
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
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter at the top
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BsArrowLeft } from "react-icons/bs";
import { useTransactionStore } from "@/lib/transactionStore";

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

export default function TransactionDetails() {
  const params = useParams();
  const router = useRouter(); // Move useRouter to the top level
  const txHash = params?.txHash as string;
  const getTransactionByHash = useTransactionStore((state) => state.getTransactionByHash);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Params:", params);
    console.log("txHash from useParams:", txHash);

    if (!txHash) {
      console.log("No txHash provided.");
      setError("Transaction hash is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchedTransaction = getTransactionByHash(txHash);
    console.log("Fetched transaction from store:", fetchedTransaction);

    if (!fetchedTransaction) {
      setError("Transaction not found. Please go back and try again.");
      setLoading(false);
      router.push("/transactions"); // Use the router here
      return;
    }

    setTransaction(fetchedTransaction);
    setLoading(false);
  }, [txHash, getTransactionByHash, router]); // Add router to the dependency array

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-20">
        <p className="text-xl text-gray-300">Loading transaction details...</p>
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

  if (!transaction) return null;

  const isPenalized = transaction.events.some(
    (event) => event.name === "UserPenalized"
  );
  const statusColor = isPenalized ? "text-red-400" : "text-green-400";

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute right-[-225px] top-0 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-transparent blur-[100px]" />
        <div className="absolute bottom-[-350px] left-[-225px] h-[1000px] w-[1000px] rounded-full bg-gradient-to-tl from-purple-500/20 via-blue-700/30 to-transparent blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Transaction Details
            </CardTitle>
            <CardDescription className="text-gray-300">
              Gayantha - TechCorp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-gray-200">
                <strong>Status:</strong>{" "}
                <span className={statusColor}>
                  {isPenalized ? "Penalized" : "Successful Submission"}
                </span>
              </p>
              <p className="text-gray-200">{transaction.message}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Transaction Hash
              </h3>
              <p className="text-gray-200 break-all">
                {transaction.transactionHash}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">From</h3>
              <p className="text-gray-200">{transaction.from}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Gas Used</h3>
              <p className="text-gray-200">{transaction.gasUsed}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Events</h3>
              {transaction.events.map((event, index) => (
                <div
                  key={index}
                  className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-md"
                >
                  <h4 className="font-medium text-white">{event.name}</h4>
                  <div className="mt-2 space-y-2 text-gray-200">
                    {event.name === "DataSubmitted" && (
                      <>
                        <p>
                          <strong>User:</strong> {event.args.user}
                        </p>
                        <p>
                          <strong>Unique ID:</strong> {event.args.uniqueId}
                        </p>
                        <p>
                          <strong>IPFS Hash:</strong> {event.args.ipfsHash}
                        </p>
                      </>
                    )}
                    {event.name === "UserRewarded" && (
                      <>
                        <p>
                          <strong>User:</strong> {event.args.user}
                        </p>
                        <p>
                          <strong>Unique ID:</strong> {event.args.uniqueId}
                        </p>
                        <p>
                          <strong>Reputation Gain:</strong>{" "}
                          {event.args.reputationGain}
                        </p>
                      </>
                    )}
                    {event.name === "UserPenalized" && (
                      <>
                        <p>
                          <strong>User:</strong> {event.args.user}
                        </p>
                        <p>
                          <strong>Unique ID:</strong> {event.args.uniqueId}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => window.history.back()}
              className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
            >
              <BsArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
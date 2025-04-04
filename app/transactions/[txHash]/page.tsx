"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BsArrowLeft } from "react-icons/bs";
import { useTransactionStore } from "@/lib/transactionStore";

export default function TransactionDetails() {
  const params = useParams();
  const router = useRouter();
  const txHash = params?.txHash;
  const getTransactionByHash = useTransactionStore(
    (state) => state.getTransactionByHash
  );
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!txHash) {
      setError("Transaction hash is missing.");
      setLoading(false);
      return;
    }

    const fetchedTransaction = getTransactionByHash(txHash);
    if (!fetchedTransaction) {
      setError("Transaction not found.");
      setLoading(false);
      router.push("/transactions");
      return;
    }

    setTransaction(fetchedTransaction);
    setLoading(false);
  }, [txHash, getTransactionByHash, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!transaction) return null;

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-6">
        <Card className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 border-blue-500/20 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-200">
              <strong>Hash:</strong> {transaction.txHash}
            </p>
            <p className="text-gray-200">
              <strong>From:</strong> {transaction.walletAddress}
            </p>
            <div>
              <h3 className="text-lg font-semibold text-white">Events</h3>
              {transaction.events.map((event, index) => (
                <div key={index} className="mt-2 p-2 bg-blue-900/20 rounded">
                  <h4 className="text-white">{event.name}</h4>
                  {event.name === "DataSubmitted" && (
                    <>
                      <p className="text-gray-200">IPFS Hash: {event.args.ipfsHash}</p>
                      <p className="text-gray-200">Unique ID: {event.args.uniqueId}</p>
                    </>
                  )}
                  {event.name === "UserRewarded" && (
                    <p className="text-gray-200">Reputation Gain: {event.args.reputationGain}</p>
                  )}
                  {event.name === "ModelTrained" && (
                    <p className="text-gray-200">Model ID: {event.args.modelId}</p>
                  )}
                  {event.name === "UserPenalized" && (
                    <>
                      <p className="text-gray-200">Unique ID: {event.args.uniqueId}</p>
                      <p className="text-gray-200">Reputation Loss: {event.args.reputationLoss}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={() => router.push("/transactions")}
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
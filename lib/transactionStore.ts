import { create } from "zustand";

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

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  getTransactionByHash: (txHash: string) => Transaction | undefined;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  getTransactionByHash: (txHash) =>
    get().transactions.find((tx) => tx.transactionHash === txHash),
}));
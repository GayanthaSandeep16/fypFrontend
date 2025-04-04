import { create } from "zustand";

interface TransactionEvent {
  name: string;
  args: any;
  type: string;
  submissionId?: string;
}

interface GroupedTransaction {
  txHash: string;
  blockNumber: string;
  status: string;
  created_at: number;
  walletAddress: string;
  events: TransactionEvent[];
}

interface TransactionStore {
  groupedTransactions: GroupedTransaction[];
  setTransactions: (transactions: any[]) => void;
  getTransactionByHash: (txHash: string) => GroupedTransaction | undefined;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  groupedTransactions: [],
  setTransactions: (transactions) => {
    const transactionMap = new Map<string, GroupedTransaction>();
    transactions.forEach((tx) => {
      if (!transactionMap.has(tx.txHash)) {
        transactionMap.set(tx.txHash, {
          txHash: tx.txHash,
          blockNumber: tx.blockNumber,
          status: tx.status,
          created_at: tx.created_at,
          walletAddress: tx.walletAddress,
          events: [],
        });
      }
      transactionMap.get(tx.txHash).events.push({
        name: tx.eventName,
        args: tx.eventArgs,
        type: tx.type,
        submissionId: tx.submissionId,
      });
    });
    const grouped = Array.from(transactionMap.values());
    set({ groupedTransactions: grouped });
  },
  getTransactionByHash: (txHash) =>
    get().groupedTransactions.find((t) => t.txHash === txHash),
}));
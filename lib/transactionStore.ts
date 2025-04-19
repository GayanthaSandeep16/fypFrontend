import { create } from "zustand";

interface TransactionEvent {
  name: string;
  args: Record<string, unknown>;
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
  setTransactions: (transactions: Array<Record<string, unknown>>) => void;
  getTransactionByHash: (txHash: string) => GroupedTransaction | undefined;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  groupedTransactions: [],
  setTransactions: (transactions) => {
    const transactionMap = new Map<string, GroupedTransaction>();
    transactions.forEach((tx) => {
      const txHash = tx.txHash as string;
      if (!transactionMap.has(txHash)) {
        transactionMap.set(txHash, {
          txHash: txHash,
          blockNumber: tx.blockNumber as string,
          status: tx.status as string,
          created_at: tx.created_at as number,
          walletAddress: tx.walletAddress as string,
          events: [],
        });
      }
      const transaction = transactionMap.get(txHash);
      if (transaction) {
        transaction.events.push({
          name: tx.eventName as string,
          args: tx.eventArgs as Record<string, unknown>,
          type: tx.type as string,
          submissionId: tx.submissionId as string | undefined,
        });
      }
    });
    const grouped = Array.from(transactionMap.values());
    set({ groupedTransactions: grouped });
  },
  getTransactionByHash: (txHash) =>
    get().groupedTransactions.find((t) => t.txHash === txHash),
}));
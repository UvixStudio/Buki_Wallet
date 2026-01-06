"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  childId: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: string;
  createdBy?: "yuval" | "einav" | "guest";
  lastModifiedBy?: "yuval" | "einav";
  lastModifiedAt?: string;
}

export interface Child {
  id: string;
  name: string;
  color: string;
  initialBalance: number;
  transactions: Transaction[];
}

interface WalletContextType {
  children: Child[];
  addTransaction: (childId: string, transaction: Omit<Transaction, "id" | "childId" | "timestamp">) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (transactionId: string) => void;
  setInitialBalance: (childId: string, balance: number) => void;
  getBalance: (childId: string) => number;
  resetAllData: () => void;
  currentParent: "yuval" | "einav" | "guest" | null;
  setCurrentParent: (parent: "yuval" | "einav" | "guest" | null) => void;
  isLoading: boolean;
  isSyncing: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Default children data
const defaultChildren: Child[] = [
  {
    id: "jonathan",
    name: "יונתן",
    color: "#1E3A8A",
    initialBalance: 0,
    transactions: [],
  },
  {
    id: "amir",
    name: "אמיר",
    color: "#EA580C",
    initialBalance: 0,
    transactions: [],
  },
];

export function WalletProvider({ children: childrenProp }: { children: ReactNode }) {
  const [children, setChildren] = useState<Child[]>(defaultChildren);
  const [currentParent, setCurrentParent] = useState<"yuval" | "einav" | "guest" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch data from database on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/wallet');
        const result = await response.json();
        if (result.success) {
          setChildren(result.data);
        } else {
          console.error('Failed to fetch data:', result.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Add new transaction
  const addTransaction = async (
    childId: string,
    transaction: Omit<Transaction, "id" | "childId" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      childId,
      timestamp: new Date().toISOString(),
      createdBy: currentParent || "guest",
    };

    // Optimistic update
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              transactions: [newTransaction, ...child.transactions].sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              ),
            }
          : child
      )
    );

    // Sync with database
    setIsSyncing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addTransaction', transaction: newTransaction }),
      });
      const result = await response.json();
      if (result.success) {
        setChildren(result.data);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Update existing transaction
  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    const modifiedUpdates = {
      ...updates,
      lastModifiedBy: (currentParent === "guest" ? undefined : currentParent) as "yuval" | "einav" | undefined,
      lastModifiedAt: new Date().toISOString(),
    };

    // Optimistic update
    setChildren((prev) =>
      prev.map((child) => ({
        ...child,
        transactions: child.transactions.map((tx) =>
          tx.id === transactionId ? { ...tx, ...modifiedUpdates } : tx
        ),
      }))
    );

    // Sync with database
    setIsSyncing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateTransaction', transactionId, updates: modifiedUpdates }),
      });
      const result = await response.json();
      if (result.success) {
        setChildren(result.data);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId: string) => {
    // Optimistic update
    setChildren((prev) =>
      prev.map((child) => ({
        ...child,
        transactions: child.transactions.filter((tx) => tx.id !== transactionId),
      }))
    );

    // Sync with database
    setIsSyncing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteTransaction', transactionId }),
      });
      const result = await response.json();
      if (result.success) {
        setChildren(result.data);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Set initial balance for a child
  const setInitialBalance = async (childId: string, balance: number) => {
    // Optimistic update
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId ? { ...child, initialBalance: balance } : child
      )
    );

    // Sync with database
    setIsSyncing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateInitialBalance', childId, balance }),
      });
      const result = await response.json();
      if (result.success) {
        setChildren(result.data);
      }
    } catch (error) {
      console.error('Error updating initial balance:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate current balance
  const getBalance = (childId: string): number => {
    const child = children.find((c) => c.id === childId);
    if (!child) return 0;

    const transactionsTotal = child.transactions.reduce((sum, tx) => {
      return sum + (tx.type === "income" ? tx.amount : -tx.amount);
    }, 0);

    return child.initialBalance + transactionsTotal;
  };

  // Reset all data to default
  const resetAllData = async () => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך לאפס את כל הנתונים?");
    if (!confirmed) return;

    setIsSyncing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetAllData' }),
      });
      const result = await response.json();
      if (result.success) {
        setChildren(result.data);
      }
    } catch (error) {
      console.error('Error resetting data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        children,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setInitialBalance,
        getBalance,
        resetAllData,
        currentParent,
        setCurrentParent,
        isLoading,
        isSyncing,
      }}
    >
      {childrenProp}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}

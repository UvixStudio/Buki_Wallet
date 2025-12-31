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
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEY = "buki_wallet_data";

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

  // Load data from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setChildren(data);
      } catch (error) {
        console.error("Failed to load data from LocalStorage:", error);
      }
    }
  }, []);

  // Save data to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
  }, [children]);

  // Add new transaction
  const addTransaction = (
    childId: string,
    transaction: Omit<Transaction, "id" | "childId" | "timestamp">
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      childId,
      timestamp: new Date().toISOString(),
    };

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
  };

  // Update existing transaction
  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setChildren((prev) =>
      prev.map((child) => ({
        ...child,
        transactions: child.transactions.map((tx) =>
          tx.id === transactionId ? { ...tx, ...updates } : tx
        ),
      }))
    );
  };

  // Delete transaction
  const deleteTransaction = (transactionId: string) => {
    setChildren((prev) =>
      prev.map((child) => ({
        ...child,
        transactions: child.transactions.filter((tx) => tx.id !== transactionId),
      }))
    );
  };

  // Set initial balance for a child
  const setInitialBalance = (childId: string, balance: number) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId ? { ...child, initialBalance: balance } : child
      )
    );
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
  const resetAllData = () => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך לאפס את כל הנתונים?");
    if (!confirmed) return;
    
    setChildren(defaultChildren);
    localStorage.removeItem(STORAGE_KEY);
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

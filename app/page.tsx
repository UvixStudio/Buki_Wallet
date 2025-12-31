"use client";

import { useState } from "react";
import { useWallet, type TransactionType } from "./context/WalletContext";

export default function Home() {
  const { children, getBalance, addTransaction, updateTransaction, deleteTransaction, resetAllData } = useWallet();
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const [isParentMode, setIsParentMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChildForAdd, setSelectedChildForAdd] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form state
  const [formType, setFormType] = useState<TransactionType>("income");
  const [formAmount, setFormAmount] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChildForAdd || !formAmount || !formDescription) {
      alert("יש למלא את כל השדות");
      return;
    }

    const amount = parseFloat(formAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("סכום לא תקין");
      return;
    }

    addTransaction(selectedChildForAdd, {
      type: formType,
      amount,
      description: formDescription,
    });

    // Reset form
    setFormType("income");
    setFormAmount("");
    setFormDescription("");
    setShowAddModal(false);
    setSelectedChildForAdd(null);
  };

  const handleCloseModal = () => {
    setFormType("income");
    setFormAmount("");
    setFormDescription("");
    setShowAddModal(false);
    setSelectedChildForAdd(null);
  };

  const handleTransactionClick = (transactionId: string) => {
    if (!isParentMode) return;
    
    const transaction = children
      .flatMap(c => c.transactions)
      .find(t => t.id === transactionId);
    
    if (!transaction) return;
    
    setSelectedTransaction(transactionId);
    setFormType(transaction.type);
    setFormAmount(transaction.amount.toString());
    setFormDescription(transaction.description);
    setShowEditModal(true);
  };

  const handleUpdateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTransaction || !formAmount || !formDescription) {
      alert("יש למלא את כל השדות");
      return;
    }

    const amount = parseFloat(formAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("סכום לא תקין");
      return;
    }

    updateTransaction(selectedTransaction, {
      type: formType,
      amount,
      description: formDescription,
    });

    // Reset form
    setFormType("income");
    setFormAmount("");
    setFormDescription("");
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;
    
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק רשומה זו?");
    if (!confirmed) return;
    
    deleteTransaction(selectedTransaction);
    
    // Reset form
    setFormType("income");
    setFormAmount("");
    setFormDescription("");
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const handleCloseEditModal = () => {
    setFormType("income");
    setFormAmount("");
    setFormDescription("");
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const handleRefreshBalance = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    
    // Stop animation after 800ms
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const formatCurrency = (amount: number) => {
    return `₪${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const timeStr = date.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (diffDays === 0) {
      return `היום\n${timeStr}`;
    } else if (diffDays === 1) {
      return `אתמול\n${timeStr}`;
    } else if (diffDays < 7) {
      return `לפני ${diffDays} ימים\n${timeStr}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}\n${timeStr}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🐷</div>
            <h1 className="text-xl font-bold text-slate-900">ארנק בוקי</h1>
          </div>
          <div className="flex items-center gap-2">
            {isParentMode && (
              <button
                onClick={resetAllData}
                className="px-4 py-2 rounded-full font-medium transition-all text-sm bg-red-100 text-red-700 hover:bg-red-200"
                title="איפוס כל הנתונים"
              >
                🗑️ איפוס
              </button>
            )}
            <button
              onClick={() => setIsParentMode(!isParentMode)}
              className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                isParentMode
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-slate-900 hover:bg-gray-300"
              }`}
            >
              {isParentMode ? "🔒 מצב הורה" : "🔓 מצב הורה"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4">
        <div
          className={`grid gap-4 transition-all duration-300 ${
            expandedChild ? "grid-rows-[auto_1fr]" : "grid-rows-2"
          }`}
        >
          {children.map((child) => {
            const isExpanded = expandedChild === child.id;
            const isCollapsed = expandedChild && expandedChild !== child.id;
            // Show all transactions - scrollable in normal mode
            const displayTransactions = child.transactions;

            return (
              <div
                key={child.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  isCollapsed ? "h-16" : isExpanded ? "h-[calc(100vh-12rem)]" : "h-[calc(50vh-6rem)]"
                }`}
              >
                {/* Child Header - Compact Single Line */}
                <div
                  className="px-4 py-3 text-white flex items-center justify-between"
                  style={{ backgroundColor: child.color }}
                >
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{child.name}</h2>
                    {!isCollapsed && (
                      <div className="flex items-center gap-2">
                        <div className={`bg-white px-3 py-1 rounded-full transition-all duration-300 ${
                          isRefreshing ? "ring-2 ring-green-400 shadow-lg shadow-green-200" : ""
                        }`}>
                          <span
                            className={`text-base font-bold ${
                              getBalance(child.id) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(getBalance(child.id))}
                          </span>
                        </div>
                        {isParentMode && (
                          <button
                            onClick={handleRefreshBalance}
                            className={`text-white hover:text-white/80 transition-transform text-lg w-8 h-8 flex items-center justify-center bg-white/20 rounded-full ${
                              isRefreshing ? "animate-spin" : ""
                            }`}
                            title="רענן חישוב"
                            disabled={isRefreshing}
                          >
                            ⟳
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isParentMode && !isCollapsed && (
                      <button 
                        onClick={() => {
                          setSelectedChildForAdd(child.id);
                          setShowAddModal(true);
                        }}
                        className="px-3 py-1.5 bg-white text-slate-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        + הוסף
                      </button>
                    )}
                    {!isCollapsed && (
                      <button
                        onClick={() =>
                          setExpandedChild(isExpanded ? null : child.id)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-lg transition-colors"
                        title={isExpanded ? "יציאה ממסך מלא" : "מסך מלא"}
                      >
                        {isExpanded ? "⛶" : "⛶"}
                      </button>
                    )}
                    {isCollapsed && (
                      <button
                        onClick={() => setExpandedChild(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
                      >
                        ▼
                      </button>
                    )}
                  </div>
                </div>

                {/* Transactions List */}
                {!isCollapsed && (
                  <div
                    className={`divide-y divide-gray-100 ${
                      isExpanded 
                        ? "overflow-y-auto h-[calc(100vh-16rem)]" 
                        : "overflow-y-auto h-[calc(50vh-9rem)]"
                    }`}
                  >
                    {displayTransactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        onClick={() => handleTransactionClick(transaction.id)}
                        className={`px-4 py-3 flex items-start gap-3 ${
                          index % 2 === 1 ? "bg-gray-50" : "bg-white"
                        } ${
                          isParentMode
                            ? "cursor-pointer hover:bg-gray-100"
                            : ""
                        } transition-colors`}
                      >
                        {/* Amount & Description - Right side in RTL */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-base font-bold mb-0.5 ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-slate-700 truncate">
                            {transaction.description}
                          </p>
                        </div>

                        {/* Date & Time - Left side in RTL */}
                        <div className="flex-shrink-0 w-20 text-left">
                          <p className="text-xs text-slate-600 font-medium whitespace-pre-line leading-tight">
                            {formatDate(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && selectedChildForAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            {/* Header with child's color */}
            <div 
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: children.find(c => c.id === selectedChildForAdd)?.color }}
            >
              <h3 className="text-lg font-semibold text-white">
                הוספת רשומה - {children.find(c => c.id === selectedChildForAdd)?.name}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4 p-6">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  סוג
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formType === "income"}
                      onChange={(e) => setFormType(e.target.value as TransactionType)}
                      className="ml-2 text-green-600"
                    />
                    <span className="text-green-600 font-medium">↑ הכנסה</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formType === "expense"}
                      onChange={(e) => setFormType(e.target.value as TransactionType)}
                      className="ml-2 text-red-600"
                    />
                    <span className="text-red-600 font-medium">↓ הוצאה</span>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  סכום (₪)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  תיאור
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="על מה זה?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Date/Time (Auto-filled, disabled) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  תאריך ושעה
                </label>
                <input
                  type="text"
                  value={new Date().toLocaleString("he-IL")}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                >
                  שמירה
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-slate-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && selectedTransaction && (() => {
        const transaction = children
          .flatMap(c => c.transactions)
          .find(t => t.id === selectedTransaction);
        const child = children.find(c => c.transactions.some(t => t.id === selectedTransaction));
        
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
              {/* Header with child's color */}
              <div 
                className="px-6 py-4 flex items-center justify-between"
                style={{ backgroundColor: child?.color }}
              >
                <h3 className="text-lg font-semibold text-white">
                  עריכת רשומה - {child?.name}
                </h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-white hover:text-gray-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateTransaction} className="space-y-4 p-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    סוג
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="edit-type"
                        value="income"
                        checked={formType === "income"}
                        onChange={(e) => setFormType(e.target.value as TransactionType)}
                        className="ml-2 text-green-600"
                      />
                      <span className="text-green-600 font-medium">↑ הכנסה</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="edit-type"
                        value="expense"
                        checked={formType === "expense"}
                        onChange={(e) => setFormType(e.target.value as TransactionType)}
                        className="ml-2 text-red-600"
                      />
                      <span className="text-red-600 font-medium">↓ הוצאה</span>
                    </label>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    סכום (₪)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    תיאור
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="על מה זה?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Date/Time Display */}
                {transaction && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      תאריך ושעה
                    </label>
                    <input
                      type="text"
                      value={new Date(transaction.timestamp).toLocaleString("he-IL")}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-500"
                    />
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    עדכן
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteTransaction}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
                  >
                    מחק
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-slate-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

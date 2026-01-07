"use client";

import { useState, useEffect } from "react";
import { useWallet, type TransactionType } from "./context/WalletContext";
import WelcomeScreen from "./components/WelcomeScreen";
import PINScreen from "./components/PINScreen";
import SetupPINScreen from "./components/SetupPINScreen";
import RecoveryScreen from "./components/RecoveryScreen";
import SideMenu from "./components/SideMenu";
import ResetDataModal from "./components/ResetDataModal";
import ChildSettingsModal from "./components/ChildSettingsModal";
import UpdateEmailModal from "./components/UpdateEmailModal";
import UpdateAppNameModal from "./components/UpdateAppNameModal";
import { isFirstTimeSetup, userExists } from "./services/authService";
import { exportToExcel } from "./services/excelService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faGear, faPlus, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

type AuthState = "welcome" | "pin" | "setup" | "recovery" | "child" | "parent";
type ParentType = "yuval" | "einav";

const PARENT_DATA = {
  yuval: { name: "יובל", emoji: "👨" },
  einav: { name: "עינב", emoji: "👱‍♀️" },
};

export default function Home() {
  const { children, getBalance, addTransaction, updateTransaction, deleteTransaction, currentParent, setCurrentParent, isLoading, isSyncing, resetAllData, refreshData } = useWallet();
  
  // Auth state
  const [authState, setAuthState] = useState<AuthState>("welcome");
  const [currentParentType, setCurrentParentType] = useState<ParentType | null>(null);
  const [setupParentId, setSetupParentId] = useState<ParentType | null>(null);
  const [recoveryParentId, setRecoveryParentId] = useState<ParentType | null>(null);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const [isParentMode, setIsParentMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChildForAdd, setSelectedChildForAdd] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showChildSettings, setShowChildSettings] = useState(false);
  const [selectedChildForSettings, setSelectedChildForSettings] = useState<string | null>(null);
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [showUpdateAppName, setShowUpdateAppName] = useState(false);
  const [appName, setAppName] = useState("ארנק בוקי");

  // Form state
  const [formType, setFormType] = useState<TransactionType>("income");
  const [formAmount, setFormAmount] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Load auth state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("buki_auth_state");
    if (saved) {
      try {
        const { state, parent } = JSON.parse(saved);
        setAuthState(state);
        if (parent) {
          setCurrentParentType(parent);
          setCurrentParent(parent);
          setIsParentMode(state === "parent");
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      }
    }
  }, [setCurrentParent]);

  // Load current user email
  useEffect(() => {
    const loadUserEmail = async () => {
      if (!currentParentType) return;
      
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getUser',
            userId: currentParentType,
          }),
        });
        
        const result = await response.json();
        if (result.success && result.user) {
          setCurrentEmail(result.user.recovery_hint || null);
        }
      } catch (error) {
        console.error('Error loading user email:', error);
      }
    };
    
    loadUserEmail();
  }, [currentParentType]);

  // Load app name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('buki_app_name');
    if (savedName) {
      setAppName(savedName);
    }
  }, []);

  // Save auth state
  const saveAuthState = (state: AuthState, parent?: ParentType) => {
    localStorage.setItem("buki_auth_state", JSON.stringify({ state, parent }));
  };

  // Auth handlers
  const handleSelectChild = () => {
    setAuthState("child");
    setCurrentParent("guest");
    saveAuthState("child");
  };

  const handleSelectParent = async () => {
    // Check if this is first-time setup
    const firstTime = await isFirstTimeSetup();
    if (firstTime) {
      // Yuval is always the first (main admin)
      setSetupParentId("yuval");
      setAuthState("setup");
    } else {
      setAuthState("pin");
    }
  };

  const handlePINSuccess = (parent: ParentType) => {
    setAuthState("parent");
    setCurrentParentType(parent);
    setCurrentParent(parent);
    setIsParentMode(true);
    saveAuthState("parent", parent);
  };

  const handleNeedSetup = async (parent: ParentType) => {
    // Check if this user needs setup
    const exists = await userExists(parent);
    if (!exists) {
      // Main admin is only yuval if no users exist yet, OR yuval if he doesn't exist
      const firstTime = await isFirstTimeSetup();
      const isMainAdmin = parent === "yuval" && firstTime;
      setSetupParentId(parent);
      setAuthState("setup");
    }
  };

  const handleForgotPIN = (parent: ParentType) => {
    setRecoveryParentId(parent);
    setAuthState("recovery");
  };

  const handleSetupSuccess = () => {
    // After setup, go to PIN screen for login
    setSetupParentId(null);
    setAuthState("pin");
  };

  const handleRecoverySuccess = () => {
    // After recovery, go to PIN screen for login
    setRecoveryParentId(null);
    setAuthState("pin");
  };

  const handleLogout = () => {
    // Close any open modals first
    setShowSideMenu(false);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowResetModal(false);
    
    // Reset all state
    setAuthState("welcome");
    setCurrentParentType(null);
    setCurrentParent(null);
    setIsParentMode(false);
    setExpandedChild(null);
    
    // Clear localStorage
    localStorage.removeItem("buki_auth_state");
  };

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

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/wallet');
      const result = await response.json();
      if (result.success) {
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(children);
  };

  const handleResetData = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = async () => {
    await resetAllData();
    setShowResetModal(false);
    alert("✅ המערכת אופסה בהצלחה!");
  };

  const handleSaveChildSettings = async (childId: string, newName: string, newColor: string) => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateChild',
          childId,
          name: newName,
          color: newColor,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Refresh data from database
        await refreshData();
        setShowChildSettings(false);
        setSelectedChildForSettings(null);
      } else {
        alert('שגיאה בעדכון הילד');
      }
    } catch (error) {
      console.error('Error updating child:', error);
      alert('שגיאה בעדכון הילד');
    }
  };

  const handleUpdateEmail = async (newEmail: string) => {
    if (!currentParentType) return;

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateEmail',
          userId: currentParentType,
          email: newEmail,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowUpdateEmail(false);
        setCurrentEmail(newEmail);
        alert('✅ המייל עודכן בהצלחה!');
      } else {
        alert('שגיאה בעדכון המייל');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      alert('שגיאה בעדכון המייל');
    }
  };

  const handleUpdateAppName = (newName: string) => {
    setAppName(newName);
    setShowUpdateAppName(false);
    // Store in localStorage for persistence
    localStorage.setItem('buki_app_name', newName);
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

  const getAuthorName = (createdBy?: "yuval" | "einav" | "guest") => {
    if (!createdBy || createdBy === "guest") return null;
    return PARENT_DATA[createdBy].name;
  };

  // Show welcome, setup, recovery, or PIN screen
  if (authState === "welcome") {
    return (
      <WelcomeScreen
        onSelectChild={handleSelectChild}
        onSelectParent={handleSelectParent}
      />
    );
  }

  if (authState === "setup" && setupParentId) {
    const isMainAdmin = setupParentId === "yuval";
    return (
      <SetupPINScreen
        parentId={setupParentId}
        parentName={PARENT_DATA[setupParentId].name}
        parentEmoji={PARENT_DATA[setupParentId].emoji}
        isMainAdmin={isMainAdmin}
        onSuccess={handleSetupSuccess}
        onBack={() => {
          setSetupParentId(null);
          setAuthState("welcome");
        }}
      />
    );
  }

  if (authState === "recovery" && recoveryParentId) {
    return (
      <RecoveryScreen
        userId={recoveryParentId}
        userName={PARENT_DATA[recoveryParentId].name}
        onSuccess={handleRecoverySuccess}
        onBack={() => {
          setRecoveryParentId(null);
          setAuthState("pin");
        }}
      />
    );
  }

  if (authState === "pin") {
    return (
      <PINScreen
        onSuccess={handlePINSuccess}
        onNeedSetup={handleNeedSetup}
        onForgotPIN={handleForgotPIN}
        onBack={() => setAuthState("welcome")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isParentMode && (
              <button
                onClick={() => setShowSideMenu(!showSideMenu)}
                className="w-9 h-9 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors"
                title="תפריט"
              >
                <FontAwesomeIcon icon={showSideMenu ? faTimes : faBars} className="w-5 h-5" />
              </button>
            )}
            <div className="text-3xl">🐷</div>
            <h1 className="text-xl font-bold text-slate-900">{appName}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isParentMode && currentParentType && (
              <>
                <button
                  onClick={handleExportExcel}
                  className="w-9 h-9 flex items-center justify-center bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  title="הורד גיבוי Excel"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
            {/* Emergency logout button - always visible in child or parent mode */}
            {(authState === "child" || authState === "parent") && (
              <button
                onClick={handleLogout}
                className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                title="חזרה למסך הבית"
              >
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Side Menu */}
      {isParentMode && currentParentType && (
        <SideMenu
          isOpen={showSideMenu}
          onClose={() => setShowSideMenu(false)}
          parentName={PARENT_DATA[currentParentType].name}
          parentEmoji={PARENT_DATA[currentParentType].emoji}
          onChangePIN={() => alert("ממוש קרוב...")}
          onUpdateEmail={() => {
            setShowSideMenu(false);
            setShowUpdateEmail(true);
          }}
          onResetData={handleResetData}
          onLogout={handleLogout}
          onEditAppName={(newName) => handleUpdateAppName(newName)}
          appName={appName}
        />
      )}

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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedChildForSettings(child.id);
                                setShowChildSettings(true);
                              }}
                              className="text-white hover:text-white/80 transition-transform text-lg w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30"
                              title="הגדרות ילד"
                            >
                              <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleRefreshBalance}
                              className={`text-white hover:text-white/80 transition-transform text-lg w-8 h-8 flex items-center justify-center bg-white/20 rounded-full ${
                                isRefreshing ? "animate-spin" : ""
                              }`}
                              title="רענן חישוב"
                              disabled={isRefreshing}
                            >
                              <FontAwesomeIcon icon={faRotate} className="w-4 h-4" />
                            </button>
                          </div>
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
                        className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        title="הוסף רשומה"
                      >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
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
                          {isParentMode && getAuthorName(transaction.createdBy) && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              נוסף ע"י: {getAuthorName(transaction.createdBy)}
                            </p>
                          )}
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

      {/* Reset Data Modal */}
      {isParentMode && currentParentType && (
        <ResetDataModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirmReset={handleConfirmReset}
          children={children}
          currentParentId={currentParentType}
        />
      )}

      {/* Child Settings Modal */}
      {showChildSettings && selectedChildForSettings && (() => {
        const child = children.find(c => c.id === selectedChildForSettings);
        if (!child) return null;
        return (
          <ChildSettingsModal
            isOpen={showChildSettings}
            childId={child.id}
            childName={child.name}
            childColor={child.color}
            onClose={() => {
              setShowChildSettings(false);
              setSelectedChildForSettings(null);
            }}
            onSave={handleSaveChildSettings}
          />
        );
      })()}

      {/* Update Email Modal */}
      {currentParentType && (
        <UpdateEmailModal
          isOpen={showUpdateEmail}
          currentEmail={currentEmail}
          userId={currentParentType}
          onClose={() => setShowUpdateEmail(false)}
          onSave={handleUpdateEmail}
        />
      )}

      {/* Update App Name Modal */}
      <UpdateAppNameModal
        isOpen={showUpdateAppName}
        currentName={appName}
        onClose={() => setShowUpdateAppName(false)}
        onSave={handleUpdateAppName}
      />
    </div>
  );
}

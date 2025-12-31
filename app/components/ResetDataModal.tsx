"use client";

import { useState } from "react";
import { verifyPIN } from "../services/authService";
import { exportToExcel } from "../services/excelService";
import type { Child } from "../context/WalletContext";

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  children: Child[];
  currentParentId: "yuval" | "einav";
}

export default function ResetDataModal({
  isOpen,
  onClose,
  onConfirmReset,
  children,
  currentParentId,
}: ResetDataModalProps) {
  const [step, setStep] = useState<"warning" | "pin">("warning");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleBackupAndClose = () => {
    // Export to Excel
    exportToExcel(children);
    // Stay on warning screen - user can still cancel or proceed
    setError("");
  };

  const handleProceedToPin = () => {
    setStep("pin");
    setPin("");
    setError("");
  };

  const handleVerifyPin = () => {
    if (pin.length !== 4) {
      setError("קוד חייב להיות 4 ספרות");
      return;
    }

    const isValid = verifyPIN(currentParentId, pin);
    if (!isValid) {
      setError("קוד שגוי");
      setPin("");
      return;
    }

    // PIN is correct - proceed with reset
    onConfirmReset();
    handleClose();
  };

  const handleClose = () => {
    setStep("warning");
    setPin("");
    setError("");
    onClose();
  };

  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
      setPin(pin + num);
      setError("");
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {step === "warning" ? (
          // Warning Step
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="text-6xl">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-900">
                האם אתה בטוח?
              </h2>
              <p className="text-slate-600">
                פעולה זו תמחק את <span className="font-bold text-red-600">כל הרשומות</span> של כל הילדים!
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                💡 <span className="font-semibold">מומלץ:</span> הורד גיבוי לפני המחיקה
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackupAndClose}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>📊</span>
                <span>הורד גיבוי תחילה</span>
              </button>

              <button
                onClick={handleProceedToPin}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>🗑️</span>
                <span>מחק בכל זאת</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-colors"
              >
                ביטול
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              קוד PIN + הגדרות הורים לא יימחקו
            </p>
          </div>
        ) : (
          // PIN Verification Step
          <div className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="text-5xl">🔑</div>
              <h2 className="text-2xl font-bold text-slate-900">
                אימות קוד
              </h2>
              <p className="text-slate-600">
                הזן את קוד ה-PIN שלך לאישור
              </p>
            </div>

            {/* PIN Circles */}
            <div className="flex justify-center gap-4" dir="ltr">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    pin.length > i
                      ? "border-[#1E3A8A] bg-[#1E3A8A]"
                      : "border-[#1E3A8A] bg-white"
                  }`}
                >
                  {pin.length > i && (
                    <span className="text-white text-2xl">•</span>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-medium text-center bg-red-50 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}
              <div></div>
              <button
                onClick={() => handleNumberClick(0)}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-red-500 transition-all shadow-sm"
              >
                ⌫
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("warning");
                  setPin("");
                  setError("");
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-colors"
              >
                חזור
              </button>
              <button
                onClick={handleVerifyPin}
                disabled={pin.length !== 4}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                אישור מחיקה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

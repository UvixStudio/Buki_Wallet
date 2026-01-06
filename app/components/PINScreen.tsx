"use client";

import { useState } from "react";
import { verifyPIN, userExists } from "../services/authService";

interface PINScreenProps {
  onSuccess: (parent: "yuval" | "einav") => void;
  onBack: () => void;
  onNeedSetup: (parent: "yuval" | "einav") => void;
  onForgotPIN: (parent: "yuval" | "einav") => void;
}

const PARENTS = {
  yuval: { name: "יובל", emoji: "👨" },
  einav: { name: "עינב", emoji: "👱‍♀️" },
};

export default function PINScreen({ onSuccess, onBack, onNeedSetup, onForgotPIN }: PINScreenProps) {
  const [pin, setPin] = useState("");
  const [selectedParent, setSelectedParent] = useState<"yuval" | "einav" | null>(null);
  const [error, setError] = useState("");

  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError("");

      // Auto-verify when 4 digits entered
      if (newPin.length === 4 && selectedParent) {
        verifyPin(newPin, selectedParent);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError("");
  };

  const verifyPin = async (pinToVerify: string, parent: "yuval" | "einav") => {
    // Check if user exists - if not, redirect to setup
    const exists = await userExists(parent);
    if (!exists) {
      onNeedSetup(parent);
      return;
    }

    // Verify PIN
    const verified = await verifyPIN(parent, pinToVerify);
    if (verified) {
      onSuccess(parent);
    } else {
      setError("קוד שגוי");
      setPin("");
    }
  };

  const handleParentSelect = (parent: "yuval" | "einav") => {
    setSelectedParent(parent);
    setPin("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-2"
        >
          <span>←</span>
          <span>חזרה</span>
        </button>

        {!selectedParent ? (
          // Parent Selection
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">בחר פרופיל</h2>
              <p className="text-slate-600 mt-2">מי מתחבר?</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleParentSelect("yuval")}
                className="w-full px-6 py-4 rounded-full bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <span className="text-2xl">{PARENTS.yuval.emoji}</span>
                <span>{PARENTS.yuval.name}</span>
              </button>

              <button
                onClick={() => handleParentSelect("einav")}
                className="w-full px-6 py-4 rounded-full bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] font-semibold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <span className="text-2xl">{PARENTS.einav.emoji}</span>
                <span>{PARENTS.einav.name}</span>
              </button>
            </div>
          </div>
        ) : (
          // PIN Entry
          <div className="text-center space-y-8">
            <div>
              <div className="text-4xl mb-4">{PARENTS[selectedParent].emoji}</div>
              <h2 className="text-2xl font-bold text-slate-900">
                שלום, {PARENTS[selectedParent].name}
              </h2>
              <p className="text-slate-600 mt-2">הזן קוד 4 ספרות</p>
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
              <div className="text-red-600 text-sm font-medium">{error}</div>
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

            {/* Forgot PIN & Change Parent */}
            <div className="flex flex-col gap-2 items-center">
              <button
                onClick={() => onForgotPIN(selectedParent)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                שכחתי קוד 🔑
              </button>
              <button
                onClick={() => setSelectedParent(null)}
                className="text-slate-600 hover:text-slate-900 text-sm"
              >
                החלף פרופיל
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

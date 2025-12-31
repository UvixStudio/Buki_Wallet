"use client";

import { useState } from "react";
import { verifySingleHint, getRecoveryHints, resetUserPIN } from "../services/authService";

interface RecoveryScreenProps {
  userId: "yuval" | "einav";
  userName: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function RecoveryScreen({
  userId,
  userName,
  onSuccess,
  onBack,
}: RecoveryScreenProps) {
  const hints = getRecoveryHints();
  const [selectedHint, setSelectedHint] = useState<"hint1" | "hint2" | null>(null);
  const [answer, setAnswer] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"select" | "verify" | "newpin">("select");
  const [error, setError] = useState("");

  // If no hints available (not main admin and trying to recover)
  if (!hints) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-2"
          >
            <span>←</span>
            <span>חזרה</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="text-5xl mb-2">🔒</div>
            <h2 className="text-2xl font-bold text-slate-900">שחזור קוד</h2>
            <p className="text-slate-600">
              רק האדמין הראשי יכול לשחזר את הקוד שלך
            </p>
            <p className="text-sm text-slate-500">
              צור קשר עם יובל לאיפוס הקוד
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleHintSelect = (hint: "hint1" | "hint2") => {
    setSelectedHint(hint);
    setAnswer("");
    setError("");
    setStep("verify");
  };

  const handleVerifyHint = () => {
    if (!selectedHint || !answer.trim()) {
      setError("הזן תשובה");
      return;
    }

    const verified = verifySingleHint(selectedHint, answer);
    
    if (!verified) {
      setError("תשובה שגויה. נסה שוב");
      setAnswer("");
      return;
    }

    setError("");
    setStep("newpin");
  };

  const handleSetNewPin = () => {
    if (newPin.length !== 4) {
      setError("נא להזין 4 ספרות");
      return;
    }

    if (newPin !== confirmPin) {
      setError("הקודים אינם תואמים");
      setConfirmPin("");
      return;
    }

    resetUserPIN(userId, newPin);
    onSuccess();
  };

  const handleNumberClick = (num: number, currentPin: string, setPinFunc: (val: string) => void) => {
    if (currentPin.length < 4) {
      setPinFunc(currentPin + num);
      setError("");
    }
  };

  const handleBackspace = (currentPin: string, setPinFunc: (val: string) => void) => {
    setPinFunc(currentPin.slice(0, -1));
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <button
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-2"
        >
          <span>←</span>
          <span>חזרה</span>
        </button>

        {/* Step 1: Select ONE hint */}
        {step === "select" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-2">🔓</div>
              <h2 className="text-2xl font-bold text-slate-900">שחזור קוד</h2>
              <p className="text-slate-600">
                בחר רמז אחד לשחזור
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleHintSelect("hint1")}
                className="w-full px-4 py-4 rounded-lg border-2 border-slate-200 bg-white hover:border-[#1E3A8A] hover:bg-blue-50 transition-all text-left"
              >
                <div className="font-medium text-slate-900">{hints.hint1}</div>
              </button>

              <button
                onClick={() => handleHintSelect("hint2")}
                className="w-full px-4 py-4 rounded-lg border-2 border-slate-200 bg-white hover:border-[#1E3A8A] hover:bg-blue-50 transition-all text-left"
              >
                <div className="font-medium text-slate-900">{hints.hint2}</div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Verify selected hint */}
        {step === "verify" && selectedHint && (
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-2">🔑</div>
              <h2 className="text-2xl font-bold text-slate-900">שחזור קוד</h2>
              <p className="text-slate-600">
                ענה על השאלה
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                💡 {selectedHint === "hint1" ? hints.hint1 : hints.hint2}
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setError("");
                }}
                placeholder="הזן תשובה"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-lg text-center"
                autoFocus
                dir="ltr"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-center">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("select");
                  setSelectedHint(null);
                  setAnswer("");
                  setError("");
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-all"
              >
                חזור
              </button>
              <button
                onClick={handleVerifyHint}
                disabled={!answer.trim()}
                className="flex-1 px-6 py-3 bg-[#1E3A8A] text-white rounded-full font-semibold hover:bg-[#2d4a9e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                אמת
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Create new PIN */}
        {step === "newpin" && (
          <div className="text-center space-y-8">
            <div>
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-slate-900">
                {newPin.length === 0 ? "צור קוד חדש" : "אשר את הקוד"}
              </h2>
              <p className="text-slate-600 mt-2">
                {newPin.length < 4
                  ? `${userName}, הזן קוד חדש (4 ספרות)`
                  : "הזן את הקוד שוב לאישור"}
              </p>
            </div>

            {/* PIN Circles */}
            <div className="flex justify-center gap-4" dir="ltr">
              {[0, 1, 2, 3].map((i) => {
                const currentPin = newPin.length < 4 ? newPin : confirmPin;
                return (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                      currentPin.length > i
                        ? "border-[#1E3A8A] bg-[#1E3A8A]"
                        : "border-[#1E3A8A] bg-white"
                    }`}
                  >
                    {currentPin.length > i && (
                      <span className="text-white text-2xl">•</span>
                    )}
                  </div>
                );
              })}
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
                  onClick={() => {
                    const isConfirming = newPin.length === 4;
                    handleNumberClick(
                      num,
                      isConfirming ? confirmPin : newPin,
                      isConfirming ? setConfirmPin : setNewPin
                    );
                  }}
                  className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}
              <div></div>
              <button
                onClick={() => {
                  const isConfirming = newPin.length === 4;
                  handleNumberClick(
                    0,
                    isConfirming ? confirmPin : newPin,
                    isConfirming ? setConfirmPin : setNewPin
                  );
                }}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
              >
                0
              </button>
              <button
                onClick={() => {
                  const isConfirming = newPin.length === 4;
                  handleBackspace(
                    isConfirming ? confirmPin : newPin,
                    isConfirming ? setConfirmPin : setNewPin
                  );
                }}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-red-500 transition-all shadow-sm"
              >
                ⌫
              </button>
            </div>

            {/* Submit when both PINs entered */}
            {newPin.length === 4 && confirmPin.length === 4 && (
              <button
                onClick={handleSetNewPin}
                className="w-full px-6 py-3 bg-[#1E3A8A] text-white rounded-full font-semibold text-lg hover:bg-blue-800 transition-colors"
              >
                שמור קוד חדש
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { setupRecoveryHints, createUser, verifySingleHint } from "../services/authService";

interface SetupPINScreenProps {
  parentId: "yuval" | "einav";
  parentName: string;
  parentEmoji: string;
  isMainAdmin: boolean;
  onSuccess: () => void;
  onBack: () => void;
}

export default function SetupPINScreen({
  parentId,
  parentName,
  parentEmoji,
  isMainAdmin,
  onSuccess,
  onBack,
}: SetupPINScreenProps) {
  // Steps: pin1 -> pin2 -> verify (only for main admin)
  const [step, setStep] = useState<"pin1" | "pin2" | "verify">("pin1");
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [selectedHint, setSelectedHint] = useState<"hint1" | "hint2" | null>(null);
  const [verifyAnswer, setVerifyAnswer] = useState("");
  const [error, setError] = useState("");

  // Hardcoded recovery hint values
  const GMAIL_PIN = "3440";
  const ID_NUMBER = "033270901";

  const handlePin1Submit = () => {
    if (pin1.length !== 4) {
      setError("קוד חייב להיות 4 ספרות");
      return;
    }

    setError("");
    setStep("pin2");
  };

  const handlePin2Submit = async () => {
    if (pin2.length !== 4) {
      setError("קוד חייב להיות 4 ספרות");
      return;
    }

    if (pin2 !== pin1) {
      setError("הקודים אינם תואמים");
      setPin2("");
      return;
    }

    setError("");

    // If not main admin, create user immediately
    if (!isMainAdmin) {
      await createUser(parentId, pin1, false);
      onSuccess();
      return;
    }

    // Main admin needs to verify with one hint
    setStep("verify");
  };

  const handleHintSelect = (hint: "hint1" | "hint2") => {
    setSelectedHint(hint);
    setVerifyAnswer("");
    setError("");
  };

  const handleVerifySubmit = async () => {
    if (!selectedHint) {
      setError("בחר אפשרות אימות");
      return;
    }

    if (!verifyAnswer.trim()) {
      setError("הזן תשובה");
      return;
    }

    // Check which hint was selected and verify
    const isCorrect =
      selectedHint === "hint1"
        ? verifyAnswer === GMAIL_PIN
        : verifyAnswer === ID_NUMBER;

    if (!isCorrect) {
      setError("תשובה שגויה");
      setVerifyAnswer("");
      return;
    }

    // Setup recovery hints in storage with hardcoded values
    await setupRecoveryHints(
      "Gmail PIN",
      GMAIL_PIN,
      "ID",
      ID_NUMBER
    );

    // Create main admin user
    await createUser(parentId, pin1, true);
    onSuccess();
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

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-5xl">{parentEmoji}</div>
          <h1 className="text-3xl font-bold text-slate-900">
            יצירת קוד אישי
          </h1>
          <p className="text-slate-600">שלום, {parentName}</p>
        </div>

        {/* Step 1: Create PIN */}
        {step === "pin1" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700 mb-2">
                צור קוד בן 4 ספרות
              </p>
              <p className="text-sm text-slate-500">
                קוד זה ישמש לכניסה למערכת
              </p>
            </div>

            {/* PIN Input */}
            <div className="flex justify-center gap-4" dir="ltr">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    pin1.length > i
                      ? "border-[#1E3A8A] bg-[#1E3A8A]"
                      : "border-[#1E3A8A] bg-white"
                  }`}
                >
                  {pin1.length > i && (
                    <span className="text-white text-2xl">•</span>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (pin1.length < 4) {
                      setPin1(pin1 + num);
                      setError("");
                    }
                  }}
                  className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}
              <div></div>
              <button
                onClick={() => {
                  if (pin1.length < 4) {
                    setPin1(pin1 + "0");
                    setError("");
                  }
                }}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
              >
                0
              </button>
              <button
                onClick={() => {
                  setPin1(pin1.slice(0, -1));
                  setError("");
                }}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-red-500 transition-all shadow-sm"
              >
                ⌫
              </button>
            </div>

            {/* Continue Button */}
            <button
              onClick={handlePin1Submit}
              disabled={pin1.length !== 4}
              className="w-full px-6 py-3 bg-[#1E3A8A] text-white rounded-full font-semibold text-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              המשך
            </button>
          </div>
        )}

        {/* Step 2: Confirm PIN */}
        {step === "pin2" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-slate-700 mb-2">
                הקש את הקוד שוב לאישור
              </p>
              <p className="text-sm text-slate-500">
                וודא שאתה זוכר את הקוד
              </p>
            </div>

            {/* PIN Input */}
            <div className="flex justify-center gap-4" dir="ltr">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    pin2.length > i
                      ? "border-[#1E3A8A] bg-[#1E3A8A]"
                      : "border-[#1E3A8A] bg-white"
                  }`}
                >
                  {pin2.length > i && (
                    <span className="text-white text-2xl">•</span>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    if (pin2.length < 4) {
                      setPin2(pin2 + num);
                      setError("");
                    }
                  }}
                  className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
                >
                  {num}
                </button>
              ))}
              <div></div>
              <button
                onClick={() => {
                  if (pin2.length < 4) {
                    setPin2(pin2 + "0");
                    setError("");
                  }
                }}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-[#1E3A8A] transition-all shadow-sm"
              >
                0
              </button>
              <button
                onClick={() => {
                  setPin2(pin2.slice(0, -1));
                  setError("");
                }}
                className="h-16 rounded-full bg-white border-2 border-slate-200 text-slate-900 text-xl font-semibold hover:bg-slate-50 hover:border-red-500 transition-all shadow-sm"
              >
                ⌫
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("pin1");
                  setPin2("");
                  setError("");
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-semibold text-lg hover:bg-slate-50 transition-colors"
              >
                חזור
              </button>
              <button
                onClick={handlePin2Submit}
                disabled={pin2.length !== 4}
                className="flex-1 px-6 py-3 bg-[#1E3A8A] text-white rounded-full font-semibold text-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMainAdmin ? "המשך" : "סיום"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verify with ONE hint (Main Admin Only) */}
        {step === "verify" && isMainAdmin && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🔑</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                אתה האדמין הראשי!
              </h2>
              <p className="text-slate-600">
                הזן 2 רמזים לשחזור קוד
              </p>
              <p className="text-sm text-slate-500 mt-2">
                הרמזים ישמשו לשחזור הקוד אם תשכח
              </p>
            </div>

            {/* Hint Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 text-center">
                בחר רמז לאישור:
              </p>
              
              <button
                onClick={() => handleHintSelect("hint1")}
                className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                  selectedHint === "hint1"
                    ? "border-[#1E3A8A] bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-medium text-slate-900">Gmail PIN</div>
                <div className="text-sm text-slate-500">
                  מספר הקוד לגימייל של יובל
                </div>
              </button>

              <button
                onClick={() => handleHintSelect("hint2")}
                className={`w-full px-4 py-3 rounded-lg border-2 text-left transition-all ${
                  selectedHint === "hint2"
                    ? "border-[#1E3A8A] bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="font-medium text-slate-900">ID</div>
                <div className="text-sm text-slate-500">
                  תעודת הזהות של יובל
                </div>
              </button>
            </div>

            {/* Verify Answer Input */}
            {selectedHint && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {selectedHint === "hint1" ? "הזן את קוד הגימייל:" : "הזן את מספר תעודת הזהות:"}
                </label>
                <input
                  type="text"
                  value={verifyAnswer}
                  onChange={(e) => {
                    setVerifyAnswer(e.target.value);
                    setError("");
                  }}
                  placeholder={selectedHint === "hint1" ? "4 ספרות" : "9 ספרות"}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center"
                  dir="ltr"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-medium text-center bg-red-50 py-2 px-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("pin2");
                  setSelectedHint(null);
                  setVerifyAnswer("");
                  setError("");
                }}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-full font-semibold text-lg hover:bg-slate-50 transition-colors"
              >
                חזור
              </button>
              <button
                onClick={handleVerifySubmit}
                disabled={!selectedHint || !verifyAnswer.trim()}
                className="flex-1 px-6 py-3 bg-[#1E3A8A] text-white rounded-full font-semibold text-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                סיום
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              הרמזים ישמרו לשחזור הקוד אם תשכח
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

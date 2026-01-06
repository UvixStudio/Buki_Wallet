"use client";

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface UpdateEmailModalProps {
  isOpen: boolean;
  currentEmail: string | null;
  userId: string;
  onClose: () => void;
  onSave: (email: string) => void;
}

export default function UpdateEmailModal({
  isOpen,
  currentEmail,
  userId,
  onClose,
  onSave,
}: UpdateEmailModalProps) {
  const [email, setEmail] = useState(currentEmail || "");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    setError("");

    if (!email.trim()) {
      setError("נא להזין כתובת מייל");
      return;
    }

    if (!validateEmail(email)) {
      setError("כתובת מייל לא תקינה");
      return;
    }

    onSave(email.trim());
  };

  const handleCancel = () => {
    setEmail(currentEmail || "");
    setError("");
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl max-w-md w-full z-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">עדכון מייל שחזור</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:text-white/80 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-4">
              כתובת המייל תשמש לשחזור גישה למערכת במקרה של שכחת קוד
            </p>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              כתובת מייל
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  error
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                dir="ltr"
                autoFocus
              />
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {error}
              </p>
            )}
          </div>

          {currentEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-slate-600 mb-1">מייל נוכחי:</p>
              <p className="text-sm font-medium text-slate-900 font-mono" dir="ltr">
                {currentEmail}
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-slate-700 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            ביטול
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
            שמור
          </button>
        </div>
      </div>
    </>
  );
}

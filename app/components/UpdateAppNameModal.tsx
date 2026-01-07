"use client";

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faXmark, faWallet } from '@fortawesome/free-solid-svg-icons';

interface UpdateAppNameModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (newName: string) => void;
}

export default function UpdateAppNameModal({
  isOpen,
  currentName,
  onClose,
  onSave,
}: UpdateAppNameModalProps) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    setError("");

    if (!name.trim()) {
      setError("נא להזין שם");
      return;
    }

    if (name.trim().length < 2) {
      setError("השם קצר מדי");
      return;
    }

    if (name.trim().length > 30) {
      setError("השם ארוך מדי");
      return;
    }

    onSave(name.trim());
  };

  const handleCancel = () => {
    setName(currentName);
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
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faWallet} className="w-6 h-6 text-blue-900" />
            <h3 className="text-xl font-bold text-slate-900">עריכת שם האפליקציה</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-4">
              השם יוצג בכותרת האפליקציה ובתפריט הצד
            </p>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              שם האפליקציה
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="ארנק בוקי"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                error
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              maxLength={30}
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span>
                {error}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-2">
              {name.length}/30 תווים
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-slate-600 mb-1">תצוגה מקדימה:</p>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faWallet} className="w-5 h-5 text-blue-600" />
              <p className="text-lg font-bold text-slate-900">
                {name || "ארנק בוקי"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border-2 border-blue-900 text-blue-900 bg-white rounded-full font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            ביטול
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
            שמור
          </button>
        </div>
      </div>
    </>
  );
}

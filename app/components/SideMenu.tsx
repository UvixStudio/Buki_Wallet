"use client";

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faEnvelope,
  faTrashCan,
  faRightFromBracket,
  faTimes,
  faWallet,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  parentEmoji: string;
  onChangePIN: () => void;
  onUpdateEmail: () => void;
  onResetData: () => void;
  onLogout: () => void;
  onEditAppName: (newName: string) => void;
  appName?: string;
}

export default function SideMenu({
  isOpen,
  onClose,
  parentName,
  parentEmoji,
  onChangePIN,
  onUpdateEmail,
  onResetData,
  onLogout,
  onEditAppName,
  appName = "ארנק בוקי",
}: SideMenuProps) {
  const [isEditingAppName, setIsEditingAppName] = useState(false);
  const [editedAppName, setEditedAppName] = useState(appName);

  if (!isOpen) return null;

  const handleSaveAppName = () => {
    if (editedAppName.trim() && editedAppName.trim() !== appName) {
      onEditAppName(editedAppName.trim());
    }
    setIsEditingAppName(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform slide-in-right">
        <div className="flex flex-col h-full">
          {/* App Header Strip - White */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐷</span>
              {isEditingAppName ? (
                <input
                  type="text"
                  value={editedAppName}
                  onChange={(e) => setEditedAppName(e.target.value)}
                  onBlur={handleSaveAppName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveAppName();
                    if (e.key === 'Escape') {
                      setEditedAppName(appName);
                      setIsEditingAppName(false);
                    }
                  }}
                  className="flex-1 max-w-[180px] text-xl font-bold text-slate-900 px-2 py-1 border-2 border-blue-500 rounded focus:outline-none"
                  autoFocus
                  maxLength={30}
                />
              ) : (
                <span
                  onClick={() => setIsEditingAppName(true)}
                  className="text-xl font-bold text-slate-900 cursor-pointer hover:text-blue-900 transition-colors"
                >
                  {appName}
                </span>
              )}
            </div>
          </div>

          {/* User Profile Header - Compact */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{parentEmoji}</span>
              <div>
                <p className="text-base font-bold text-slate-900">{parentName}</p>
                <p className="text-xs text-slate-600">(אדמין)</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <nav className="py-2">
              <button
                onClick={onChangePIN}
                className="w-full px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-gray-50 transition-colors text-right"
              >
                <FontAwesomeIcon icon={faKey} className="w-5 h-5 text-slate-600" />
                <span className="text-base font-medium">שינוי קוד</span>
              </button>

              <button
                onClick={onUpdateEmail}
                className="w-full px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-gray-50 transition-colors text-right"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-slate-600" />
                <span className="text-base font-medium">עדכון מייל שחזור</span>
              </button>

              <button
                onClick={onResetData}
                className="w-full px-6 py-4 flex items-center gap-4 text-red-600 hover:bg-red-50 transition-colors text-right"
              >
                <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5 text-red-600" />
                <span className="text-base font-medium">איפוס נתונים</span>
              </button>

              <div className="my-4 border-t border-gray-200" />

              <button
                onClick={onLogout}
                className="w-full px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-gray-50 transition-colors text-right"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-slate-600" />
                <span className="text-base font-medium">יציאה</span>
              </button>
            </nav>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-slate-500 text-center">
              ארנק בוקי • גרסה 2.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

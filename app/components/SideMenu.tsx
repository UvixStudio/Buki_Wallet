"use client";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  parentName: string;
  parentEmoji: string;
  onChangePIN: () => void;
  onUpdateEmail: () => void;
  onResetData: () => void;
  onLogout: () => void;
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
}: SideMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-slate-600 hover:text-slate-900 text-2xl"
            >
              ×
            </button>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-4xl">{parentEmoji}</span>
              <div>
                <p className="text-xl font-bold text-slate-900">{parentName}</p>
                <p className="text-sm text-slate-600">(אדמין)</p>
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
                <span className="text-2xl">🔐</span>
                <span className="text-base font-medium">שינוי קוד</span>
              </button>

              <button
                onClick={onUpdateEmail}
                className="w-full px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-gray-50 transition-colors text-right"
              >
                <span className="text-2xl">📧</span>
                <span className="text-base font-medium">עדכון מייל שחזור</span>
              </button>

              <button
                onClick={onResetData}
                className="w-full px-6 py-4 flex items-center gap-4 text-red-600 hover:bg-red-50 transition-colors text-right"
              >
                <span className="text-2xl">🗑️</span>
                <span className="text-base font-medium">איפוס נתונים</span>
              </button>

              <div className="my-4 border-t border-gray-200" />

              <button
                onClick={onLogout}
                className="w-full px-6 py-4 flex items-center gap-4 text-slate-700 hover:bg-gray-50 transition-colors text-right"
              >
                <span className="text-2xl">🚪</span>
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

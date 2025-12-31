"use client";

interface WelcomeScreenProps {
  onSelectChild: () => void;
  onSelectParent: () => void;
}

export default function WelcomeScreen({ onSelectChild, onSelectParent }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">🐷</div>
          <h1 className="text-2xl font-bold text-slate-900">כניסת מערכת</h1>
          <p className="text-lg text-slate-600">ארנק בוקי</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          {/* Child Button - Stroke */}
          <button
            onClick={onSelectChild}
            className="w-full px-6 py-4 rounded-full border-2 border-[#1E3A8A] bg-white text-[#1E3A8A] font-semibold text-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
          >
            <span className="text-2xl">👶</span>
            <span>כניסת ילדים</span>
          </button>

          {/* Parent Button - Filled */}
          <button
            onClick={onSelectParent}
            className="w-full px-6 py-4 rounded-full bg-[#1E3A8A] text-white font-semibold text-lg hover:bg-[#2d4a9e] transition-all duration-200 flex items-center justify-center gap-3 shadow-md"
          >
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <span>כניסת הורים</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>גרסה 2.0 • ניהול כספי משפחתי</p>
        </div>
      </div>
    </div>
  );
}

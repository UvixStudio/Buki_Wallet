"use client";

import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTimes, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';

interface ChildSettingsModalProps {
  isOpen: boolean;
  childId: string;
  childName: string;
  childColor: string;
  onClose: () => void;
  onSave: (childId: string, newName: string, newColor: string) => void;
}

// פלטה של 20 צבעים נבחרים
const PRESET_COLORS = [
  '#1E3A8A', // כחול כהה
  '#3B82F6', // כחול בהיר
  '#0EA5E9', // תכלת
  '#06B6D4', // ציאן
  '#10B981', // ירוק
  '#22C55E', // ירוק בהיר
  '#84CC16', // ירוק ליים
  '#EAB308', // צהוב
  '#F59E0B', // כתום בהיר
  '#EA580C', // כתום כהה
  '#EF4444', // אדום
  '#DC2626', // אדום כהה
  '#F43F5E', // ורוד אדום
  '#EC4899', // ורוד
  '#D946EF', // סגול ורוד
  '#A855F7', // סגול
  '#8B5CF6', // סגול כהה
  '#6366F1', // אינדיגו
  '#64748B', // אפור כחלחל
  '#475569', // אפור כהה
];

export default function ChildSettingsModal({
  isOpen,
  childId,
  childName,
  childColor,
  onClose,
  onSave,
}: ChildSettingsModalProps) {
  const [name, setName] = useState(childName);
  const [color, setColor] = useState(childColor);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert('נא להזין שם');
      return;
    }
    onSave(childId, name.trim(), color);
    onClose();
  };

  const handleCancel = () => {
    setName(childName);
    setColor(childColor);
    setIsEditingName(false);
    setShowColorPicker(false);
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
        {/* Header with child's color */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center gap-3 flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white/20 text-white placeholder-white/60 px-3 py-2 rounded-lg border-2 border-white/40 focus:border-white focus:outline-none"
                placeholder="שם הילד"
                autoFocus
                maxLength={20}
              />
            ) : (
              <h3 className="text-xl font-bold text-white">{name}</h3>
            )}
            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:text-white/80 transition-colors mr-2"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Color Display */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              צבע נוכחי
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={color.toUpperCase()}
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (/^#[0-9A-F]{0,6}$/i.test(hex)) {
                      setColor(hex);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="#000000"
                  maxLength={7}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              בחר צבע
            </label>
            <div className="grid grid-cols-10 gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    color.toUpperCase() === presetColor.toUpperCase()
                      ? 'border-slate-900 ring-2 ring-blue-500 ring-offset-2'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>

          {/* Color Picker Toggle */}
          <div>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
            >
              {showColorPicker ? 'סגור בורר צבעים' : 'פתח בורר צבעים מתקדם'}
            </button>
          </div>

          {/* Advanced Color Picker */}
          {showColorPicker && (
            <div className="flex justify-center">
              <SketchPicker
                color={color}
                onChange={(newColor) => setColor(newColor.hex)}
                presetColors={PRESET_COLORS}
                disableAlpha
              />
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

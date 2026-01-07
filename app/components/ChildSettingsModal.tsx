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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 z-50 overflow-hidden"
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
        <div className="p-4">
          {/* Color Picker - Always Visible */}
          <div className="flex flex-col items-center">
            <SketchPicker
              color={color}
              onChange={(newColor) => setColor(newColor.hex)}
              presetColors={PRESET_COLORS}
              disableAlpha
              width="100%"
              styles={{
                default: {
                  picker: {
                    width: '100%',
                    boxShadow: 'none',
                  },
                  saturation: {
                    borderRadius: '8px',
                    height: '180px',
                  },
                  controls: {
                    padding: '16px 0',
                  },
                  color: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                  },
                  hue: {
                    height: '16px',
                    borderRadius: '8px',
                  },
                },
              }}
            />
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

'use client';

import { useState, useEffect, useRef } from 'react';

interface PickerOption {
  value: number | string;
  label: string;
  disabled?: boolean;
  tooltip?: string;
}

interface ScrollPickerProps {
  label: string;
  options: PickerOption[];
  value: number | string | null;
  onChange: (value: number | string) => void;
  placeholder?: string;
  unit?: string;
}

export default function ScrollPicker({
  label,
  options,
  value,
  onChange,
  placeholder = 'Vyberte',
  unit = ''
}: ScrollPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<number | string | null>(value);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Sync tempValue with value prop
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? `${selectedOption.label} ${unit}`.trim() : placeholder;

  const handleOpen = () => {
    setIsOpen(true);
    setTempValue(value);
  };

  const handleConfirm = () => {
    if (tempValue !== null) {
      onChange(tempValue);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  const handleOptionClick = (optionValue: number | string, disabled?: boolean) => {
    if (disabled) return;
    if (isMobile) {
      setTempValue(optionValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-burgundy mb-2">{label}</label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-burgundy/30 transition"
      >
        <span className={`${value === null ? 'text-gray-400' : 'text-gray-900'}`}>{displayText}</span>
        <svg
          className={`w-5 h-5 text-burgundy transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile Bottom Sheet */}
      {isMobile && isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCancel}
          />

          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                Zrušit
              </button>
              <h3 className="text-lg font-semibold text-burgundy">{label}</h3>
              <button
                onClick={handleConfirm}
                className="text-burgundy font-semibold hover:text-maroon"
              >
                Hotovo
              </button>
            </div>

            {/* Scrollable Options */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option.value, option.disabled)}
                    disabled={option.disabled}
                    className={`w-full p-4 rounded-lg text-left transition ${
                      option.disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : tempValue === option.value
                        ? 'bg-burgundy text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-burgundy/10'
                    }`}
                    title={option.disabled ? option.tooltip : undefined}
                  >
                    <span className="font-medium">{option.label} {unit}</span>
                    {option.disabled && (
                      <span className="block text-xs mt-1 opacity-70">
                        {option.tooltip || 'Není skladem'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Dropdown */}
      {!isMobile && isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 border-burgundy/30 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value, option.disabled)}
                disabled={option.disabled}
                className={`w-full px-4 py-3 rounded-md text-left transition ${
                  option.disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : value === option.value
                    ? 'bg-burgundy text-white'
                    : 'text-gray-900 hover:bg-burgundy/10'
                }`}
                title={option.disabled ? option.tooltip : undefined}
              >
                <span className="font-medium">{option.label} {unit}</span>
                {option.disabled && (
                  <span className="block text-xs mt-1 opacity-70">
                    {option.tooltip || 'Není skladem'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

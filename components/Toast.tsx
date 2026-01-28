"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  description?: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  description,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in-0">
      <div className="bg-[#E8F5E9] border border-[#4CAF50] rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[400px] max-w-[600px]">
        <CheckCircle2 className="text-[#4CAF50] shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <p className="font-sofia text-sm font-medium text-[#2E7D32]">
            {message}
          </p>
          {description && (
            <p className="font-sofia text-xs text-[#2E7D32] mt-1 opacity-80">
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#2E7D32] hover:text-[#1B5E20] shrink-0"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

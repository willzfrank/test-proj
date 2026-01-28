"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface SuccessToastProps {
  readonly title: string;
  readonly message: string;
  readonly isVisible: boolean;
  readonly onClose: () => void;
  readonly duration?: number;
}

export default function SuccessToast({
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
}: Readonly<SuccessToastProps>) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    // Wait for slide-out animation to complete before calling onClose
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 300); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (isVisible && !isExiting && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, isExiting, handleClose]);

  if (!isVisible && !isExiting) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        isExiting || !isVisible
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100'
      }`}
    >
      <div className="bg-white rounded-[4px] shadow-2xl pl-7 pr-6 py-6 flex items-start gap-4 min-w-[400px] max-w-[500px] border-t border-r border-b border-gray-100 relative">
        {/* Left Green Border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[4px]"
          style={{ backgroundColor: 'var(--Success, #25A969)' }}
        />
        {/* Checkmark Icon Container */}
        <div 
          className="p-1.5 flex items-center justify-center shrink-0"
          style={{
            borderRadius: '8px',
            border: '1px solid var(--Success-75, #B5E3C4)',
            background: 'var(--Success-50, #E7F6EC)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM10.4503 7.1583C10.7218 6.90962 10.7403 6.48792 10.4916 6.2164C10.243 5.94488 9.82125 5.92636 9.54973 6.17503L7.08835 8.42932L6.45027 7.84492C6.17875 7.59625 5.75704 7.61477 5.50837 7.88629C5.25969 8.15781 5.27821 8.57951 5.54973 8.82819L6.63808 9.82497C6.8929 10.0583 7.2838 10.0583 7.53862 9.82497L10.4503 7.1583Z" fill="#25A969"/>
          </svg>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 
            className="font-sofia font-semibold mb-1"
            style={{
              color: 'var(--Primary-black, #333)',
              fontSize: '16px',
              lineHeight: '145%',
            }}
          >
            {title}
          </h3>
          <p 
            className="font-sofia"
            style={{
              color: 'var(--Secondary-Text, #5A607F)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '145%',
            }}
          >
            {message}
          </p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 shrink-0 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

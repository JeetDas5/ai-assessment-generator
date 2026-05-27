"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={isLoading ? undefined : onClose}
      />

      <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-gray-100/50 flex flex-col items-center text-center z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-5 shrink-0 text-red-500 animate-bounce">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="font-sans text-xl font-black text-[#121212] tracking-tight leading-tight uppercase mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#121212] font-semibold py-3 px-5 rounded-full border border-gray-200/60 transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-5 rounded-full border border-transparent transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

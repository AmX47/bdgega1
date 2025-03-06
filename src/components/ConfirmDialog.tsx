import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
      >
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-400" />
        </div>
        
        <p className="text-xl text-gray-800 mb-6 text-center">{message}</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#7A288A] text-white px-6 py-2 rounded-lg hover:bg-[#8A3399] transition-colors"
          >
            نعم
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            لا
          </button>
        </div>
      </motion.div>
    </div>
  );
}
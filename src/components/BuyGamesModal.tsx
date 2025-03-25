import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBalance } from '../hooks/useBalance';

interface BuyGamesModalProps {
  onClose: () => void;
  onBuy: (amount: number) => void;
}

export function BuyGamesModal({ onClose, onBuy }: BuyGamesModalProps) {
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState('');
  const { balance, updateBalance } = useBalance();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (amount < 1) {
      setError('يجب شراء لعبة واحدة على الأقل');
      return;
    }

    setLoading(true);
    const success = await updateBalance(balance + amount);
    setLoading(false);

    if (success) {
      onBuy(amount);
      onClose();
    } else {
      setError('حدث خطأ أثناء تحديث الرصيد. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-[#800020] mb-6 text-center">شراء ألعاب إضافية</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">عدد الألعاب</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                className="bg-[#800020] text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                -
              </button>
              <span className="text-xl font-bold text-[#800020]">{amount}</span>
              <button
                onClick={() => setAmount(prev => prev + 1)}
                className="bg-[#800020] text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                +
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
          <div className="mt-6">
            <p className="text-center text-gray-700 mb-4">
              سعر اللعبة الواحدة: 5 ريال
              <br />
              المجموع: {amount * 5} ريال
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleBuy}
              className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#600018] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'جاري الشراء...' : 'شراء'}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

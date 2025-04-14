import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBalance } from '../hooks/useBalance';
import { PayPalButton } from './PayPalButton/PayPalButton';

interface BuyGamesModalProps {
  onClose: () => void;
  onBuy: (amount: number) => void;
}

export function BuyGamesModal({ onClose, onBuy }: BuyGamesModalProps) {
  const [amount, setAmount] = useState(1);
  const [error, setError] = useState('');
  const { balance, updateBalance } = useBalance();
  const [loading, setLoading] = useState(false);
  const pricePerGame = 5; // سعر اللعبة الواحدة بالريال

  const handlePayPalSuccess = async (details: any) => {
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
              سعر اللعبة الواحدة: {pricePerGame} ريال
              <br />
              المجموع: {amount * pricePerGame} ريال
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <PayPalButton
              amount={(amount * pricePerGame).toString()}
              description={`شراء ${amount} ${amount === 1 ? 'لعبة' : 'ألعاب'}`}
              onSuccess={handlePayPalSuccess}
              onError={(error) => {
                setError('حدث خطأ في عملية الدفع. الرجاء المحاولة مرة أخرى.');
                console.error('PayPal Error:', error);
              }}
            />
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors w-full"
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

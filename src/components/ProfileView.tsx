import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileViewProps {
  user: {
    username: string;
    email: string;
  };
  onClose: () => void;
  onUpdateProfile: (data: { username: string; email: string }) => void;
}

export function ProfileView({ user, onClose, onUpdateProfile }: ProfileViewProps) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ username, email });
    setSuccessMessage('تم تحديث المعلومات بنجاح!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-[#800020] mb-6 text-center">الملف الشخصي</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-lg"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              dir="rtl"
              readOnly
            />
          </div>
          {successMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 text-center font-bold"
            >
              {successMessage}
            </motion.p>
          )}
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#600018] transition-colors"
            >
              حفظ التغييرات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

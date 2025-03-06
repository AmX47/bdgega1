import React, { useState } from 'react';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function Register({ onClose, onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    // Handle registration logic here
    console.log('Registration attempt:', { name, email, password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">إنشاء حساب جديد</h2>
          <p className="text-gray-600">انضم إلينا واستمتع باللعب مع أصدقائك</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="ادخل اسمك الكامل"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="ادخل بريدك الإلكتروني"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="ادخل كلمة المرور"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="أعد إدخال كلمة المرور"
              required
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="form-checkbox text-[#D4AF37]" />
            <span className="mr-2 text-gray-600">
              أوافق على <button type="button" className="text-[#D4AF37] hover:text-[#FFD700]">الشروط والأحكام</button>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-bold hover:from-[#FFD700] hover:to-[#D4AF37] transition-all"
          >
            إنشاء حساب
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#D4AF37] hover:text-[#FFD700] font-medium"
            >
              سجل دخولك
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

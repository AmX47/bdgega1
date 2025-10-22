import React, { useState } from 'react';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function Login({ onClose, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
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
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">تسجيل الدخول</h2>
          <p className="text-gray-600">مرحباً بعودتك! سجل دخولك للمتابعة</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-[#D4AF37]" />
              <span className="mr-2 text-gray-600">تذكرني</span>
            </label>
            <button type="button" className="text-[#D4AF37] hover:text-[#FFD700]">
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-lg font-bold hover:from-[#FFD700] hover:to-[#D4AF37] transition-all"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ليس لديك حساب؟{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#D4AF37] hover:text-[#FFD700] font-medium"
            >
              سجل الآن
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

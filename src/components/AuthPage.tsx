import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onClose: () => void;
  initialMode: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('كلمة المرور غير متطابقة');
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              username: email.split('@')[0]
            }
          }
        });

        if (signUpError) throw signUpError;

        // Auto sign in after registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        onClose();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message === 'Failed to fetch') {
        setError('فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
      } else {
        setError(err.message === 'Invalid login credentials'
          ? 'بيانات تسجيل الدخول غير صحيحة'
          : err.message || 'حدث خطأ في المصادقة');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#800020] p-8 rounded-2xl shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F5DEB3] hover:text-[#FFE4E1] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-center text-[#F5DEB3] mb-8">
          {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[#F5DEB3] mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#F5DEB3] bg-opacity-20 border-2 border-[#F5DEB3] text-[#F5DEB3] placeholder-[#F5DEB3] placeholder-opacity-50 focus:outline-none focus:border-[#FFE4E1]"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#F5DEB3] mb-2">كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#F5DEB3] bg-opacity-20 border-2 border-[#F5DEB3] text-[#F5DEB3] placeholder-[#F5DEB3] placeholder-opacity-50 focus:outline-none focus:border-[#FFE4E1]"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-[#F5DEB3] mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-[#F5DEB3] bg-opacity-20 border-2 border-[#F5DEB3] text-[#F5DEB3] placeholder-[#F5DEB3] placeholder-opacity-50 focus:outline-none focus:border-[#FFE4E1]"
                placeholder="أعد إدخال كلمة المرور"
                required
              />
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#F5DEB3] text-[#800020] py-2 px-4 rounded-lg font-bold hover:bg-[#FFE4E1] transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'جاري التحميل...' : mode === 'login' ? 'دخول' : 'تسجيل'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#F5DEB3] hover:text-[#FFE4E1] transition-colors"
            >
              {mode === 'login' ? 'إنشاء حساب جديد' : 'لديك حساب؟ سجل دخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

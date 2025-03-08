import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AuthPage from './AuthPage';

interface LandingPageProps {
  onPlay: () => void;
}

export function LandingPage({ onPlay }: LandingPageProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] p-4" dir="rtl">
      <div className="container mx-auto px-4 pt-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-[#FFE4E1] mb-4">العب بدقيقة</h1>
          <p className="text-xl text-[#FFE4E1] opacity-90">تقدر تجاوب بدقيقة ؟</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-[#800020] bg-opacity-70 p-6 rounded-lg text-center text-[#F5DEB3] shadow-lg transform hover:scale-105 transition-transform border-2 border-[#F5DEB3]">
            <div className="flex justify-center mb-4">
              <span className="text-4xl">🎮</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">العب مع ربعك</h3>
            <p className="text-sm opacity-90">استمتع باللعب مع أصدقائك في وقت واحد</p>
          </div>

          <div className="bg-[#800020] bg-opacity-70 p-6 rounded-lg text-center text-[#F5DEB3] shadow-lg transform hover:scale-105 transition-transform border-2 border-[#F5DEB3]">
            <div className="flex justify-center mb-4">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">تنافس على المراكز</h3>
            <p className="text-sm opacity-90">اجمع النقاط وتنافس على المراكز الأولى</p>
          </div>

          <div className="bg-[#800020] bg-opacity-70 p-6 rounded-lg text-center text-[#F5DEB3] shadow-lg transform hover:scale-105 transition-transform border-2 border-[#F5DEB3]">
            <div className="flex justify-center mb-4">
              <span className="text-4xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">تعلم واختبر معرفتك</h3>
            <p className="text-sm opacity-90">اختبر معلوماتك في مختلف المجالات</p>
          </div>
        </div>

        {/* Play Button */}
        <div className="flex justify-center mb-32">
          <button
            onClick={onPlay}
            className="bg-[#F5DEB3] text-[#800020] px-8 py-4 rounded-lg text-xl font-semibold hover:bg-[#E8D1A0] transition-colors shadow-lg"
          >
            ابدأ اللعب
          </button>
        </div>

        {/* Help Methods Section */}
        <div className="max-w-5xl mx-auto mb-32">
          <h2 className="text-3xl font-bold text-center text-[#FFE4E1] mb-8">وسائل المساعدة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* دبل Card */}
            <div className="bg-[#800020] bg-opacity-70 rounded-2xl p-8 text-center relative overflow-hidden group hover:shadow-xl transition-all border-2 border-[#F5DEB3]">
              <h3 className="text-2xl font-bold text-[#F5DEB3] mb-4">دبل</h3>
              <p className="text-[#FFE4E1] mb-6">
                متوهق ؟
                <br />
                متوهق مو باقي شي وتخلص الللعبه ؟ ادبل واقلب الطاولة عليهم
              </p>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center text-[#F5DEB3]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="bg-[#F5DEB3] text-[#800020] py-2 px-4 rounded-lg inline-block font-bold">
                تستخدمها قبل ماتشوف السؤال
              </div>
            </div>

            {/* جاوب جوابين Card */}
            <div className="bg-[#800020] bg-opacity-70 rounded-2xl p-8 text-center relative overflow-hidden group hover:shadow-xl transition-all border-2 border-[#F5DEB3]">
              <h3 className="text-2xl font-bold text-[#F5DEB3] mb-4">جاوب جوابين</h3>
              <p className="text-[#FFE4E1] mb-6">
                متردد بجوابين؟ هذي لك!
                <br />
                جاوب بالاثنين علشان تضمن النقاط
              </p>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center text-[#F5DEB3]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 11h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <div className="bg-[#F5DEB3] text-[#800020] py-2 px-4 rounded-lg inline-block font-bold">
                تستخدمها بعد ماتشوف السؤال
              </div>
            </div>

            {/* اتصال بصديق Card */}
            <div className="bg-[#800020] bg-opacity-70 rounded-2xl p-8 text-center relative overflow-hidden group hover:shadow-xl transition-all border-2 border-[#F5DEB3]">
              <h3 className="text-2xl font-bold text-[#F5DEB3] mb-4">اتصال بصديق</h3>
              <p className="text-[#FFE4E1] mb-6">
                صديقك اللي يعرف كل شي
                <br />
                هذا وقته دق عليه!
              </p>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center text-[#F5DEB3]">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="bg-[#F5DEB3] text-[#800020] py-2 px-4 rounded-lg inline-block font-bold">
                تستخدمها بعد ماتشوف السؤال
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-[#800020] py-4 mt-auto -mx-4 -mb-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-row-reverse items-center justify-between">
              <div className="text-sm text-[#F5DEB3]">
                &copy; {new Date().getFullYear()} Bdgeega - جميع الحقوق محفوظة
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#F5DEB3]">
                  <span className="text-lg font-bold">Bdgeega Team</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2 text-[#F5DEB3]">
                  <span className="text-sm">Developed by Ali Alenezi</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Logo */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <img 
            src="https://i.postimg.cc/NfP1DWbv/bdgeega-removebg-preview.png" 
            alt="Bdgeega Logo" 
            className="w-24 h-auto md:w-32 lg:w-40"
          />
        </div>

        {/* Auth Buttons */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col md:flex-row gap-2 md:gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 md:px-6 bg-[#F5DEB3] text-[#800020] rounded-full font-bold hover:bg-[#E8D1A0] transition-colors shadow-lg"
            >
              تسجيل الخروج
            </button>
          ) : (
            <>
              <button
                onClick={() => handleAuthClick('login')}
                className="px-4 py-2 md:px-6 bg-[#F5DEB3] text-[#800020] rounded-full font-bold hover:bg-[#E8D1A0] transition-colors shadow-lg"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => handleAuthClick('register')}
                className="px-4 py-2 md:px-6 bg-[#800020] text-[#F5DEB3] rounded-full font-bold hover:bg-[#A0455A] transition-colors shadow-lg"
              >
                إنشاء حساب
              </button>
            </>
          )}
        </div>

        {showAuth && (
          <AuthPage
            initialMode={authMode}
            onClose={() => setShowAuth(false)}
          />
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthPage from './AuthPage';
import { motion } from 'framer-motion';
import { addUser, findUser } from '../data/users';
import { Box, Button, Container, Typography } from "@mui/material";
import { initiatePayment, executePayment } from '../services/myFatoorah';

interface LandingPageProps {
  onPlay: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  currentUser: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [gamesToPurchase, setGamesToPurchase] = useState(1);
  const [remainingGames, setRemainingGames] = useState(0);
  const [error, setError] = useState('');

  // تعطيل مؤقت لنظام الشراء
  const PAYMENT_SYSTEM_ENABLED = false;

  const startGame = () => {
    navigate('/categories');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] p-4 overflow-hidden" dir="rtl">
      {/* الشعار */}
      <div className="absolute top-0 right-0 z-50 p-2">
        <img 
          src="https://i.postimg.cc/NfP1DWbv/bdgeega-removebg-preview.png" 
          alt="Bdgeega Logo" 
          className="w-24 h-auto md:w-32 lg:w-40"
        />
      </div>

      {/* Circular Background */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-[75%] bg-[#800020] rounded-b-[50%] shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #800020 0%, #A0455A 100%)',
        }}
      />

      {PAYMENT_SYSTEM_ENABLED && (
        <div className="absolute top-4 left-4 bg-[#800020]/40 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center">
          <div className="text-[#F5DEB3] mb-2">
            <span className="font-bold">المتبقي من الألعاب: </span>
            <span className="text-2xl">{remainingGames}</span>
          </div>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="bg-[#F5DEB3] text-[#800020] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#E8D1A0] transition-colors"
          >
            +
          </button>
        </div>
      )}

      {PAYMENT_SYSTEM_ENABLED && showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F5DEB3] rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#800020] mb-6 text-center">شراء ألعاب جديدة</h2>
            
            <div className="mb-6">
              <label className="block text-[#800020] mb-2 font-semibold">عدد الألعاب</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGamesToPurchase(prev => Math.max(1, prev - 1))}
                  className="bg-[#800020] text-[#F5DEB3] w-8 h-8 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-[#800020]">{gamesToPurchase}</span>
                <button
                  onClick={() => setGamesToPurchase(prev => prev + 1)}
                  className="bg-[#800020] text-[#F5DEB3] w-8 h-8 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-[#800020] font-semibold mb-2">
                <span>السعر للعبة الواحدة:</span>
                <span>1 د.ك</span>
              </div>
              <div className="flex justify-between text-[#800020] font-bold text-xl">
                <span>المجموع:</span>
                <span>{gamesToPurchase} د.ك</span>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-[#F5DEB3] transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => console.log('handlePurchase')}
                className="flex-1 px-6 py-3 rounded-lg bg-[#800020] text-[#F5DEB3] hover:bg-[#600018] transition-colors"
              >
                شراء
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex flex-col min-h-screen">
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

        {/* Start Game Button */}
        <div className="text-center mb-32">
          <button
            onClick={startGame}
            className="bg-[#F5DEB3] text-[#800020] px-12 py-6 rounded-full text-2xl font-bold hover:bg-[#E8D1A0] transition-colors shadow-lg"
          >
            ابدأ اللعب
          </button>
        </div>

        {/* وسائل المساعدة في الأسفل */}
        <div className="mt-auto">
          {/* قسم "ليش بدقيقة؟" */}
          <div className="mb-32">
            <div className="max-w-3xl mx-auto bg-[#800020]/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#F5DEB3]/30">
              <h2 className="text-3xl font-bold text-[#F5DEB3] mb-6 text-center">ليش بدقيقة؟</h2>
              <p className="text-xl text-[#F5DEB3] text-center leading-relaxed">
                بدقيقة لعبة اجتماعية ثقافية تتميز عن كل الألعاب بالأسعار والتنوع في الفئات والأفكار الجديدة تناسب جميع الأعمار .
              </p>
            </div>
          </div>

          {/* Help Methods Section */}
          <div className="max-w-5xl mx-auto mb-32">
            <h2 className="text-3xl font-bold text-[#F5DEB3] mb-8 text-center">وسائل المساعدة</h2>
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                </div>
                <div className="bg-[#F5DEB3] text-[#800020] py-2 px-4 rounded-lg inline-block font-bold">
                  تستخدمها بعد ماتشوف السؤال
                </div>
              </div>
            </div>
          </div>

          {/* قسم فئات بدقيقة */}
          <div className="mb-32">
            <div className="flex justify-center mb-12">
              <div className="inline-block bg-[#800020]/30 backdrop-blur-sm rounded-2xl px-12 py-4 border-2 border-[#F5DEB3]/30">
                <h2 className="text-3xl font-bold text-center text-[#F5DEB3]">فئات بدقيقة</h2>
              </div>
            </div>
            
            {/* شريط متحرك للفئات - يمين لليسار */}
            <div className="relative overflow-hidden w-full py-4">
              <style jsx>{`
                @keyframes slideRight {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                @keyframes slideLeft {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
                }
                .animate-slideRight {
                  animation: slideRight 15s linear infinite;
                }
                .animate-slideLeft {
                  animation: slideLeft 15s linear infinite;
                }
                .category-item {
                  transition: transform 0.3s ease-in-out;
                }
                .category-item:hover {
                  transform: scale(1.1);
                }
                .categories-container {
                  width: 100%;
                  overflow: hidden;
                }
                .categories-inner {
                  display: flex;
                  width: fit-content;
                }
              `}</style>
              
              <div className="categories-container">
                <div className="categories-inner animate-slideRight">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex gap-8 mx-4 flex-nowrap">
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/QCSSXz2M/IMG-3748.jpg" alt="الكويت" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">الكويت</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/25hSPNWn/IMG-3749.jpg" alt="معلومات عامة" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">معلومات عامة</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/285PG7xQ/IMG-3719.jpg" alt="جغرافيا" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">جغرافيا</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/zvmcn3r4/image-6.png" alt="شعارات" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">شعارات</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/2SFGt2fc/IMG-3721.jpg" alt="اماكن" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">اماكن</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/3JQZxYmx/IMG-3724.jpg" alt="ميك اب" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">ميك اب</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/6q2z1K9n/IMG-3726.jpg" alt="امثلة والغاز" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">امثلة والغاز</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/9XdB0LDW/IMG-3729.jpg" alt="العاب الفيديو" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">العاب الفيديو</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/VkPyPG0X/IMG-3732.jpg" alt="مبتعثين امريكا" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">مبتعثين امريكا</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/dVhn9XRG/IMG-3738.jpg" alt="السكاريب" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">السكاريب</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/yx3zKWhN/image-7.png" alt="اغاني عراقية" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">اغاني عراقية</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* شريط متحرك للفئات - يسار لليمين */}
            <div className="relative overflow-hidden w-full py-4">
              <div className="categories-container">
                <div className="categories-inner animate-slideLeft">
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="flex gap-8 mx-4 flex-nowrap">
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/QCSSXz2M/IMG-3748.jpg" alt="الكويت" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">الكويت</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/25hSPNWn/IMG-3749.jpg" alt="معلومات عامة" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">معلومات عامة</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/285PG7xQ/IMG-3719.jpg" alt="جغرافيا" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">جغرافيا</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/zvmcn3r4/image-6.png" alt="شعارات" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">شعارات</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/2SFGt2fc/IMG-3721.jpg" alt="اماكن" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">اماكن</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/3JQZxYmx/IMG-3724.jpg" alt="ميك اب" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">ميك اب</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/6q2z1K9n/IMG-3726.jpg" alt="امثلة والغاز" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">امثلة والغاز</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/9XdB0LDW/IMG-3729.jpg" alt="العاب الفيديو" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">العاب الفيديو</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/VkPyPG0X/IMG-3732.jpg" alt="مبتعثين امريكا" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">مبتعثين امريكا</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/dVhn9XRG/IMG-3738.jpg" alt="السكاريب" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">السكاريب</p>
                      </div>
                      <div className="category-item">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F5DEB3] shadow-lg">
                          <img src="https://i.postimg.cc/yx3zKWhN/image-7.png" alt="اغاني عراقية" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[#F5DEB3] text-center mt-2 font-bold">اغاني عراقية</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#800020] py-4 mt-32">
            <div className="container mx-auto px-4">
              <div className="flex flex-row-reverse items-center justify-between">
                <div className="text-sm text-[#F5DEB3]">
                  &copy; {new Date().getFullYear()} Bdgeega - جميع الحقوق محفوظة
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#F5DEB3]">
                    <span className="text-lg font-bold">Bdgeega Team</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 text-[#F5DEB3]">
                    <span className="text-sm">Developed by Ali Alenezi</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Auth Buttons */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col md:flex-row gap-2 md:gap-4">
          {currentUser ? (
            <>
              <button
                onClick={() => console.log('handleProfile')}
                className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#600018] transition-colors"
              >
                الملف الشخصي
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                تسجيل خروج
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                className="bg-[#F5DEB3] text-[#800020] rounded-full font-bold hover:bg-[#E8D1A0] transition-colors shadow-lg"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => console.log('handleRegister')}
                className="bg-[#800020] text-[#F5DEB3] rounded-full font-bold hover:bg-[#A0455A] transition-colors shadow-lg"
              >
                إنشاء حساب
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
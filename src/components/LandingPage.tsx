import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Button, Container, Typography } from "@mui/material";
import { Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthComponent from './Auth';
import { getGameCategories } from '../utils/gameUtils';
import PurchaseDialog from './PurchaseDialog';
import GameCodeModal from './GameCodeModal';
import { Session } from '@supabase/supabase-js';

interface LandingPageProps {
  onStartGame: () => void;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  questions: any[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartGame }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [gamesRemaining, setGamesRemaining] = useState(0);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemError, setRedeemError] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameCategories, setGameCategories] = useState<Category[]>([]);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [showGameCodeModal, setShowGameCodeModal] = useState(false);

  useEffect(() => {
    // Get random categories when component mounts
    setGameCategories(getGameCategories());

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session?.user) {
          await fetchGamesRemaining(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchGamesRemaining(session.user.id);
      } else {
        setGamesRemaining(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchGamesRemaining = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_games')
        .select('games_remaining')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // إنشاء سجل جديد للمستخدم
          const { error: insertError } = await supabase
            .from('user_games')
            .insert({
              user_id: userId,
              games_remaining: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating user record:', insertError);
            return;
          }
          setGamesRemaining(0);
          return;
        }
        throw error;
      }

      setGamesRemaining(data?.games_remaining || 0);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const handleStartGame = async () => {
    // الانتقال إلى صفحة الفئات مباشرة
    navigate('/categories');
  };

  const handlePurchaseComplete = (gamesCount: number) => {
    // Update remaining games count in your database/state
    // This is where you'll integrate with your backend
    console.log(`Purchased ${gamesCount} games`);
  };

  const handleGameCodeSuccess = async () => {
    if (session?.user) {
      await fetchGamesRemaining(session.user.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] p-4" dir="rtl">
      <img 
        src="https://i.postimg.cc/DfJ4XbW5/bdgeegalogo-removebg-preview.png" 
        alt="Bdgeega Logo" 
        className="absolute top-4 right-4 w-[120px] h-auto z-50"
      />
      {/* الشريط العلوي */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-4">
        {/* عداد الألعاب */}
        {session && (
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 flex items-center gap-2">
            <span className="text-white">الألعاب المتبقية:</span>
            <motion.span 
              className="text-white font-bold"
              key={gamesRemaining}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {gamesRemaining}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGameCodeModal(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5DEB3] to-[#800020] text-white hover:from-[#800020] hover:to-[#F5DEB3] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </motion.button>
          </div>
        )}

        {/* زر تسجيل الدخول/الخروج */}
        {session ? (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-2"
          >
            <span className="text-white text-sm">مرحباً {session.user.user_metadata.name || session.user.email}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => supabase.auth.signOut()}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              تسجيل الخروج
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-[#800020] to-[#A0455A] text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:from-[#A0455A] hover:to-[#800020] transition-all duration-300"
          >
            تسجيل الدخول
          </motion.button>
        )}
      </div>


      {/* رسالة الخطأ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {showAuth && !session && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#800020] to-[#A0455A] p-4">
              <div className="flex justify-between items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAuth(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>
            <div className="p-6">
              <AuthComponent onClose={() => setShowAuth(false)} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Purchase Dialog */}
      <PurchaseDialog
        isOpen={showPurchaseDialog}
        onClose={() => setShowPurchaseDialog(false)}
        onPurchaseComplete={handlePurchaseComplete}
      />

      {/* Game Code Modal */}
      <GameCodeModal
        isOpen={showGameCodeModal}
        onClose={() => setShowGameCodeModal(false)}
        onSuccess={handleGameCodeSuccess}
      />

      {/* Circular Background */}
      <div 
        className="absolute top-0 left-0 right-0 bottom-[75%] bg-[#800020] rounded-b-[50%] shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #800020 0%, #A0455A 100%)',
        }}
      />

      <div className="relative flex flex-col min-h-screen">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-[#F5DEB3] mb-4" style={{ fontFamily: "'Amiri', serif" }}> بدقيقة</h1>
          <p className="text-xl text-[#F5DEB3] opacity-90">تقدر تجاوب بدقيقة ؟</p>
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
            <h3 className="text-xl font-semibold mb-2">تنافس </h3>
            <p className="text-sm opacity-90">اجمع النقاط وتنافس على الفوز </p>
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
            onClick={handleStartGame}
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
              <h2 className="text-3xl font-bold text-center text-[#F5DEB3]">ليش بدقيقة</h2>
              <p className="text-xl text-[#F5DEB3] text-center leading-relaxed">
               لأن  بدقيقة لعبة اجتماعية ثقافية تتميز عن كل الألعاب بالأسعار والتنوع في الفئات والأفكار الجديدة تناسب جميع الأعمار .
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
                <h3 className="text-2xl font-bold text-[#F5DEB3] mb-4">حرف الأول</h3>
                <p className="text-[#FFE4E1] mb-6">
                  عندك جواب بس مو متأكد ؟
                  <br />
                  <br />
                  هذي لك تقدر تشوف الحرف الأول من الجواب وتلعب عالمضمون .
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
                    <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z" fill="currentColor"/>
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
              <style>{`
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
                  &copy; {new Date().getFullYear()} bdgeega - جميع الحقوق محفوظة
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#F5DEB3]">
                    <span className="text-lg font-bold">bdgeega Team</span>
                    <a 
                      href="https://instagram.com/bdgeegakw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-[#F5DEB3]/80 transition-colors"
                    >
                      <Instagram size={24} />
                    </a>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 text-[#F5DEB3]">
                    <a 
                      href="https://instagram.com/xxvur_" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-bold hover:text-[#F5DEB3]/80 transition-colors"
                    >
                      Developed by Ali Alenezi
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
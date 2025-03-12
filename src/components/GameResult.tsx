import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface GameResultProps {
  score: number;
  totalQuestions: number;
}

export const GameResult: React.FC<GameResultProps> = ({ score, totalQuestions }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateGamesRemaining = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // تأكد من أن عدد الألعاب 0
        const { error } = await supabase
          .from('user_games')
          .update({ games_remaining: 0 })
          .eq('user_id', user.id);

        if (error) {
          console.error('خطأ في تحديث عدد الألعاب:', error);
        }
      }
    };

    updateGamesRemaining();
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] p-4"
      dir="rtl"
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">نتيجة اللعبة</h2>
        <div className="text-2xl text-white mb-8">
          لقد حصلت على {score} من {totalQuestions}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReturn}
          className="bg-white text-[#800020] px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-opacity-90 transition-all duration-300"
        >
          العودة للصفحة الرئيسية
        </motion.button>
      </div>
    </motion.div>
  );
};

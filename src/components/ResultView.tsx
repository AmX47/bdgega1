import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

interface ResultViewProps {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  onHome: () => void;
}

export function ResultView({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  onHome
}: ResultViewProps) {
  const isTie = team1Score === team2Score;
  const winner = team1Score > team2Score ? team1Name : team2Name;
  const winnerScore = team1Score > team2Score ? team1Score : team2Score;
  const loser = team1Score > team2Score ? team2Name : team1Name;
  const loserScore = team1Score > team2Score ? team2Score : team1Score;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-gray-800 flex flex-col items-center justify-center p-8" dir="rtl">
      {!isTie && <Confetti numberOfPieces={200} recycle={false} />}
      
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
          {isTie ? 'تعادل الفريقين!' : 'مبروك!'}
        </h1>
        {!isTie && (
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-[white]"
          >
            {winner}
          </motion.h2>
        )}
      </motion.div>

      <div className="flex gap-20 items-center justify-center mb-16">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center transform transition-all duration-500 ${team1Score >= team2Score ? 'scale-110' : 'scale-90'}`}
        >
          <div className={`bg-[#800020] w-36 h-36 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${team1Score >= team2Score ? 'ring-4 ring-red-400' : ''}`}>
            <span className="text-6xl font-bold text-white">{team1Score}</span>
          </div>
          <div className={`border-2 ${team1Score >= team2Score ? 'border-[#800020] bg-white' : 'border-gray-400 bg-gray-800'} rounded-xl px-6 py-3 shadow-lg`}>
            <h2 className={`text-2xl font-bold ${team1Score >= team2Score ? 'text-[#800020]' : 'text-gray-400'}`}>{team1Name}</h2>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center"
        >
          {!isTie && (
            <img 
              src="https://i.postimg.cc/JzGGkLjW/image-6-removebg-preview.png" 
              alt="Trophy"
              className="w-56 h-56 object-contain -mt-6 drop-shadow-[0_0_15px_rgba(115,0,11)]"
            />
          )}
        </motion.div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center transform transition-all duration-500 ${team2Score >= team1Score ? 'scale-110' : 'scale-90'}`}
        >
          <div className={`bg-[#800020] w-36 h-36 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${team2Score >= team1Score ? 'ring-4 ring-red-400' : ''}`}>
            <span className="text-6xl font-bold text-white">{team2Score}</span>
          </div>
          <div className={`border-2 ${team2Score >= team1Score ? 'border-[#800020] bg-white' : 'border-gray-400 bg-gray-800'} rounded-xl px-6 py-3 shadow-lg`}>
            <h2 className={`text-2xl font-bold ${team2Score >= team1Score ? 'text-[#800020]' : 'text-gray-400'}`}>{team2Name}</h2>
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onHome}
        className="bg-[#800020] text-white px-10 py-4 rounded-xl text-xl hover:bg-[#600018] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-8"
      >
        العودة للصفحة الرئيسية
      </motion.button>


      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: .2 }}
        className="flex items-center justify-center gap-3 text-white"
      >
        <img
          src="https://i.pinimg.com/736x/cb/d2/6a/cbd26a1797fa8ce966c179a392c9d3aa.jpg"
          alt="Streak Icon"
          className="w-20 h-20 object-cover rounded"
        />
        <span className="text-lg font-bold">لا تنسى تدز ستريك!😉</span>
      </motion.div>
    </div>
  );
}

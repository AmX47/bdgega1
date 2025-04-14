import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

interface ResultViewProps {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  onBackToHome: () => void;
}

export function ResultView({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  onBackToHome
}: ResultViewProps) {
  const isTie = team1Score === team2Score;
  const winner = team1Score > team2Score ? team1Name : team2Name;
  const winnerScore = team1Score > team2Score ? team1Score : team2Score;
  const loser = team1Score > team2Score ? team2Name : team1Name;
  const loserScore = team1Score > team2Score ? team2Score : team1Score;

  return (
    <div className="min-h-screen bg-[#800020] relative overflow-hidden flex flex-col items-center justify-center p-8" dir="rtl">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-[#800020] z-0"
      />
      <div className="absolute inset-0 bg-gradient-radial from-[#9a0026]/90 via-[#800020]/90 to-[#600018]/90 opacity-90 z-0"></div>
      
      {/* Right hand image */}
      <div 
        className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-contain bg-no-repeat bg-right-bottom z-0"
        style={{ 
          backgroundImage: 'url("https://i.postimg.cc/MTX76yYj/righthand-removebg-preview.png")',
          transform: 'rotate(-10deg)'
        }}
      />

      {/* Left hand image */}
      <div 
        className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-contain bg-no-repeat bg-left-bottom z-0"
        style={{ 
          backgroundImage: 'url("https://i.postimg.cc/RVc4s2zN/lefthand-removebg-preview.png")',
          transform: 'rotate(10deg)'
        }}
      />
      
      {/* Content with higher z-index */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Confetti effect for winners */}
        {!isTie && <Confetti numberOfPieces={300} recycle={false} colors={['#800020', '#FFFFFF', '#600018']} />}
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            {isTie ? 'تعادل الفريقين!' : 'مبروك!'}
          </h1>
          {!isTie && (
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            >
              {winner}
            </motion.h2>
          )}
        </motion.div>

        <div className="flex gap-24 items-center justify-center mb-16">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-center transform transition-all duration-500 ${team1Score >= team2Score ? 'scale-110' : 'scale-90'}`}
          >
            <div className={`backdrop-blur-sm w-40 h-40 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] 
              ${team1Score > team2Score ? 'bg-green-500/20 ring-4 ring-green-500' : 'bg-red-500/20 ring-4 ring-red-500'} 
              ${team1Score === team2Score ? 'bg-white/10 ring-4 ring-[#600018]' : ''}`}>
              <span className="text-7xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">{team1Score}</span>
            </div>
            <div className={`backdrop-blur-sm bg-white border-2 border-[#aa4465] rounded-xl px-8 py-4 shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <h2 className="text-2xl font-bold text-[#800020]">{team1Name}</h2>
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
                src="https://i.postimg.cc/jdJmZfPc/whielogo.png" 
                alt="Trophy"
                className="w-64 h-64 object-contain -mt-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] brightness-200"
              />
            )}
          </motion.div>

          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`text-center transform transition-all duration-500 ${team2Score >= team1Score ? 'scale-110' : 'scale-90'}`}
          >
            <div className={`backdrop-blur-sm w-40 h-40 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.3)]
              ${team2Score > team1Score ? 'bg-green-500/20 ring-4 ring-green-500' : 'bg-red-500/20 ring-4 ring-red-500'}
              ${team1Score === team2Score ? 'bg-white/10 ring-4 ring-[#600018]' : ''}`}>
              <span className="text-7xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">{team2Score}</span>
            </div>
            <div className={`backdrop-blur-sm bg-white border-2 border-[#aa4465] rounded-xl px-8 py-4 shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <h2 className="text-2xl font-bold text-[#800020]">{team2Name}</h2>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 text-white mb-4"
          >
            <img
              src="https://i.pinimg.com/736x/cb/d2/6a/cbd26a1797fa8ce966c179a392c9d3aa.jpg"
              alt="Streak Icon"
              className="w-16 h-16 object-cover rounded"
            />
            <span className="text-base font-bold">لا تنسى تدز ستريك!😉</span>
          </motion.div>

          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onBackToHome}
            className="bg-white/10 backdrop-blur-sm text-white px-12 py-4 rounded-full text-2xl hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-['Changa'] tracking-wide font-bold"
            style={{ fontFamily: "'Changa', sans-serif" }}
          >
            العودة للصفحة الرئيسية
          </motion.button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Confetti from 'react-confetti';

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8" dir="rtl">
      {!isTie && <Confetti />}
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-[#7A288A] mb-4">
          {isTie ? 'تعادل الفريقين!' : 'مبروك!'}
        </h1>
        {!isTie && (
          <h2 className="text-3xl font-bold text-[#7A288A]">{winner}</h2>
        )}
      </div>

      <div className="flex gap-20 items-center justify-center mb-16">
        <div className={`text-center transform transition-all duration-500 ${team1Score >= team2Score ? 'scale-110' : 'scale-90'}`}>
          <div className="bg-[#7A288A] w-32 h-32 rounded-lg flex items-center justify-center mb-4">
            <span className="text-5xl font-bold text-white">{team1Score}</span>
          </div>
          <div className="border-2 border-[#7A288A] rounded-lg px-4 py-2">
            <h2 className="text-2xl font-bold text-[#7A288A]">{team1Name}</h2>
          </div>
        </div>

        <div className="flex items-center">
          <img 
            src="https://png.pngtree.com/png-clipart/20250103/original/pngtree-gold-trophy-icon-trophy-icon-winner-icon-png-image_4979039.png" 
            alt="Trophy"
            className="w-48 h-48 object-contain -mt-6"
          />
        </div>

        <div className={`text-center transform transition-all duration-500 ${team2Score >= team1Score ? 'scale-110' : 'scale-90'}`}>
          <div className="bg-[#7A288A] w-32 h-32 rounded-lg flex items-center justify-center mb-4">
            <span className="text-5xl font-bold text-white">{team2Score}</span>
          </div>
          <div className="border-2 border-[#7A288A] rounded-lg px-4 py-2">
            <h2 className="text-2xl font-bold text-[#7A288A]">{team2Name}</h2>
          </div>
        </div>
      </div>

      <button
        onClick={onHome}
        className="bg-[#7A288A] text-white px-8 py-3 rounded-lg text-xl hover:bg-[#5A1868] transition-colors"
      >
        العودة للصفحة الرئيسية
      </button>
    </div>
  );
}

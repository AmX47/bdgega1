import React from 'react';

interface Team {
  id: number;
  name: string;
  score: number;
}

interface GameOverProps {
  teams: Team[];
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ teams, onPlayAgain, onHome }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const loser = sortedTeams[1];
  const isDraw = winner.score === loser.score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-4xl w-full bg-[#800020] rounded-lg p-8 shadow-2xl border-4 border-[#F5DEB3]">
        {/* Game Over Title */}
        <h1 className="text-4xl font-bold text-center text-[#F5DEB3] mb-8 drop-shadow-lg">
          انتهت اللعبة!
        </h1>

        {isDraw ? (
          /* Draw Result */
          <div className="text-center mb-12">
            <div className="text-3xl font-bold text-[#F5DEB3] mb-4">تعادل!</div>
            <div className="text-xl text-[#F5DEB3]">
              النتيجة النهائية: {winner.score} نقطة
            </div>
          </div>
        ) : (
          /* Winner and Loser Display */
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Winner */}
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="bg-[#F5DEB3] rounded-lg p-6 shadow-lg border-4 border-[#FFD700]">
                <div className="text-[#800020] text-2xl font-bold mb-2">🏆 الفائز 🏆</div>
                <div className="text-[#800020] text-xl font-bold">{winner.name}</div>
                <div className="text-[#800020] text-3xl font-bold mt-4">{winner.score}</div>
                <div className="text-[#800020] text-lg">نقطة</div>
              </div>
            </div>

            {/* Loser */}
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="bg-[#F5DEB3] bg-opacity-80 rounded-lg p-6 shadow-lg">
                <div className="text-[#800020] text-2xl font-bold mb-2">المركز الثاني</div>
                <div className="text-[#800020] text-xl font-bold">{loser.name}</div>
                <div className="text-[#800020] text-3xl font-bold mt-4">{loser.score}</div>
                <div className="text-[#800020] text-lg">نقطة</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onPlayAgain}
            className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-lg text-xl font-bold hover:bg-[#E8D1A0] transition-colors shadow-lg"
          >
            العب مرة أخرى
          </button>
          <button
            onClick={onHome}
            className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-8 py-3 rounded-lg text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors shadow-lg"
          >
            الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

interface Team {
  name: string;
  score: number;
  players: string[];
}

interface GameOverProps {
  gameName: string;
  team1: Team;
  team2: Team;
  onPlayAgain: () => void;
}

export function GameOver({ gameName, team1, team2, onPlayAgain }: GameOverProps) {
  const isDraw = team1.score === team2.score;
  const winner = isDraw ? null : team1.score > team2.score ? team1 : team2;
  const loser = isDraw ? null : team1.score > team2.score ? team2 : team1;

  // تشغيل انيميشن الاحتفال
  React.useEffect(() => {
    const confetti = async () => {
      const module = await import('canvas-confetti');
      const confetti = module.default;

      const duration = isDraw ? 1000 : 3000; // انيميشن أقصر في حالة التعادل
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: isDraw ? 30 : 50,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: Math.random() - 0.2
          },
          colors: isDraw 
            ? ['#7A288A', '#C7B8EA', '#808080'] 
            : ['#7A288A', '#C7B8EA', '#FFD700', '#FF69B4', '#00FF00'],
          shapes: ['square', 'circle'],
          gravity: 1.5,
          scalar: randomInRange(0.4, 1)
        });
      }, 250);

      return () => clearInterval(interval);
    };

    confetti();
  }, [isDraw]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A288A] to-[#C7B8EA] py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
          {/* Game Name */}
          <h1 className="text-5xl font-bold text-[#7A288A] mb-12">
            {gameName}
          </h1>

          {/* Teams */}
          <div className="flex justify-between items-center mb-12">
            {/* Team 1 */}
            <div className={`flex-1 p-6 rounded-2xl ${
              isDraw 
                ? 'bg-gray-100' 
                : winner === team1 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
            }`}>
              <h2 className="text-3xl font-bold mb-4">{team1.name}</h2>
              <p className={`text-4xl font-bold ${
                isDraw 
                  ? 'text-[#7A288A]' 
                  : winner === team1 
                    ? 'text-[#7A288A]' 
                    : 'text-[#7A288A]'
              }`}>
                {team1.score}
              </p>
              {!isDraw && winner === team1 && (
                <div className="mt-4">
                  <span className="inline-block animate-bounce text-4xl">🏆</span>
                </div>
              )}
            </div>

            {/* VS */}
            <div className="px-8">
              <span className="text-4xl font-bold text-[#7A288A]">VS</span>
            </div>

            {/* Team 2 */}
            <div className={`flex-1 p-6 rounded-2xl ${
              isDraw 
                ? 'bg-gray-100' 
                : winner === team2 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
            }`}>
              <h2 className="text-3xl font-bold mb-4">{team2.name}</h2>
              <p className={`text-4xl font-bold ${
                isDraw 
                  ? 'text-[#7A288A]' 
                  : winner === team2 
                    ? 'text-[#7A288A]' 
                    : 'text-[#7A288A]'
              }`}>
                {team2.score}
              </p>
              {!isDraw && winner === team2 && (
                <div className="mt-4">
                  <span className="inline-block animate-bounce text-4xl">🏆</span>
                </div>
              )}
            </div>
          </div>

          {/* Result Announcement */}
          <div className="mb-12">
            {isDraw ? (
              <>
                <h2 className="text-4xl font-bold text-[#7A288A] mb-4">
                  🤝 تعادل! 🤝
                </h2>
                <p className="text-3xl font-bold text-[#7A288A]">
                  حصل كلا الفريقين على {team1.score} نقطة
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-[#7A288A] mb-4">
                  🎉 الفريق الفائز 🎉
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  {winner?.name}
                </p>
                <p className="text-xl text-[#7A288A] mt-2">
                  بنتيجة {winner?.score} نقطة
                </p>
              </>
            )}
          </div>

          {/* Play Again Button */}
          <button
            onClick={onPlayAgain}
            className="bg-[#7A288A] text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-[#8A3399] transform hover:scale-105 transition-all"
          >
            العب مرة ثانية
          </button>
        </div>
      </div>
    </div>
  );
}
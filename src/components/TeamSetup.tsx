import React, { useState } from 'react';

interface TeamSetupProps {
  onStartGame: () => void;
}

export function TeamSetup({ onStartGame }: TeamSetupProps) {
  const [gameName, setGameName] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Players, setTeam1Players] = useState(1);
  const [team2Players, setTeam2Players] = useState(1);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#ff6b2b] via-[#ff8e42] to-[#ffb168] py-8 px-4 rtl">
      {/* Multiple gradient overlays for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.1)_0%,transparent_50%)]"></div>
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <input
          type="text"
          placeholder="اسم اللعبة"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="w-full bg-white rounded-xl px-6 py-4 text-xl text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff8e42] mb-8"
        />

        <div className="grid grid-cols-2 gap-8">
          {/* Team 1 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-6">الفريق الأول</h2>
            <input
              type="text"
              placeholder="اسم الفريق"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.target.value)}
              className="w-full bg-white rounded-xl px-6 py-4 text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff8e42]"
            />
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2">
              <button 
                onClick={() => setTeam1Players(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#ff8e42] font-bold text-xl"
              >
                -
              </button>
              <span className="text-gray-700 text-xl">{team1Players}</span>
              <button 
                onClick={() => setTeam1Players(prev => Math.min(4, prev + 1))}
                className="w-8 h-8 flex items-center justify-center text-[#ff8e42] font-bold text-xl"
              >
                +
              </button>
            </div>
          </div>

          {/* Team 2 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center mb-6">الفريق الثاني</h2>
            <input
              type="text"
              placeholder="اسم الفريق"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.target.value)}
              className="w-full bg-white rounded-xl px-6 py-4 text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff8e42]"
            />
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2">
              <button 
                onClick={() => setTeam2Players(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#ff8e42] font-bold text-xl"
              >
                -
              </button>
              <span className="text-gray-700 text-xl">{team2Players}</span>
              <button 
                onClick={() => setTeam2Players(prev => Math.min(4, prev + 1))}
                className="w-8 h-8 flex items-center justify-center text-[#ff8e42] font-bold text-xl"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          disabled={!team1Name || !team2Name}
          className={`w-full mt-8 text-white text-xl font-bold py-4 rounded-full transition-all transform hover:scale-105 shadow-lg ${
            team1Name && team2Name
              ? 'bg-gradient-to-r from-[#ff6b2b] to-[#ff8e42] hover:from-[#ff8e42] hover:to-[#ff6b2b]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          إبدأ اللعب
        </button>
      </div>

      {/* Wave shape at bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path 
            d="M0,64 C288,89.3 576,97.3 1440,64 L1440,120 L0,120 Z" 
            className="fill-white">
          </path>
        </svg>
      </div>
    </div>
  );
}

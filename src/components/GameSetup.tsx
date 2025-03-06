import React, { useState } from 'react';

interface GameSetupProps {
  onStartGame: (categories: number[], team1Name: string, team2Name: string) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [gameName, setGameName] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Players, setTeam1Players] = useState(1);
  const [team2Players, setTeam2Players] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [error, setError] = useState('');

  const categories = [
    { id: 1, name: 'الكويت', icon: '🇰🇼' },
    { id: 2, name: 'مجلس الأمة', icon: '⚖️' },
    { id: 3, name: 'إسلامي', icon: '🕌' },
    { id: 4, name: 'Prison Break', icon: '🏃' },
    { id: 5, name: 'أغاني وطنية', icon: '🎵' },
    { id: 6, name: 'أعلام', icon: '🏁' },
    { id: 7, name: 'كلمات مدموجة', icon: '🔤' },
    { id: 8, name: 'بحر شوف', icon: '👀' }
  ];

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // If category is already selected, remove it
        return prev.filter(id => id !== categoryId);
      } else if (prev.length < 6) {
        // If category is not selected and we haven't reached the limit, add it
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const handleStartGame = () => {
    if (team1Name.trim() === '' || team2Name.trim() === '') {
      setError('يرجى إدخال أسماء الفريقين');
      return;
    }

    if (selectedCategories.length !== 6) {
      setError('يرجى اختيار 6 فئات للعب');
      return;
    }

    onStartGame(selectedCategories, team1Name, team2Name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A288A] to-[#C7B8EA] py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {/* Categories Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            اختر الفئات ({selectedCategories.length}/6)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'bg-[#7A288A] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={!selectedCategories.includes(category.id) && selectedCategories.length >= 6}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Game Info Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-[#7A288A] mb-8">
            معلومات اللعبة
          </h1>

          {/* Team Names */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Team 1 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                اسم الفريق الأول
              </label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#7A288A] focus:ring-1 focus:ring-[#7A288A] outline-none"
                placeholder="أدخل اسم الفريق الأول"
              />
            </div>

            {/* Team 2 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                اسم الفريق الثاني
              </label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#7A288A] focus:ring-1 focus:ring-[#7A288A] outline-none"
                placeholder="أدخل اسم الفريق الثاني"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            disabled={selectedCategories.length !== 6 || !team1Name.trim() || !team2Name.trim()}
            className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all ${
              selectedCategories.length === 6 && team1Name.trim() && team2Name.trim()
                ? 'bg-[#7A288A] hover:bg-[#6A187A]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            بدء اللعب
          </button>
        </div>
      </div>
    </div>
  );
}

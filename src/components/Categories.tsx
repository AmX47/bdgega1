import React, { useState } from 'react';
import categories from '../data/questions';

interface CategoriesProps {
  onStartGame: (categoryIds: number[], gameName: string, team1Name: string, team2Name: string, team1Players: number, team2Players: number) => void;
  onHome: () => void;
}

export function Categories({ onStartGame, onHome }: CategoriesProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Players, setTeam1Players] = useState(1);
  const [team2Players, setTeam2Players] = useState(1);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else if (prev.length < 6) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const handleStartGame = () => {
    if (selectedCategories.length !== 6) {
      alert('يجب اختيار 6 فئات للعب');
      return;
    }

    if (!team1Name.trim() || !team2Name.trim()) {
      alert('يجب إدخال أسماء الفريقين');
      return;
    }

    onStartGame(selectedCategories, '', team1Name, team2Name, team1Players, team2Players);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A288A] to-[#C7B8EA] py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">اختر الفئات</h1>
          <button
            onClick={onHome}
            className="text-white hover:text-gray-200 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map(category => (
            <div
              key={category.id}
              className={`bg-white rounded-xl overflow-hidden shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
                selectedCategories.includes(category.id) ? 'ring-4 ring-[#7A288A]' : ''
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl text-white">{category.name}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Game Setup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#7A288A] mb-6 text-center">
            معلومات اللعبة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
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
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
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

          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            disabled={selectedCategories.length !== 6 || !team1Name.trim() || !team2Name.trim()}
            className={`w-full mt-8 py-3 rounded-lg text-white text-lg font-semibold transition-all ${
              selectedCategories.length === 6 && team1Name.trim() && team2Name.trim()
                ? 'bg-[#7A288A] hover:bg-[#6A187A]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            بدء اللعب ({selectedCategories.length}/6 فئات)
          </button>
        </div>
      </div>
    </div>
  );
}

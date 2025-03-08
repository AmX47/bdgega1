import React, { useState } from 'react';
import categories from '../data/questions';

interface CategoriesProps {
  onStartGame: (gameData: {
    categoryIds: number[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  }) => void;
  onHome: () => void;
}

const Categories: React.FC<CategoriesProps> = ({ onStartGame, onHome }) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [gameName, setGameName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHelpers, setSelectedHelpers] = useState<string[]>([]);

  const helpers = [
    { id: 'callFriend', name: 'اتصال بصديق' },
    { id: 'doublePoints', name: 'دبل النقاط' },
    { id: 'twoAnswers', name: 'جاوب جوابين' }
  ];

  const handleHelperSelect = (helperId: string) => {
    setSelectedHelpers(prev => {
      if (prev.includes(helperId)) {
        return prev.filter(id => id !== helperId);
      }
      if (prev.length < 3) {
        return [...prev, helperId];
      }
      return prev;
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      if (prev.length < 6) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const handleStartGame = () => {
    if (team1Name && team2Name) {
      onStartGame({
        categoryIds: selectedCategories,
        gameName: gameName || 'لعبة جديدة',
        team1Name,
        team2Name,
        helpers: selectedHelpers
      });
      setIsModalOpen(false);
    }
  };

  const openModal = () => {
    if (selectedCategories.length !== 6) {
      alert('الرجاء اختيار 6 فئات أولاً');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#800020] p-4 relative">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onHome}
          className="absolute top-4 left-4 text-[#F5DEB3] hover:text-[#FFE4E1] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-4xl font-bold text-center text-[#F5DEB3] mb-8 pt-16">اختر الفئات</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-16">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`bg-[#800020] rounded-2xl p-2 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 border-4 ${
                selectedCategories.includes(category.id) 
                  ? 'border-[#00FF00]' 
                  : 'border-[#F5DEB3]'
              }`}
            >
              <div className="relative w-full aspect-square mb-2">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              </div>
              <h2 className="text-lg font-bold text-[#F5DEB3] truncate px-1">{category.name}</h2>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={openModal}
            className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl text-xl font-bold hover:bg-[#FFE4E1] transition-colors"
          >
            إنشاء اللعبة
          </button>
        </div>

        <div className="fixed bottom-4 right-4 bg-[#F5DEB3] text-[#800020] px-4 py-2 rounded-full font-bold shadow-lg">
          {selectedCategories.length}/6 فئات مختارة
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#800020] rounded-2xl p-6 w-full max-w-md border-4 border-[#F5DEB3]">
              <h2 className="text-2xl font-bold text-[#F5DEB3] text-center mb-6">معلومات اللعبة</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#F5DEB3] font-semibold mb-2">
                    اسم اللعبة
                  </label>
                  <input
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#F5DEB3] bg-[#FFE4E1] focus:border-[#F5DEB3] focus:ring-1 focus:ring-[#F5DEB3] outline-none text-[#800020]"
                    placeholder="أدخل اسم اللعبة"
                  />
                </div>
                
                <div>
                  <label className="block text-[#F5DEB3] font-semibold mb-2">
                    اسم الفريق الأول
                  </label>
                  <input
                    type="text"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#F5DEB3] bg-[#FFE4E1] focus:border-[#F5DEB3] focus:ring-1 focus:ring-[#F5DEB3] outline-none text-[#800020]"
                    placeholder="أدخل اسم الفريق الأول"
                  />
                </div>

                <div>
                  <label className="block text-[#F5DEB3] font-semibold mb-2">
                    اسم الفريق الثاني
                  </label>
                  <input
                    type="text"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-[#F5DEB3] bg-[#FFE4E1] focus:border-[#F5DEB3] focus:ring-1 focus:ring-[#F5DEB3] outline-none text-[#800020]"
                    placeholder="أدخل اسم الفريق الثاني"
                  />
                </div>

                <div className="border-t-2 border-[#F5DEB3] pt-4">
                  <label className="block text-[#F5DEB3] font-semibold mb-4">
                    اختر وسائل المساعدة (3 كحد أقصى)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {helpers.map((helper) => (
                      <button
                        key={helper.id}
                        onClick={() => handleHelperSelect(helper.id)}
                        className={`p-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedHelpers.includes(helper.id)
                            ? 'bg-[#00FF00] text-[#800020]'
                            : 'bg-[#F5DEB3] text-[#800020] hover:bg-[#FFE4E1]'
                        } ${
                          selectedHelpers.length === 3 && !selectedHelpers.includes(helper.id)
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={selectedHelpers.length === 3 && !selectedHelpers.includes(helper.id)}
                      >
                        {helper.name}
                      </button>
                    ))}
                  </div>
                  <div className="text-[#F5DEB3] text-sm mt-2">
                    {selectedHelpers.length}/3 وسائل مختارة
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-400 text-white font-semibold hover:bg-gray-500 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleStartGame}
                  disabled={!team1Name.trim() || !team2Name.trim()}
                  className={`flex-1 py-2 rounded-lg font-semibold ${
                    team1Name.trim() && team2Name.trim()
                      ? 'bg-[#F5DEB3] text-[#800020] hover:bg-[#FFE4E1]'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  ابدأ اللعبة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Categories };

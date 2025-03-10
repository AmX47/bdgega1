import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../data/questions';

interface CategoriesProps {
  onStartGame: (gameData: {
    categoryIds: string[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  }) => void;
  onHome: () => void;
  onNext: (categoryIds: string[]) => void;
  currentUser: any;
}

export const Categories: React.FC<CategoriesProps> = ({ onStartGame, onHome, currentUser }) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [gameName, setGameName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [helpers, setHelpers] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const availableHelpers = [
    'استشارة صديق',
    'حذف إجابتين خاطئتين',
    'تخطي السؤال',
    'إضافة 30 ثانية'
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // يمكن إزالة الفئة دائماً
        return prev.filter(id => id !== categoryId);
      } else {
        // لا يمكن إضافة فئة جديدة إذا تم اختيار 6 فئات بالفعل
        if (prev.length >= 6) {
          setError('لا يمكن اختيار أكثر من 6 فئات');
          return prev;
        }
        setError('');
        return [...prev, categoryId];
      }
    });
  };

  const handleHelperToggle = (helper: string) => {
    setHelpers(prev => {
      if (prev.includes(helper)) {
        return prev.filter(h => h !== helper);
      }
      return [...prev, helper];
    });
  };

  const handleNext = () => {
    if (selectedCategories.length !== 6) {
      setError('يجب اختيار 6 فئات بالضبط');
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalNext = () => {
    if (currentStep === 1 && !gameName.trim()) {
      setError('يرجى إدخال اسم اللعبة');
      return;
    }
    if (currentStep === 2 && (!team1Name.trim() || !team2Name.trim())) {
      setError('يرجى إدخال أسماء الفريقين');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      handleStartGame();
    }
  };

  const handleModalBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError('');
    } else {
      setIsModalOpen(false);
      setCurrentStep(1);
    }
  };

  const handleStartGame = () => {
    if (selectedCategories.length !== 6) {
      setError('يجب اختيار 6 فئات بالضبط');
      return;
    }

    const gameSetup = {
      categoryIds: selectedCategories,
      gameName: gameName,
      team1Name: team1Name,
      team2Name: team2Name,
      helpers: helpers
    };

    onStartGame(gameSetup);
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
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

        <h1 className="text-4xl font-bold text-center text-[#F5DEB3] mb-8 pt-16">اختر 6 فئات للعب</h1>

        <div className="text-center mb-6">
          <div className="inline-block bg-[#800020]/40 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-xl text-[#F5DEB3]">
              الفئات المختارة: {selectedCategories.length}/6
            </span>
          </div>
        </div>

        {error && (
          <div className="text-center mb-6">
            <div className="inline-block bg-red-500/80 backdrop-blur-sm rounded-lg px-6 py-2">
              <span className="text-white">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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
              <p className="text-sm text-[#F5DEB3] opacity-75 line-clamp-2">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Selected Categories Display */}
        <div className="mb-8 bg-[#800020]/20 backdrop-blur-sm rounded-xl p-4">
          <h2 className="text-xl font-bold mb-4 text-[#F5DEB3]">الفئات المختارة ({selectedCategories.length}/6)</h2>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => (
              <div
                key={categoryId}
                className="bg-[#800020] text-[#F5DEB3] rounded-full px-4 py-2 flex items-center gap-2"
              >
                <span>{categories.find(category => category.id === categoryId)?.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(categoryId);
                  }}
                  className="w-6 h-6 rounded-full bg-[#F5DEB3] text-[#800020] flex items-center justify-center hover:bg-[#E8D1A0] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            {selectedCategories.length === 0 && (
              <div className="text-[#F5DEB3]/60 italic">لم يتم اختيار أي فئة بعد</div>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={selectedCategories.length !== 6}
            className={`bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-lg text-xl font-semibold hover:bg-[#E8D1A0] transition-colors ${
              selectedCategories.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            إنشاء اللعبة
          </button>
          {selectedCategories.length !== 6 && (
            <p className="text-[#FF6B6B] text-sm mt-2">
              {selectedCategories.length < 6 
                ? `يجب اختيار ${6 - selectedCategories.length} فئات إضافية` 
                : 'يجب اختيار 6 فئات بالضبط'}
            </p>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#F5DEB3] rounded-2xl p-8 max-w-md w-full mx-4 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[#800020] text-sm">
                  {currentStep}/3
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full ${
                        step === currentStep
                          ? 'bg-[#800020]'
                          : step < currentStep
                          ? 'bg-[#800020] opacity-50'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#800020] mb-8 text-center">
                {currentStep === 1 ? 'معلومات اللعبة' :
                 currentStep === 2 ? 'أسماء الفرق' :
                 'وسائل المساعدة'}
              </h2>

              <div className="space-y-6">
                {currentStep === 1 && (
                  <div>
                    <label className="block text-[#800020] mb-2 font-semibold">اسم اللعبة</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم اللعبة"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      className="w-full p-3 border-2 border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
                      dir="rtl"
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#800020] mb-2 font-semibold">اسم الفريق الأول</label>
                      <input
                        type="text"
                        placeholder="أدخل اسم الفريق الأول"
                        value={team1Name}
                        onChange={(e) => setTeam1Name(e.target.value)}
                        className="w-full p-3 border-2 border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-[#800020] mb-2 font-semibold">اسم الفريق الثاني</label>
                      <input
                        type="text"
                        placeholder="أدخل اسم الفريق الثاني"
                        value={team2Name}
                        onChange={(e) => setTeam2Name(e.target.value)}
                        className="w-full p-3 border-2 border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <label className="block text-[#800020] mb-4 font-semibold">اختر وسائل المساعدة</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableHelpers.map((helper) => (
                        <button
                          key={helper}
                          onClick={() => handleHelperToggle(helper)}
                          className={`p-3 rounded-lg text-sm transition-colors ${
                            helpers.includes(helper)
                              ? 'bg-[#800020] text-white'
                              : 'bg-white text-[#800020] border-2 border-[#800020]'
                          }`}
                        >
                          {helper}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={handleModalBack}
                  className="px-6 py-2 rounded-lg border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white transition-colors"
                >
                  {currentStep === 1 ? 'إلغاء' : 'السابق'}
                </button>
                <button
                  onClick={handleModalNext}
                  className="px-6 py-2 rounded-lg bg-[#800020] text-white hover:bg-[#600018] transition-colors"
                >
                  {currentStep === 3 ? 'ابدأ اللعب' : 'التالي'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

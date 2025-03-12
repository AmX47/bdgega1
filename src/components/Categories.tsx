import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../data/questions';

interface CategoriesProps {
  onGameSetup: (gameData: {
    categoryIds: number[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  }) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onGameSetup }) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [gameName, setGameName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [helpers, setHelpers] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [gamesRemaining, setGamesRemaining] = useState(0);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    checkGamesRemaining();
  }, []);

  const checkGamesRemaining = async () => {
    // API call to get games remaining
    // For demonstration purposes, assume 5 games remaining
    setGamesRemaining(5);
  };

  const availableHelpers = [
    'استشارة صديق',
    'حذف إجابتين خاطئتين',
    'تخطي السؤال',
    'إضافة 30 ثانية'
  ];

  const handleCategorySelect = (categoryId: number) => {
    if (gamesRemaining <= 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

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

    onGameSetup(gameSetup);
    navigate('/game');
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
  };

  return (
    <div className="min-h-screen bg-[#800020] p-4 relative">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-[#F5DEB3] hover:text-[#FFE4E1] transition-colors transform hover:scale-110 duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h1 className="text-5xl font-bold text-center text-[#F5DEB3] mb-12 pt-16 drop-shadow-lg">
          اختر <span className="text-[#FFE4E1]">6</span> فئات للعب
        </h1>

        <div className="text-center mb-8">
          <div className="inline-block bg-[#F5DEB3]/10 backdrop-blur-md rounded-full px-8 py-3 shadow-lg">
            <span className="text-2xl text-[#F5DEB3] font-semibold">
              الفئات المختارة: <span className="text-[#FFE4E1]">{selectedCategories.length}/6</span>
            </span>
          </div>
        </div>

        {error && (
          <div className="text-center mb-8">
            <div className="inline-block bg-red-500/90 backdrop-blur-md rounded-lg px-8 py-3 shadow-lg">
              <span className="text-white font-medium">{error}</span>
            </div>
          </div>
        )}

        {showError && (
          <div className="text-center mb-8">
            <div className="inline-block bg-red-500/90 backdrop-blur-md rounded-lg px-8 py-3 shadow-lg">
              <span className="text-white font-medium">عذراً، ليس لديك ألعاب متبقية</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
            >
              <div
                className={`bg-gradient-to-br from-[#800020] to-[#600018] rounded-2xl p-3 text-center cursor-pointer transform hover:scale-105 transition-all duration-300 border-4 shadow-xl ${
                  selectedCategories.includes(category.id) 
                    ? 'border-[#00FF00] shadow-[#00FF00]/20' 
                    : gamesRemaining > 0 ? 'border-[#F5DEB3] hover:border-[#FFE4E1]' : 'border-gray-500'
                }`}
                onClick={() => gamesRemaining > 0 && handleCategorySelect(category.id)}
              >
                <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden shadow-inner">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  {/* Info Icon */}
                  <div 
                    className="absolute top-2 right-2 w-7 h-7 bg-[#87CEEB] rounded-full flex items-center justify-center cursor-help hover:bg-[#87CEEB]/80 transition-colors transform hover:scale-110 shadow-lg"
                    onMouseEnter={() => setHoveredInfo(category.description)}
                    onMouseLeave={() => setHoveredInfo(null)}
                  >
                    <span className="text-white text-lg font-bold">!</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-[#F5DEB3]/10 rounded-xl backdrop-blur-sm">
                  <h2 className="text-lg font-bold text-[#F5DEB3] truncate">{category.name}</h2>
                </div>
              </div>

              {/* Description Tooltip */}
              {hoveredInfo === category.description && (
                <div className="absolute -top-20 left-0 right-0 bg-[#800020] text-[#F5DEB3] p-4 rounded-xl shadow-2xl backdrop-blur-md z-10 text-sm transform transition-all duration-300 border border-[#F5DEB3]/20">
                  {category.description}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#800020] rotate-45 border-r border-b border-[#F5DEB3]/20"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Categories Display */}
        <div className="mb-12 bg-[#F5DEB3]/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-[#F5DEB3]/20">
          <h2 className="text-2xl font-bold mb-6 text-[#F5DEB3] text-center">الفئات المختارة 
            <span className="text-[#FFE4E1]"> ({selectedCategories.length}/6)</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId);
              return category ? (
                <div
                  key={categoryId}
                  className="flex items-center gap-2 bg-[#800020] rounded-full pl-4 pr-2 py-2 group hover:bg-[#600018] transition-colors"
                >
                  <span className="text-[#F5DEB3] font-medium">{category.name}</span>
                  <button
                    onClick={() => removeCategory(categoryId)}
                    className="w-6 h-6 rounded-full bg-[#F5DEB3]/10 text-[#F5DEB3] flex items-center justify-center hover:bg-[#F5DEB3]/20 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleNext}
            disabled={selectedCategories.length !== 6}
            className={`bg-gradient-to-r from-[#F5DEB3] to-[#FFE4E1] text-[#800020] px-10 py-4 rounded-xl text-xl font-bold hover:from-[#FFE4E1] hover:to-[#F5DEB3] transition-all duration-300 transform hover:scale-105 shadow-xl ${
              selectedCategories.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            إنشاء اللعبة
          </button>
          {selectedCategories.length !== 6 && (
            <p className="text-[#FF6B6B] text-sm mt-3 font-medium">
              {selectedCategories.length < 6 
                ? `يجب اختيار ${6 - selectedCategories.length} فئات إضافية` 
                : 'يجب اختيار 6 فئات بالضبط'}
            </p>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-[#F5DEB3] to-[#FFE4E1] rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-white/20">
              <div className="absolute top-4 right-4 flex items-center gap-3">
                <span className="text-[#800020] font-medium">
                  الخطوة {currentStep}/3
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        step === currentStep
                          ? 'bg-[#800020] scale-125'
                          : step < currentStep
                          ? 'bg-[#800020] opacity-50'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#800020] mb-8 text-center mt-6">
                {currentStep === 1 ? 'معلومات اللعبة' :
                 currentStep === 2 ? 'أسماء الفرق' :
                 'وسائل المساعدة'}
              </h2>

              <div className="space-y-6">
                {currentStep === 1 && (
                  <div>
                    <label className="block text-[#800020] mb-3 font-bold">اسم اللعبة</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم اللعبة"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      className="w-full p-4 border-2 border-[#800020] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] bg-white/80 backdrop-blur-sm shadow-inner text-lg"
                      dir="rtl"
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[#800020] mb-3 font-bold">اسم الفريق الأول</label>
                      <input
                        type="text"
                        placeholder="أدخل اسم الفريق الأول"
                        value={team1Name}
                        onChange={(e) => setTeam1Name(e.target.value)}
                        className="w-full p-4 border-2 border-[#800020] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] bg-white/80 backdrop-blur-sm shadow-inner text-lg"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-[#800020] mb-3 font-bold">اسم الفريق الثاني</label>
                      <input
                        type="text"
                        placeholder="أدخل اسم الفريق الثاني"
                        value={team2Name}
                        onChange={(e) => setTeam2Name(e.target.value)}
                        className="w-full p-4 border-2 border-[#800020] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] bg-white/80 backdrop-blur-sm shadow-inner text-lg"
                        dir="rtl"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <label className="block text-[#800020] mb-5 font-bold">اختر وسائل المساعدة</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableHelpers.map((helper) => (
                        <button
                          key={helper}
                          onClick={() => handleHelperToggle(helper)}
                          className={`p-4 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                            helpers.includes(helper)
                              ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg'
                              : 'bg-white text-[#800020] border-2 border-[#800020] hover:bg-[#F5DEB3]/20'
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
                <p className="text-red-500 text-center mt-4 font-medium bg-red-100 py-2 px-4 rounded-lg">{error}</p>
              )}

              <div className="flex justify-between mt-10">
                <button
                  onClick={handleModalBack}
                  className="px-8 py-3 rounded-xl border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white transition-all duration-300 font-bold transform hover:scale-105"
                >
                  {currentStep === 1 ? 'إلغاء' : 'السابق'}
                </button>
                <button
                  onClick={handleModalNext}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#600018] text-white hover:from-[#600018] hover:to-[#800020] transition-all duration-300 font-bold transform hover:scale-105 shadow-lg"
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

export default Categories;

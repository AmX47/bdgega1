import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../data/questions';
import { CategorySuggestionDialog } from './CategorySuggestionDialog';
import { AddCircleOutline, Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton, Tooltip, Badge, Snackbar, Alert } from '@mui/material';
import { supabase } from '../lib/supabase';

interface CategoriesProps {
  onGameSetup: (gameData: {
    categoryIds: string[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  }) => void;
  onHome: () => void;
  onNext?: (categoryIds: string[]) => void;
  currentUser: any;
}

interface FavoriteCategory {
  category_id: string;
  user_id: string;
}

interface CategoryLikes {
  category_id: string;
  likes_count: number;
}

export const Categories: React.FC<CategoriesProps> = ({ onGameSetup, onHome, currentUser }) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [categoryLikes, setCategoryLikes] = useState<Record<string, number>>({});
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [gameName, setGameName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuggestionDialogOpen, setIsSuggestionDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [helpers, setHelpers] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
      fetchCategoryLikes();
    }
  }, [currentUser]);

  const fetchFavorites = async () => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('favorite_categories')
        .select('category_id')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setFavoriteCategories(data?.map(fav => fav.category_id) || []);
    } catch (error) {
      showMessage('حدث خطأ في جلب المفضلة', 'error');
    }
  };

  const fetchCategoryLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('category_likes')
        .select('*');

      if (error) throw error;

      const likesMap = data?.reduce((acc: Record<string, number>, curr: CategoryLikes) => {
        acc[curr.category_id] = curr.likes_count;
        return acc;
      }, {}) || {};

      setCategoryLikes(likesMap);
    } catch (error) {
      showMessage('حدث خطأ في جلب عدد الإعجابات', 'error');
    }
  };

  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const toggleFavorite = async (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!currentUser) {
      showMessage('يجب تسجيل الدخول لإضافة الفئات إلى المفضلة', 'error');
      return;
    }

    try {
      const isFavorited = favoriteCategories.includes(categoryId);

      if (isFavorited) {
        const { error } = await supabase
          .from('favorite_categories')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('category_id', categoryId);

        if (error) throw error;

        setFavoriteCategories(prev => prev.filter(id => id !== categoryId));
        showMessage('تم إزالة الفئة من المفضلة', 'success');
      } else {
        const { error } = await supabase
          .from('favorite_categories')
          .insert([
            { user_id: currentUser.id, category_id: categoryId }
          ]);

        if (error) throw error;

        setFavoriteCategories(prev => [...prev, categoryId]);
        showMessage('تم إضافة الفئة إلى المفضلة', 'success');
      }

      // Refresh category likes after a short delay
      setTimeout(() => {
        fetchCategoryLikes();
      }, 500);
    } catch (error: any) {
      showMessage(error.message || 'حدث خطأ أثناء تحديث المفضلة', 'error');
    }
  };

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
        // إذا كان الوسيلة موجودة، قم بإزالتها
        return prev.filter(h => h !== helper);
      } else {
        // إذا لم تكن موجودة وعدد الوسائل أقل من 3، أضفها
        if (prev.length < 3) {
          setError('');
          return [...prev, helper];
        }
        // إذا تم اختيار 3 وسائل بالفعل، اعرض رسالة خطأ
        setError('يمكنك اختيار 3 وسائل مساعدة فقط');
        return prev;
      }
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
      handleSubmit();
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

  const handleSubmit = () => {
    if (!gameName) {
      setError('الرجاء إدخال اسم اللعبة');
      return;
    }

    if (!team1Name || !team2Name) {
      setError('الرجاء إدخال أسماء الفريقين');
      return;
    }

    onGameSetup({
      categoryIds: selectedCategories,
      gameName,
      team1Name,
      team2Name,
      helpers
    });

    // الانتقال إلى صفحة اللعب
    navigate('/game');
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
  };

  return (
    <div className="min-h-screen bg-[#800020] py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto relative">
        <button
          onClick={() => navigate('/')}
          className="absolute left-0 top-0 text-[#F5DEB3] hover:text-[#FFE4E1] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="categories-header">
          <h1 className="text-4xl font-bold text-center text-[#F5DEB3] mb-8 pt-16">اختر 6 فئات للعب</h1>
          <Tooltip title="اقتراح فئة جديدة" placement="right">
            <IconButton
              onClick={() => setIsSuggestionDialogOpen(true)}
              sx={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                color: 'primary.main',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '12px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                  transition: 'all 0.2s ease-in-out'
                },
                '& svg': {
                  fontSize: '2rem'
                }
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
        </div>

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
              className="relative"
            >
              <div
                className={`bg-[#800020] rounded-2xl p-2 text-center transform hover:scale-105 transition-all duration-300 border-4 ${
                  selectedCategories.includes(category.id)
                    ? 'border-[#00FF00]'
                    : 'border-[#F5DEB3]'
                } ${category.name === "عبدالمجيد عبدالله" ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => category.name !== "عبدالمجيد عبدالله" && handleCategorySelect(category.id)}
              >
                <div className="relative w-full aspect-square mb-2">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  />
                  {category.name === "عبدالمجيد عبدالله" && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Soon</span>
                    </div>
                  )}
                  {/* Info Icon */}
                  <div 
                    className="absolute top-2 right-2 w-6 h-6 bg-[#87CEEB] rounded-full flex items-center justify-center cursor-help hover:bg-[#87CEEB]/80 transition-colors"
                    onMouseEnter={() => setHoveredInfo(category.id)}
                    onMouseLeave={() => setHoveredInfo(null)}
                  >
                    <span className="text-white text-lg">!</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  {category.icon && (
                    <span className="text-2xl invisible">
                      {category.icon}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-[#F5DEB3] truncate text-center flex-1">{category.name}</h2>
                  <IconButton
                    onClick={(e) => toggleFavorite(category.id, e)}
                    className="text-[#F5DEB3] p-1"
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(245, 222, 179, 0.1)',
                      },
                    }}
                  >
                    <Badge 
                      badgeContent={categoryLikes[category.id] || 0} 
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#F5DEB3',
                          color: '#800020',
                        },
                      }}
                    >
                      {favoriteCategories.includes(category.id) ? (
                        <Favorite 
                          className="text-red-500" 
                          fontSize="small"
                          sx={{ transition: 'all 0.2s ease-in-out' }}
                        />
                      ) : (
                        <FavoriteBorder 
                          fontSize="small"
                          sx={{ 
                            color: '#F5DEB3',
                            transition: 'all 0.2s ease-in-out',
                          }}
                        />
                      )}
                    </Badge>
                  </IconButton>
                </div>
              </div>
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
                    <label className="block text-[#800020] mb-3 font-bold">اسم اللعبة</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم اللعبة"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      className="w-full p-4 border-2 border-[#800020] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#800020] bg-white/80 backdrop-blur-sm shadow-inner text-lg"
                      dir="rtl"
                    />
                    
                    <div className="mt-8">
                      <label className="block text-[#800020] mb-5 font-bold">اختر وسائل المساعدة (3 فقط)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['استشارة صديق', 'حذف إجابتين خاطئتين', 'تخطي السؤال', 'إضافة 30 ثانية'].map((helper) => (
                          <button
                            key={helper}
                            onClick={() => handleHelperToggle(helper)}
                            disabled={!helpers.includes(helper) && helpers.length >= 3}
                            className={`p-4 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                              helpers.includes(helper)
                                ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg'
                                : helpers.length >= 3
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-[#800020] border-2 border-[#800020] hover:bg-[#F5DEB3]/20'
                            }`}
                          >
                            {helper}
                          </button>
                        ))}
                      </div>
                      <p className="text-[#800020] text-sm mt-4 text-center">
                        تم اختيار {helpers.length} من 3 وسائل مساعدة
                      </p>
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
        <CategorySuggestionDialog
          open={isSuggestionDialogOpen}
          onClose={() => setIsSuggestionDialogOpen(false)}
        />
        <Snackbar 
          open={showSnackbar} 
          autoHideDuration={3000} 
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={() => setShowSnackbar(false)} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

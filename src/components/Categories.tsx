import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import categories from '../data/questions';
import { CategorySuggestionDialog } from './CategorySuggestionDialog';
import { AddCircleOutline, Favorite, FavoriteBorder, Star, StarBorder } from '@mui/icons-material';
import { IconButton, Tooltip, Badge, Snackbar, Alert } from '@mui/material';
import { supabase } from '../lib/supabase';

interface CategoriesProps {
  onGameSetup: (gameData: {
    categoryIds: number[];
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
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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

  const handleNext = () => {
    if (selectedCategories.length !== 6) {
      setError('يجب اختيار 6 فئات بالضبط');
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalNext = () => {
    if (!gameName.trim()) {
      setError('يرجى إدخال اسم اللعبة');
      return;
    }
    if (!team1Name.trim() || !team2Name.trim()) {
      setError('يرجى إدخال أسماء الفريقين');
      return;
    }
    handleSubmit();
  };

  const handleModalBack = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    onGameSetup({
      categoryIds: selectedCategories.map(id => parseInt(id)),
      gameName,
      team1Name,
      team2Name,
      helpers: [] // إزالة وسائل المساعدة
    });
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] p-4 relative overflow-hidden" dir="rtl">
      {/* التراث الكويتي - خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* زخارف إسلامية متحركة */}
        <motion.div
          className="absolute top-20 left-20 opacity-10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M60 0L70 50L120 60L70 70L60 120L50 70L0 60L50 50L60 0Z" fill="#F5DEB3"/>
          </svg>
        </motion.div>

        {/* زخارف دائرية */}
        <motion.div
          className="absolute bottom-20 right-20 opacity-10"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#F5DEB3" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="25" stroke="#F5DEB3" strokeWidth="1" fill="none"/>
            <circle cx="50" cy="50" r="10" fill="#F5DEB3"/>
          </svg>
        </motion.div>

        {/* زخارف نباتية */}
        <motion.div
          className="absolute top-1/2 left-1/3 opacity-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            <path d="M75 0C80 30 120 45 150 75C120 105 80 120 75 150C70 120 30 105 0 75C30 45 70 30 75 0Z" fill="#F5DEB3"/>
          </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* زر العودة المحسن */}
        <motion.button
          onClick={() => navigate('/')}
          className="absolute left-0 top-0 text-[#F5DEB3] hover:text-white transition-all duration-300 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="bg-[#800020]/30 backdrop-blur-md rounded-full p-3 border-2 border-[#F5DEB3]/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </motion.button>

        {/* العنوان المحسن */}
        <div className="categories-header text-center mb-12 pt-16">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-[#F5DEB3] mb-4 relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: "'Amiri', serif" }}
          >
            اختر 6 فئات للعب
            {/* زخارف تحت العنوان */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-30">
              <svg width="200" height="30" viewBox="0 0 200 30" fill="none">
                <path d="M10 15L40 10L70 15L100 10L130 15L160 10L190 15L190 25L160 20L130 25L100 20L70 25L40 20L10 25Z" fill="#F5DEB3"/>
              </svg>
            </div>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-[#F5DEB3]/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            اختر الفئات التي تريد اللعب بها وابدأ المغامرة
          </motion.p>

          {/* زر اقتراح فئة جديدة محسن */}
          <Tooltip title="اقتراح فئة جديدة" placement="left">
            <motion.div
              className="absolute top-8 right-8"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={() => setIsSuggestionDialogOpen(true)}
                sx={{
                  color: '#F5DEB3',
                  backgroundColor: 'rgba(245, 222, 179, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(245, 222, 179, 0.3)',
                  padding: '16px',
                  '&:hover': {
                    backgroundColor: 'rgba(245, 222, 179, 0.2)',
                    border: '2px solid rgba(245, 222, 179, 0.5)',
                    transform: 'scale(1.1)',
                    transition: 'all 0.3s ease-in-out'
                  },
                  '& svg': {
                    fontSize: '2.5rem'
                  }
                }}
              >
                <AddCircleOutline />
              </IconButton>
            </motion.div>
          </Tooltip>
        </div>

        {/* عداد الفئات المختارة المحسن */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-block bg-gradient-to-r from-[#800020]/40 to-[#A0455A]/40 backdrop-blur-md rounded-full px-8 py-4 border-2 border-[#F5DEB3]/30 shadow-2xl">
            <span className="text-2xl text-[#F5DEB3] font-bold">
              الفئات المختارة: {selectedCategories.length}/6
            </span>
            {/* شريط التقدم */}
            <div className="mt-3 w-48 h-2 bg-[#F5DEB3]/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#F5DEB3] to-[#E8D1A0] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(selectedCategories.length / 6) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* رسالة الخطأ المحسنة */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="text-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="inline-block bg-red-500/90 backdrop-blur-md rounded-xl px-6 py-3 border-2 border-red-300 shadow-lg">
                <span className="text-white font-semibold">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* شبكة الفئات المحسنة */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {categories.filter(category => category.id !== 46 && category.id !== 47 && category.id !== 48 && category.id !== 49 && category.id !== 50).map((category, index) => (
            <motion.div
              key={category.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className={`relative bg-gradient-to-br from-[#800020]/90 to-[#A0455A]/90 backdrop-blur-md rounded-2xl p-3 text-center transform transition-all duration-500 border-4 shadow-2xl ${
                  selectedCategories.includes(category.id.toString())
                    ? 'border-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.3)]'
                    : 'border-[#F5DEB3]/50 hover:border-[#F5DEB3]'
                } ${category.name === "عبدالمجيد عبدالله" || category.name === "محمد عبده" ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => (category.name !== "عبدالمجيد عبدالله" && category.name !== "محمد عبده") && handleCategorySelect(category.id.toString())}
                onMouseEnter={() => setHoveredCategory(category.id.toString())}
                onMouseLeave={() => setHoveredCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* تأثير التوهج عند الاختيار */}
                {selectedCategories.includes(category.id.toString()) && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00FF00]/20 to-transparent"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="relative w-full aspect-square mb-3">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
                  />
                  
                  {/* تأثير التدرج على الصورة */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />
                  
                  {(category.name === "عبدالمجيد عبدالله" || category.name === "محمد عبده") && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-white text-2xl font-bold block">Soon</span>
                        <span className="text-white/80 text-sm">قريباً</span>
                      </div>
                    </div>
                  )}
                  
                  {/* أيقونة المعلومات المحسنة */}
                  <motion.div 
                    className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-[#87CEEB] to-[#5F9EA0] rounded-full flex items-center justify-center cursor-help shadow-lg"
                    whileHover={{ scale: 1.2 }}
                    onMouseEnter={() => setHoveredInfo(category.id.toString())}
                    onMouseLeave={() => setHoveredInfo(null)}
                  >
                    <span className="text-white text-lg font-bold">!</span>
                  </motion.div>

                  {/* أيقونة المفضلة المحسنة */}
                  <motion.div
                    className="absolute top-2 left-2"
                    whileHover={{ scale: 1.2 }}
                  >
                    <IconButton
                      onClick={(e) => toggleFavorite(category.id.toString(), e)}
                      className="text-[#F5DEB3] p-1"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(245, 222, 179, 0.1)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          backgroundColor: 'rgba(245, 222, 179, 0.2)',
                        },
                      }}
                    >
                      <Badge 
                        badgeContent={categoryLikes[category.id.toString()] || 0} 
                        color="primary"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#F5DEB3',
                            color: '#800020',
                            fontWeight: 'bold',
                          },
                        }}
                      >
                        {favoriteCategories.includes(category.id.toString()) ? (
                          <Favorite 
                            className="text-red-500" 
                            fontSize="small"
                            sx={{ transition: 'all 0.3s ease-in-out' }}
                          />
                        ) : (
                          <FavoriteBorder 
                            fontSize="small"
                            sx={{ 
                              color: '#F5DEB3',
                              transition: 'all 0.3s ease-in-out',
                            }}
                          />
                        )}
                      </Badge>
                    </IconButton>
                  </motion.div>

                  {/* تأثير التحديد */}
                  {selectedCategories.includes(category.id.toString()) && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#00FF00] rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* اسم الفئة المحسن */}
                <div className="px-2">
                  <h2 className="text-lg font-bold text-[#F5DEB3] truncate text-center leading-tight">
                    {category.name}
                  </h2>
                  
                  {/* عدد الأسئلة */}
                  <p className="text-[#F5DEB3]/70 text-sm mt-1">
                    {category.questions?.length || 0} اسئلة
                  </p>
                </div>

                {/* تأثير التوهج عند التحويم */}
                {hoveredCategory === category.id.toString() && !selectedCategories.includes(category.id.toString()) && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F5DEB3]/10 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* قسم KBS مع فئتي الهند والمغرب */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {/* نص KBS مع تصميم جميل */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="relative inline-block">
              <motion.h1 
                className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F5DEB3] via-[#FFD700] to-[#F5DEB3] mb-4 relative"
                style={{ 
                  fontFamily: "'Arial Black', sans-serif",
                  textShadow: "0 0 30px rgba(245, 222, 179, 0.8)",
                  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.6))"
                }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                KBS
              </motion.h1>
              
              {/* تأثير التوهج الخلفي */}
              <motion.div
                className="absolute inset-0 text-5xl md:text-6xl font-black text-[#F5DEB3] opacity-20 blur-sm"
                style={{ fontFamily: "'Arial Black', sans-serif" }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                KBS
              </motion.div>
              
              {/* زخارف جانبية */}
              <motion.div
                className="absolute -left-6 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M15 0L18 9L27 12L18 15L15 24L12 15L3 12L12 9L15 0Z" fill="#F5DEB3" opacity="0.6"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute -right-6 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M15 0L18 9L27 12L18 15L15 24L12 15L3 12L12 9L15 0Z" fill="#F5DEB3" opacity="0.6"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* فئتي الهند والمغرب بنفس حجم الفئات السابقة */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {categories.filter(category => category.id === 46 || category.id === 47 || category.id === 48 || category.id === 49 || category.id === 50).map((category, index) => (
              <motion.div
                key={category.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className={`relative bg-gradient-to-br from-[#800020]/90 to-[#A0455A]/90 backdrop-blur-md rounded-2xl p-3 text-center transform transition-all duration-500 border-4 shadow-2xl ${
                    selectedCategories.includes(category.id.toString())
                      ? 'border-[#00FF00] shadow-[0_0_30px_rgba(0,255,0,0.3)]'
                      : 'border-[#F5DEB3]/50 hover:border-[#F5DEB3]'
                  } cursor-pointer`}
                  onClick={() => handleCategorySelect(category.id.toString())}
                  onMouseEnter={() => setHoveredCategory(category.id.toString())}
                  onMouseLeave={() => setHoveredCategory(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* تأثير التوهج عند الاختيار */}
                  {selectedCategories.includes(category.id.toString()) && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00FF00]/20 to-transparent"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <div className="relative w-full aspect-square mb-3">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
                    />
                    
                    {/* تأثير التدرج على الصورة */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-xl" />
                    
                    {/* أيقونة المعلومات المحسنة */}
                    <motion.div 
                      className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-[#87CEEB] to-[#5F9EA0] rounded-full flex items-center justify-center cursor-help shadow-lg"
                      whileHover={{ scale: 1.2 }}
                      onMouseEnter={() => setHoveredInfo(category.id.toString())}
                      onMouseLeave={() => setHoveredInfo(null)}
                    >
                      <span className="text-white text-lg font-bold">!</span>
                    </motion.div>

                    {/* أيقونة المفضلة المحسنة */}
                    <motion.div
                      className="absolute top-2 left-2"
                      whileHover={{ scale: 1.2 }}
                    >
                      <IconButton
                        onClick={(e) => toggleFavorite(category.id.toString(), e)}
                        className="text-[#F5DEB3] p-1"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(245, 222, 179, 0.1)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            backgroundColor: 'rgba(245, 222, 179, 0.2)',
                          },
                        }}
                      >
                        <Badge 
                          badgeContent={categoryLikes[category.id.toString()] || 0} 
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: '#F5DEB3',
                              color: '#800020',
                              fontWeight: 'bold',
                            },
                          }}
                        >
                          {favoriteCategories.includes(category.id.toString()) ? (
                            <Favorite 
                              className="text-red-500" 
                              fontSize="small"
                              sx={{ transition: 'all 0.3s ease-in-out' }}
                            />
                          ) : (
                            <FavoriteBorder 
                              fontSize="small"
                              sx={{ 
                                color: '#F5DEB3',
                                transition: 'all 0.3s ease-in-out',
                              }}
                            />
                          )}
                        </Badge>
                      </IconButton>
                    </motion.div>

                    {/* تأثير التحديد */}
                    {selectedCategories.includes(category.id.toString()) && (
                      <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#00FF00] rounded-full flex items-center justify-center shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  {/* اسم الفئة المحسن */}
                  <div className="px-2">
                    <h2 className="text-lg font-bold text-[#F5DEB3] truncate text-center leading-tight">
                      {category.name}
                    </h2>
                    
                    {/* عدد الأسئلة */}
                    <p className="text-[#F5DEB3]/70 text-sm mt-1">
                      {category.questions?.length || 0} اسئلة
                    </p>
                  </div>

                  {/* تأثير التوهج عند التحويم */}
                  {hoveredCategory === category.id.toString() && !selectedCategories.includes(category.id.toString()) && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F5DEB3]/10 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* عرض الفئات المختارة المحسن */}
        <motion.div 
          className="mb-12 bg-gradient-to-r from-[#800020]/30 to-[#A0455A]/30 backdrop-blur-md rounded-2xl p-6 border-2 border-[#F5DEB3]/30 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-[#F5DEB3] text-center">
            الفئات المختارة ({selectedCategories.length}/6)
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {selectedCategories.map((categoryId, index) => (
              <motion.div
                key={categoryId}
                className="bg-gradient-to-r from-[#800020] to-[#A0455A] text-[#F5DEB3] rounded-full px-6 py-3 flex items-center gap-3 shadow-lg border-2 border-[#F5DEB3]/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-semibold">
                  {categories.find(category => category.id.toString() === categoryId)?.name}
                </span>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(categoryId);
                  }}
                  className="w-6 h-6 rounded-full bg-[#F5DEB3] text-[#800020] flex items-center justify-center hover:bg-[#E8D1A0] transition-colors font-bold"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
            {selectedCategories.length === 0 && (
              <div className="text-[#F5DEB3]/60 italic text-center w-full py-8">
                لم يتم اختيار أي فئة بعد
              </div>
            )}
          </div>
        </motion.div>

        {/* زر إنشاء اللعبة المحسن */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            onClick={handleNext}
            disabled={selectedCategories.length !== 6}
            className={`relative bg-gradient-to-r from-[#F5DEB3] to-[#E8D1A0] text-[#800020] px-12 py-4 rounded-2xl text-2xl font-bold shadow-2xl border-2 border-[#800020]/30 transition-all duration-300 ${
              selectedCategories.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#E8D1A0] hover:to-[#F5DEB3] hover:shadow-[0_0_30px_rgba(245,222,179,0.5)]'
            }`}
            whileHover={selectedCategories.length === 6 ? { scale: 1.05 } : {}}
            whileTap={selectedCategories.length === 6 ? { scale: 0.95 } : {}}
          >
            إنشاء اللعبة
            {/* تأثير التوهج */}
            {selectedCategories.length === 6 && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#F5DEB3]/20 to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
          
          {selectedCategories.length !== 6 && (
            <motion.p 
              className="text-[#FF6B6B] text-lg mt-4 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {selectedCategories.length < 6 
                ? `يجب اختيار ${6 - selectedCategories.length} فئات إضافية` 
                : 'يجب اختيار 6 فئات بالضبط'}
            </motion.p>
          )}
        </motion.div>

        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] rounded-3xl p-8 max-w-lg w-full mx-4 relative shadow-2xl border-4 border-[#800020]/20"
            >
              {/* العنوان المحسن */}
              <motion.h2 
                className="text-3xl font-bold text-[#800020] mb-8 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                إعدادات اللعبة
              </motion.h2>

              <div className="space-y-6">
                {/* اسم اللعبة */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-[#800020] mb-3 font-bold text-lg">اسم اللعبة</label>
                  <input
                    type="text"
                    placeholder="أدخل اسم اللعبة"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    className="w-full p-4 border-3 border-[#800020] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#800020]/30 bg-white/90 backdrop-blur-sm shadow-inner text-lg transition-all duration-300"
                    dir="rtl"
                  />
                </motion.div>

                {/* أسماء الفرق */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div>
                    <label className="block text-[#800020] mb-3 font-bold text-lg">اسم الفريق الأول</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم الفريق الأول"
                      value={team1Name}
                      onChange={(e) => setTeam1Name(e.target.value)}
                      className="w-full p-4 border-3 border-[#800020] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#800020]/30 bg-white/90 backdrop-blur-sm shadow-inner text-lg transition-all duration-300"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-[#800020] mb-3 font-bold text-lg">اسم الفريق الثاني</label>
                    <input
                      type="text"
                      placeholder="أدخل اسم الفريق الثاني"
                      value={team2Name}
                      onChange={(e) => setTeam2Name(e.target.value)}
                      className="w-full p-4 border-3 border-[#800020] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#800020]/30 bg-white/90 backdrop-blur-sm shadow-inner text-lg transition-all duration-300"
                      dir="rtl"
                    />
                  </div>
                </motion.div>

                {/* عرض الفئات المختارة */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-[#800020]/20 to-[#A0455A]/20 rounded-xl p-4 border-2 border-[#800020]/30"
                >
                  <h3 className="text-lg font-bold text-[#800020] mb-3 text-center">الفئات المختارة</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {selectedCategories.map((categoryId, index) => (
                      <motion.span
                        key={categoryId}
                        className="bg-[#800020] text-[#F5DEB3] rounded-full px-3 py-1 text-sm font-semibold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        {categories.find(category => category.id.toString() === categoryId)?.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* رسالة الخطأ المحسنة */}
              <AnimatePresence>
                {error && (
                  <motion.p 
                    className="text-red-500 text-center mt-6 font-semibold bg-red-100 p-3 rounded-lg border-2 border-red-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* أزرار التنقل المحسنة */}
              <div className="flex justify-between mt-8">
                <motion.button
                  onClick={handleModalBack}
                  className="px-8 py-3 rounded-xl border-3 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white transition-all duration-300 font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  إلغاء
                </motion.button>
                <motion.button
                  onClick={handleModalNext}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#800020] to-[#600018] text-white hover:from-[#600018] hover:to-[#800020] transition-all duration-300 font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ابدأ اللعب
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
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
            sx={{ 
              width: '100%',
              backgroundColor: snackbarSeverity === 'success' ? '#4CAF50' : '#F44336',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};
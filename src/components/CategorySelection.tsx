import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, X } from 'lucide-react';
import { allCategories } from '../data';
import { Category } from '../types';

interface CategorySelectionProps {
  selectedCategories: number[];
  setSelectedCategories: (categories: number[]) => void;
  onStartGame: (gameName: string, team1Name: string, team2Name: string) => void;
}

export function CategorySelection({
  selectedCategories,
  setSelectedCategories,
  onStartGame,
}: CategorySelectionProps) {
  const [gameName, setGameName] = useState('');
  const [team1Name, setTeam1Name] = useState('الفريق الأول');
  const [team2Name, setTeam2Name] = useState('الفريق الثاني');

  const handleCategoryClick = (categoryId: number) => {
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

  const handleRandomSelection = () => {
    const availableCategories = allCategories
      .filter(cat => !selectedCategories.includes(cat.id))
      .map(cat => cat.id);
    
    const remainingSlots = 6 - selectedCategories.length;
    if (remainingSlots <= 0) return;

    const shuffled = availableCategories.sort(() => 0.5 - Math.random());
    const randomSelection = shuffled.slice(0, remainingSlots);
    
    setSelectedCategories(prev => [...prev, ...randomSelection]);
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const isCategorySelected = (category: Category) => 
    selectedCategories.includes(category.id);

  const isMaxCategoriesSelected = selectedCategories.length >= 6;

  return (
    <div className="min-h-screen bg-[#8B5CF6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-white text-lg hover:underline"
          >
            العودة الرئيسية
          </button>
          <h2 className="text-3xl font-bold text-white">اختر الفئات</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {allCategories.map(category => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`relative cursor-pointer transition-all transform hover:scale-105 ${
                !isCategorySelected(category) && isMaxCategoriesSelected
                  ? 'opacity-50'
                  : ''
              }`}
            >
              <div className={`relative rounded-2xl overflow-hidden shadow-lg ${
                isCategorySelected(category) ? 'ring-4 ring-[#8B5CF6] ring-opacity-80' : ''
              }`}>
                <div className="aspect-square bg-[#6B46C1]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`w-full h-full object-cover p-4 transition-all duration-200 ${
                      isCategorySelected(category) ? 'opacity-75' : ''
                    }`}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white py-3 px-4 text-center">
                  <h3 className="text-xl font-bold text-[#6B46C1]">{category.name}</h3>
                </div>
                {isCategorySelected(category) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#8B5CF6] bg-opacity-40 flex items-center justify-center backdrop-blur-[2px]"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white rounded-full p-3 shadow-lg"
                    >
                      <svg className="w-8 h-8 text-[#6B46C1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Game Setup Form */}
        {selectedCategories.length > 0 && (
          <div className="max-w-md mx-auto space-y-4 bg-[#6B46C1] p-6 rounded-2xl shadow-lg">
            <input
              type="text"
              placeholder="اسم اللعبة"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/90 border-0 focus:ring-2 focus:ring-white/50 transition-all text-[#6B46C1] placeholder-[#6B46C1]/70"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم الفريق الأول"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/90 border-0 focus:ring-2 focus:ring-white/50 transition-all text-[#6B46C1] placeholder-[#6B46C1]/70"
              />
              
              <input
                type="text"
                placeholder="اسم الفريق الثاني"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/90 border-0 focus:ring-2 focus:ring-white/50 transition-all text-[#6B46C1] placeholder-[#6B46C1]/70"
              />
            </div>
            
            <button
              onClick={() => onStartGame(gameName, team1Name, team2Name)}
              disabled={selectedCategories.length === 0 || !gameName || !team1Name || !team2Name}
              className="w-full p-3 rounded-xl bg-white text-[#6B46C1] font-bold hover:bg-white/90 disabled:bg-white/50 disabled:text-[#6B46C1]/50 disabled:cursor-not-allowed transition-colors"
            >
              ابدأ اللعبة
            </button>
          </div>
        )}

        {/* Selected Categories Count */}
        <div className="fixed bottom-4 right-4 bg-white text-[#6B46C1] px-4 py-2 rounded-full font-bold shadow-lg">
          {selectedCategories.length}/6 فئات مختارة
        </div>
      </div>
    </div>
  );
}
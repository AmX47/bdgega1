import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categories from '../data/questions';
import QuestionView from './QuestionView';
import { ResultView } from './ResultView';
import { Home, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

interface GameBoardProps {
  gameSetup: {
    categoryIds: number[];
    gameName: string;
    team1Name: string;
    team2Name: string;
    helpers: string[];
  };
}

interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  points: number;
  buttonIndex: number;
  image?: string;
  answerImage?: string;
  audio?: string;
  video?: string;
}

type HelpType = 'callFriend' | 'doublePoints' | 'firstLetter';

const GameBoard: React.FC<GameBoardProps> = ({ gameSetup }) => {
  const { categoryIds, gameName, team1Name, team2Name, helpers } = gameSetup;
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showQuestionView, setShowQuestionView] = useState(false);
  const [showResultView, setShowResultView] = useState(false);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [currentTeamTurn, setCurrentTeamTurn] = useState(1);
  const [team1Helps, setTeam1Helps] = useState({
    callFriend: true,
    doublePoints: true,
    firstLetter: true
  });
  const [team2Helps, setTeam2Helps] = useState({
    callFriend: true,
    doublePoints: true,
    firstLetter: true
  });
  const [activeHelpMethod, setActiveHelpMethod] = useState<HelpType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const navigate = useNavigate();

  const selectedCategories = categories.filter(cat => categoryIds.includes(cat.id));
  const totalQuestions = selectedCategories.reduce((total, cat) => total + cat.questions.length, 0);
  const isGameComplete = usedQuestions.size === totalQuestions;

  console.log('Selected Categories:', selectedCategories);
  console.log('Category IDs:', categoryIds);
  console.log('Total Categories:', categories.length);
  console.log('Selected Categories Length:', selectedCategories.length);
  console.log('Total Questions:', totalQuestions);

  if (selectedCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] flex items-center justify-center" dir="rtl">
        <div className="text-center text-[#F5DEB3]">
          <h1 className="text-4xl font-bold mb-4">خطأ في تحميل الفئات</h1>
          <p className="text-xl mb-6">لم يتم العثور على الفئات المحددة</p>
          <button
            onClick={() => navigate('/categories')}
            className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300"
          >
            العودة لاختيار الفئات
          </button>
        </div>
      </div>
    );
  }

  const checkGameCompletion = () => {
    if (usedQuestions.size === totalQuestions) {
      setShowResult(true);
    }
  };

  const handleQuestionClick = (categoryId: number, points: number, buttonIndex: number) => {
    const category = selectedCategories.find((c) => c.id === categoryId);
    if (!category) return;

    const question = category.questions.find(q => 
      q.points === points && 
      q.buttonIndex === buttonIndex
    );

    if (!question) return;

    const questionKey = `${categoryId}-${points}-${buttonIndex}`;
    if (usedQuestions.has(questionKey)) return;

    setSelectedQuestion({ 
      id: questionKey, 
      points, 
      buttonIndex, 
      text: (question as any).text || '', 
      correctAnswer: question.correctAnswer || '', 
      image: (question as any).image || '', 
      answerImage: (question as any).answerImage || '', 
      audio: (question as any).audio || '', 
      video: (question as any).video || '' 
    });
    setCurrentQuestion(question);
    setShowQuestionView(true);
  };

  const handleQuestionBack = () => {
    setShowQuestionView(false);
    setCurrentQuestion(null);
    setSelectedQuestion(null);
    setActiveHelpMethod(null);
  };

  const handleScorePoint = (teamId: number, isCorrect: boolean) => {
    const points = selectedQuestion?.points || 0;
    const multiplier = activeHelpMethod === 'doublePoints' ? 2 : 1;
    const finalPoints = isCorrect ? points * multiplier : 0;

    if (teamId === 1) {
      setTeam1Score(prev => prev + finalPoints);
    } else {
      setTeam2Score(prev => prev + finalPoints);
    }

    if (selectedQuestion) {
      const questionKey = `${selectedQuestion.id}`;
      const newUsedQuestions = new Set([...usedQuestions, questionKey]);
      setUsedQuestions(newUsedQuestions);

      if (newUsedQuestions.size === totalQuestions) {
        setShowResultView(true);
      }
    }

    setActiveHelpMethod(null);
    setShowQuestionView(false);
    setCurrentQuestion(null);
    setSelectedQuestion(null);
    setCurrentTeamTurn(currentTeamTurn === 1 ? 2 : 1);
  };

  const handleScoreAdjust = (teamId: number, amount: number) => {
    if (teamId === 1) {
      setTeam1Score(prev => Math.max(0, prev + amount));
    } else {
      setTeam2Score(prev => Math.max(0, prev + amount));
    }
  };

  const handleEndGameClick = () => {
    setShowEndGameConfirm(true);
  };

  const handleExitClick = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    navigate('/');
  };

  const handleEndGameConfirm = () => {
    setShowResultView(true);
    setShowEndGameConfirm(false);
    setUsedQuestions(new Set());
    setSelectedQuestion(null);
    setCurrentQuestion(null);
    setCurrentTeamTurn(1);
  };

  const handleUseHelp = (team: number, helpType: HelpType) => {
    if (team !== currentTeamTurn) {
      return;
    }

    const helpState = team === 1 ? team1Helps : team2Helps;
    if (!helpState[helpType]) {
      return;
    }

    if (team === 1) {
      setTeam1Helps({ ...team1Helps, [helpType]: false });
    } else {
      setTeam2Helps({ ...team2Helps, [helpType]: false });
    }

    setActiveHelpMethod(helpType);
  };

  const handleScoreChange = (teamNumber: number, change: number) => {
    if (teamNumber === 1) {
      const newScore = team1Score + change;
      if (newScore >= 0) {
        setTeam1Score(newScore);
      }
    } else {
      const newScore = team2Score + change;
      if (newScore >= 0) {
        setTeam2Score(newScore);
      }
    }
  };

  useEffect(() => {
    const updateGamesRemaining = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_games')
          .update({ games_remaining: 0 })
          .eq('user_id', user.id);

        if (error) {
          console.error('خطأ في تحديث عدد الألعاب:', error);
        }
      }
    };

    updateGamesRemaining();
  }, []);

  // منع إعادة تحميل الصفحة في صفحة اللعب
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'هل أنت متأكد من أنك تريد مغادرة اللعبة؟ سيتم فقدان التقدم الحالي.';
      return 'هل أنت متأكد من أنك تريد مغادرة اللعبة؟ سيتم فقدان التقدم الحالي.';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // منع F5 و Ctrl+R و Ctrl+Shift+R
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'R')) {
        e.preventDefault();
        alert('لا يمكن إعادة تحميل الصفحة أثناء اللعب. استخدم زر "خروج" للعودة للصفحة الرئيسية.');
        return false;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const helpMethodIcons = {
    callFriend: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    doublePoints: <span className="text-base font-medium">2x</span>,
    firstLetter: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <text x="8.5" y="16" className="text-[10px] font-bold" fill="currentColor">أ</text>
      </svg>
    ),
  };

  if (showResult) {
    return (
      <ResultView
        team1Name={team1Name}
        team2Name={team2Name}
        team1Score={team1Score}
        team2Score={team2Score}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  if (showResultView) {
    return (
      <ResultView
        team1Name={team1Name}
        team2Name={team2Name}
        team1Score={team1Score}
        team2Score={team2Score}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] relative overflow-hidden" dir="rtl">
      {/* Kuwaiti Traditional Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Kuwait Towers */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-10 left-10 w-32 h-32 opacity-10"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="80" r="15" fill="#F5DEB3" opacity="0.3"/>
            <circle cx="50" cy="50" r="12" fill="#F5DEB3" opacity="0.4"/>
            <circle cx="50" cy="25" r="8" fill="#F5DEB3" opacity="0.5"/>
            <rect x="48" y="80" width="4" height="20" fill="#F5DEB3" opacity="0.6"/>
          </svg>
        </motion.div>

        {/* Traditional Islamic Pattern */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 3, delay: 1 }}
          className="absolute bottom-20 right-20 w-40 h-40 opacity-5"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="#F5DEB3" strokeWidth="2"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#F5DEB3" strokeWidth="1"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="#F5DEB3" strokeWidth="1"/>
          </svg>
        </motion.div>

        {/* Traditional Ship */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.08, x: 0 }}
          transition={{ duration: 2.5, delay: 1.5 }}
          className="absolute top-1/2 left-20 w-24 h-24 opacity-8"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M20 80 L80 80 L70 60 L30 60 Z" fill="#F5DEB3" opacity="0.4"/>
            <rect x="45" y="40" width="10" height="20" fill="#F5DEB3" opacity="0.6"/>
            <path d="M50 40 L50 20" stroke="#F5DEB3" strokeWidth="2" opacity="0.7"/>
            <path d="M45 20 L55 20" stroke="#F5DEB3" strokeWidth="2" opacity="0.7"/>
          </svg>
        </motion.div>
      </div>

      {showQuestionView && currentQuestion ? (
        <div className="flex" dir="rtl">
          {/* Teams Info Sidebar */}
          <div className="w-[320px] fixed right-0 h-full flex flex-col justify-center gap-4 p-6 bg-[#800020]/20 backdrop-blur-md border-r-2 border-[#F5DEB3]/30">
            {/* Progress Bar */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 rounded-2xl p-6 shadow-2xl border border-[#F5DEB3]/20"
            >
              <div className="text-center text-[#F5DEB3]">
                <div className="text-2xl mb-4 font-bold drop-shadow-lg">تقدم اللعبة</div>
                <div className="w-full h-4 bg-[#F5DEB3]/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(usedQuestions.size / totalQuestions) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-[#F5DEB3] to-[#E8D1A0] rounded-full shadow-lg"
                  />
                </div>
                <div className="mt-3 text-lg font-semibold">
                  {usedQuestions.size} / {totalQuestions}
                </div>
              </div>
            </motion.div>

            {/* Teams Info */}
            <div className="bg-gradient-to-br from-[#800020]/60 to-[#A0455A]/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-[#F5DEB3]/20">
              <div className="flex flex-col gap-6">
                {/* Team 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`p-6 rounded-xl transition-all duration-500 ${
                    currentTeamTurn === 1 
                      ? 'bg-gradient-to-br from-[#800020] to-[#A0455A] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-2xl transform scale-105' 
                      : 'bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 text-[#F5DEB3] shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{team1Name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleScoreChange(1, -100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                      >
                        -
                      </button>
                      <div className="text-2xl font-bold min-w-[3ch] text-center">{team1Score}</div>
                      <button
                        onClick={() => handleScoreChange(1, 100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-3 justify-center">
                      {Object.entries(team1Helps).map(([help, isAvailable]) => (
                        <button
                          key={help}
                          onClick={() => handleUseHelp(1, help as HelpType)}
                          disabled={!isAvailable || currentTeamTurn !== 1}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all hover:scale-110 ${
                            isAvailable 
                              ? currentTeamTurn === 1
                                ? 'bg-[#A0455A] text-[#F5DEB3] hover:bg-opacity-90 cursor-pointer shadow-lg' 
                                : 'bg-[#A0455A]/50 text-[#F5DEB3]/50 cursor-not-allowed'
                              : 'bg-[#A0455A]/30 text-[#F5DEB3]/30 cursor-not-allowed'
                          }`}
                        >
                          {helpMethodIcons[help as keyof typeof helpMethodIcons]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Team 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={`p-6 rounded-xl transition-all duration-500 ${
                    currentTeamTurn === 2 
                      ? 'bg-gradient-to-br from-[#800020] to-[#A0455A] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-2xl transform scale-105' 
                      : 'bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 text-[#F5DEB3] shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{team2Name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleScoreChange(2, -100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                      >
                        -
                      </button>
                      <div className="text-2xl font-bold min-w-[3ch] text-center">{team2Score}</div>
                      <button
                        onClick={() => handleScoreChange(2, 100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex gap-3 justify-center">
                      {Object.entries(team2Helps).map(([help, isAvailable]) => (
                        <button
                          key={help}
                          onClick={() => handleUseHelp(2, help as HelpType)}
                          disabled={!isAvailable || currentTeamTurn !== 2}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all hover:scale-110 ${
                            isAvailable 
                              ? currentTeamTurn === 2
                                ? 'bg-[#A0455A] text-[#F5DEB3] hover:bg-opacity-90 cursor-pointer shadow-lg' 
                                : 'bg-[#A0455A]/50 text-[#F5DEB3]/50 cursor-not-allowed'
                              : 'bg-[#A0455A]/30 text-[#F5DEB3]/30 cursor-not-allowed'
                          }`}
                        >
                          {helpMethodIcons[help as keyof typeof helpMethodIcons]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 mr-[320px]">
            <QuestionView
              question={{
                id: parseInt(selectedQuestion?.id || '0'),
                text: selectedQuestion?.text || '',
                correctAnswer: selectedQuestion?.correctAnswer || '',
                points: selectedQuestion?.points || 0,
                buttonIndex: selectedQuestion?.buttonIndex || 0,
                image: selectedQuestion?.image || '',
                answerImage: selectedQuestion?.answerImage || '',
                audio: selectedQuestion?.audio || '',
                video: selectedQuestion?.video || ''
              }}
              categoryName={selectedCategories.find(cat => 
                cat.id === parseInt(selectedQuestion?.id?.split('-')[0] || '0')
              )?.name || ''}
              teams={[
                { id: 1, name: team1Name, score: team1Score },
                { id: 2, name: team2Name, score: team2Score }
              ]}
              onScorePoint={(teamId, isCorrect) => handleScorePoint(teamId, isCorrect)}
              onBack={handleQuestionBack}
              activeHelpMethod={activeHelpMethod}
              currentTeam={currentTeamTurn}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Game Header */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center p-6 bg-gradient-to-r from-[#800020]/90 to-[#A0455A]/90 text-[#F5DEB3] border-b-2 border-[#F5DEB3]/30 backdrop-blur-md shadow-2xl"
          >
            <button
              onClick={handleExitClick}
              className="flex items-center gap-3 px-6 py-3 bg-[#F5DEB3]/10 hover:bg-[#F5DEB3]/20 rounded-xl transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-105 hover:shadow-lg"
            >
              <span className="text-2xl">🚪</span>
              <span className="font-semibold">خروج</span>
            </button>

            <div className="flex items-center gap-6">
              <div className="text-4xl font-bold text-[#F5DEB3] drop-shadow-2xl">{gameName}</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileView(!isMobileView)}
                className="p-4 rounded-xl bg-[#F5DEB3]/20 text-[#F5DEB3] hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110 hover:shadow-lg"
              >
                {isMobileView ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={handleEndGameClick}
                className="flex items-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-300 border border-red-500/30 hover:scale-105 hover:shadow-lg"
              >
                <span className="text-2xl">🏁</span>
                <span className="font-semibold">إنهاء اللعبة</span>
              </button>
            </div>
          </motion.div>

          <div className="p-6">
            <div className="flex gap-8">
              {/* Right Side - Teams and Progress */}
              <div className="w-[320px] flex flex-col gap-6">
                {/* Progress Bar */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 rounded-2xl p-6 shadow-2xl border border-[#F5DEB3]/20"
                >
                  <div className="text-center text-[#F5DEB3]">
                    <div className="text-2xl mb-4 font-bold drop-shadow-lg">تقدم اللعبة</div>
                    <div className="w-full h-4 bg-[#F5DEB3]/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(usedQuestions.size / totalQuestions) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-[#F5DEB3] to-[#E8D1A0] rounded-full shadow-lg"
                      />
                    </div>
                    <div className="mt-3 text-lg font-semibold">
                      {usedQuestions.size} / {totalQuestions}
                    </div>
                  </div>
                </motion.div>

                {/* Teams Info */}
                <div className="bg-gradient-to-br from-[#800020]/60 to-[#A0455A]/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-[#F5DEB3]/20">
                  <div className="flex flex-col gap-6">
                    {/* Team 1 */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className={`p-6 rounded-xl transition-all duration-500 ${
                        currentTeamTurn === 1 
                          ? 'bg-gradient-to-br from-[#800020] to-[#A0455A] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-2xl transform scale-105' 
                          : 'bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 text-[#F5DEB3] shadow-xl'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{team1Name}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(1, -100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                          >
                            -
                          </button>
                          <div className="text-2xl font-bold min-w-[3ch] text-center">{team1Score}</div>
                          <button
                            onClick={() => handleScoreChange(1, 100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex gap-3 justify-center">
                          {Object.entries(team1Helps).map(([help, isAvailable]) => (
                            <button
                              key={help}
                              onClick={() => handleUseHelp(1, help as HelpType)}
                              disabled={!isAvailable || currentTeamTurn !== 1}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all hover:scale-110 ${
                                isAvailable 
                                  ? currentTeamTurn === 1
                                    ? 'bg-[#A0455A] text-[#F5DEB3] hover:bg-opacity-90 cursor-pointer shadow-lg' 
                                    : 'bg-[#A0455A]/50 text-[#F5DEB3]/50 cursor-not-allowed'
                                  : 'bg-[#A0455A]/30 text-[#F5DEB3]/30 cursor-not-allowed'
                              }`}
                            >
                              {helpMethodIcons[help as keyof typeof helpMethodIcons]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Team 2 */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className={`p-6 rounded-xl transition-all duration-500 ${
                        currentTeamTurn === 2 
                          ? 'bg-gradient-to-br from-[#800020] to-[#A0455A] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-2xl transform scale-105' 
                          : 'bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 text-[#F5DEB3] shadow-xl'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{team2Name}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(2, -100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                          >
                            -
                          </button>
                          <div className="text-2xl font-bold min-w-[3ch] text-center">{team2Score}</div>
                          <button
                            onClick={() => handleScoreChange(2, 100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30 hover:scale-110"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex gap-3 justify-center">
                          {Object.entries(team2Helps).map(([help, isAvailable]) => (
                            <button
                              key={help}
                              onClick={() => handleUseHelp(2, help as HelpType)}
                              disabled={!isAvailable || currentTeamTurn !== 2}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-all hover:scale-110 ${
                                isAvailable 
                                  ? currentTeamTurn === 2
                                    ? 'bg-[#A0455A] text-[#F5DEB3] hover:bg-opacity-90 cursor-pointer shadow-lg' 
                                    : 'bg-[#A0455A]/50 text-[#F5DEB3]/50 cursor-not-allowed'
                                  : 'bg-[#A0455A]/30 text-[#F5DEB3]/30 cursor-not-allowed'
                              }`}
                            >
                              {helpMethodIcons[help as keyof typeof helpMethodIcons]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Report Button */}
                <div className="mt-4 flex flex-col items-center gap-4">
                  <a 
                    href="https://www.instagram.com/bdgeegakw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-[#F5DEB3] hover:text-white transition-all duration-300 border-2 border-[#800020] hover:border-[#600018] px-6 py-3 rounded-xl hover:scale-105 hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span className="font-semibold">الإبلاغ عن مشكلة</span>
                  </a>

                  {/* Bdgeega Logo */}
                  <img 
                    src="https://i.postimg.cc/DfJ4XbW5/bdgeegalogo-removebg-preview.png"
                    alt="Bdgeega Logo"
                    className="h-32 w-auto opacity-70 hover:opacity-100 transition-opacity hover:scale-105"
                  />
                </div>
              </div>

              {/* Left Side - Categories Grid */}
              <div className="flex-1">
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="grid grid-cols-3 gap-6"
                >
                  {selectedCategories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl"
                    >
                      <div className="relative h-40">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <h3 className="absolute bottom-0 left-0 right-0 p-4 text-xl font-bold text-white text-center drop-shadow-lg">
                          {category.name}
                        </h3>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-[#800020]/20 to-[#A0455A]/20 backdrop-blur-sm border-t border-[#F5DEB3]/20">
                        <div className="grid grid-cols-2 gap-3">
                          {[300, 500, 700].map((points) => (
                            <React.Fragment key={points}>
                              {category.questions
                                .filter((q) => q.points === points)
                                .map((question) => {
                                  const questionKey = `${category.id}-${points}-${question.buttonIndex}`;
                                  const isUsed = usedQuestions.has(questionKey);
                                  return (
                                    <motion.button
                                      key={`${question.points}-${question.buttonIndex}`}
                                      whileHover={{ scale: isUsed ? 1 : 1.05 }}
                                      whileTap={{ scale: isUsed ? 1 : 0.95 }}
                                      onClick={() => handleQuestionClick(category.id, points, question.buttonIndex)}
                                      className={`w-full py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                        isUsed
                                          ? "bg-gray-400/50 text-gray-600 cursor-not-allowed"
                                          : "bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] text-[#800020] hover:from-[#E8D1A0] hover:to-[#F5DEB3] shadow-lg hover:shadow-xl"
                                      }`}
                                      disabled={isUsed}
                                    >
                                      {question.points}
                                    </motion.button>
                                  );
                                })}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Exit Confirmation Modal */}
          {showExitConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#800020] to-[#A0455A] rounded-2xl p-8 max-w-md w-full text-center border-2 border-[#F5DEB3]/30 shadow-2xl"
              >
                <div className="text-2xl font-bold text-[#F5DEB3] mb-6">هل أنت متأكد من الخروج من اللعبة؟</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleConfirmExit}
                    className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300 hover:scale-105"
                  >
                    نعم
                  </button>
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-8 py-3 rounded-xl hover:bg-[#F5DEB3]/10 transition-all duration-300 hover:scale-105"
                  >
                    لا
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* End Game Confirmation Modal */}
          {showEndGameConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#800020] to-[#A0455A] rounded-2xl p-8 max-w-md w-full text-center border-2 border-[#F5DEB3]/30 shadow-2xl"
              >
                <div className="text-6xl mb-6">🏁</div>
                <div className="text-2xl font-bold text-[#F5DEB3] mb-8">هل أنت متأكد من إنهاء اللعبة؟</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleEndGameConfirm}
                    className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    نعم، إنهاء اللعبة
                  </button>
                  <button
                    onClick={() => setShowEndGameConfirm(false)}
                    className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-8 py-3 rounded-xl hover:bg-[#F5DEB3]/10 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { GameBoard };
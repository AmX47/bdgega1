import React, { useState } from 'react';
import categories from '../data/questions';
import QuestionView from './QuestionView';
import { ResultView } from './ResultView';

interface GameBoardProps {
  categoryIds: number[];
  gameName: string;
  team1Name: string;
  team2Name: string;
  team1Players: number;
  team2Players: number;
  onHome: () => void;
}

interface Question {
  id: string;
  points: number;
  isAnswered: boolean;
  buttonIndex: number;
}

type HelpType = 'callFriend' | 'doublePoints' | 'twoAnswers';

export function GameBoard({
  categoryIds,
  gameName,
  team1Name,
  team2Name,
  team1Players,
  team2Players,
  onHome,
}: GameBoardProps) {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showQuestionView, setShowQuestionView] = useState(false);
  const [showResultView, setShowResultView] = useState(false);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [currentTeamTurn, setCurrentTeamTurn] = useState(1);
  const [team1Helps, setTeam1Helps] = useState({
    callFriend: true,
    doublePoints: true,
    twoAnswers: true
  });
  const [team2Helps, setTeam2Helps] = useState({
    callFriend: true,
    doublePoints: true,
    twoAnswers: true
  });
  const [activeHelpMethod, setActiveHelpMethod] = useState<HelpType | null>(null);

  const selectedCategories = categories.filter(cat => categoryIds.includes(cat.id));
  const totalQuestions = selectedCategories.reduce((total, cat) => total + cat.questions.length, 0);
  const isGameComplete = usedQuestions.size === totalQuestions;

  const handleQuestionClick = (categoryId: number, points: number, buttonIndex: number) => {
    const category = selectedCategories.find((c) => c.id === categoryId);
    if (category) {
      // Find questions matching the points and button index
      const availableQuestions = category.questions.filter(q => 
        q.points === points && 
        q.buttonIndex === buttonIndex &&
        !usedQuestions.has(`${categoryId}-${points}-${buttonIndex}`)
      );

      if (availableQuestions.length > 0) {
        const question = availableQuestions[0];
        setSelectedQuestion({ id: `${categoryId}-${points}-${buttonIndex}`, points, isAnswered: false, buttonIndex });
        setCurrentQuestion(question);
        setShowQuestionView(true);
        // Mark this question as used
        setUsedQuestions(prev => new Set([...prev, `${categoryId}-${points}-${buttonIndex}`]));
      }
    }
  };

  const handleScorePoint = (teamId: number) => {
    if (selectedQuestion) {
      if (teamId === 1) {
        setTeam1Score(prev => prev + selectedQuestion.points);
      } else {
        setTeam2Score(prev => prev + selectedQuestion.points);
      }
    }
    setCurrentTeamTurn(current => current === 1 ? 2 : 1);
    setShowQuestionView(false);
    setSelectedQuestion(null);
    setCurrentQuestion(null);

    // Check if game is complete after answering
    if (usedQuestions.size + 1 === totalQuestions) {
      setShowResultView(true);
    }
  };

  const handleQuestionBack = () => {
    if (selectedQuestion) {
      // Mark this question as used
      setUsedQuestions(prev => new Set([...prev, selectedQuestion.id]));
    }
    setCurrentTeamTurn(current => current === 1 ? 2 : 1);
    setShowQuestionView(false);
    setSelectedQuestion(null);
    setCurrentQuestion(null);

    // Check if game is complete after skipping
    if (usedQuestions.size + 1 === totalQuestions) {
      setShowResultView(true);
    }
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

  const handleEndGameConfirm = () => {
    // Reset game state
    setShowResultView(true);
    setShowEndGameConfirm(false);
    setUsedQuestions(new Set());
    setSelectedQuestion(null);
    setCurrentQuestion(null);
    setCurrentTeamTurn(1);
  };

  const handleUseHelp = (team: number, helpType: HelpType) => {
    // Only allow current team to use help methods
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

    // Pass the help type to QuestionView
    setActiveHelpMethod(helpType);
  };

  if (showResultView) {
    return (
      <ResultView
        team1Name={team1Name}
        team2Name={team2Name}
        team1Score={team1Score}
        team2Score={team2Score}
        onHome={onHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {showQuestionView && currentQuestion ? (
        <QuestionView
          question={{
            id: parseInt(selectedQuestion?.id || '0'),
            text: currentQuestion.text,
            image: currentQuestion.image,
            correctAnswer: currentQuestion.correctAnswer,
            points: selectedQuestion?.points || 0,
            buttonIndex: selectedQuestion?.buttonIndex || 0
          }}
          teams={[
            { id: 1, name: team1Name, score: team1Score },
            { id: 2, name: team2Name, score: team2Score }
          ]}
          onScorePoint={handleScorePoint}
          onBack={handleQuestionBack}
          activeHelpMethod={activeHelpMethod}
          currentTeam={currentTeamTurn}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-[#7A288A] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.postimg.cc/NfP1DWbv/bdgeega-removebg-preview.png" 
                alt="Bdgeega Logo" 
                className="h-12 cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => window.location.reload()}
              />
              <button 
                onClick={onHome} 
                className="bg-[#4A1458] hover:bg-[#3A1048] px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>خروج</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm2 0v14h10V3H5z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M11.293 7.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L12.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <h1 className="text-2xl font-bold">Bdgeega</h1>
            
            <button
              onClick={handleEndGameClick}
              className="bg-[#4A1458] hover:bg-[#3A1048] px-4 py-2 rounded-lg transition-colors"
            >
              إنهاء اللعبة
            </button>
          </div>

          {/* End Game Confirmation Modal */}
          {showEndGameConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                <h2 className="text-2xl font-bold text-[#7A288A] mb-4">تأكيد إنهاء اللعبة</h2>
                <p className="text-gray-600 mb-6">هل أنت متأكد من إنهاء اللعبة وعرض النتائج؟</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleEndGameConfirm}
                    className="bg-[#7A288A] text-white px-6 py-2 rounded-lg hover:bg-[#5A1868] transition-colors"
                  >
                    نعم
                  </button>
                  <button
                    onClick={() => setShowEndGameConfirm(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    لا
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Grid */}
          <div className="container mx-auto p-4 pb-24">
            <div className="grid grid-cols-6 gap-4">
              {selectedCategories.map(category => (
                <div key={category.id} className="text-center">
                  <div className="mb-4">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#7A288A]"
                    />
                    <h3 className="mt-2 font-bold text-lg text-[#7A288A]">{category.name}</h3>
                  </div>
                  
                  {[300, 500, 700].map((points, index) => {
                    // Create two buttons for each point value
                    return Array(2).fill(points).map((pointValue, buttonIndex) => {
                      const actualButtonIndex = index * 2 + buttonIndex;
                      const questionId = `${category.id}-${pointValue}-${actualButtonIndex}`;
                      const isUsed = usedQuestions.has(questionId);
                      
                      return (
                        <button
                          key={`${category.id}-${pointValue}-${actualButtonIndex}`}
                          onClick={() => handleQuestionClick(category.id, pointValue, actualButtonIndex)}
                          disabled={isUsed}
                          className={`w-full py-2 mb-2 rounded-lg text-lg font-bold transition-colors ${
                            isUsed
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-[#7A288A] text-white hover:bg-[#5A1868]'
                          }`}
                        >
                          {pointValue}
                        </button>
                      );
                    });
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Score Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#7A288A] text-white py-4">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center relative">
                {/* Team Turn Indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="bg-[#7A288A] rounded-t-lg px-8 py-3 shadow-lg text-center min-w-[200px]">
                    <p className="text-sm font-bold opacity-90">دور فريق</p>
                    <p className="text-xl font-bold">{currentTeamTurn === 1 ? team1Name : team2Name}</p>
                  </div>
                </div>

                {/* Vertical Line */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-[#4A1458]"></div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{team1Name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#5A1868] rounded-lg p-2 flex items-center justify-center space-x-4 rtl:space-x-reverse">
                      <button 
                        onClick={() => handleScoreAdjust(1, -100)}
                        className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                      >
                        -
                      </button>
                      <p className="text-2xl font-bold min-w-[80px]">{team1Score}</p>
                      <button 
                        onClick={() => handleScoreAdjust(1, 100)}
                        className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                    {/* Team 1 Help Methods */}
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-bold text-white">وسائل المساعدة</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUseHelp(1, 'callFriend')}
                          disabled={!team1Helps.callFriend}
                          className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                            team1Helps.callFriend 
                              ? 'bg-[#4A1458] hover:bg-[#3A1048] text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title="اتصال بصديق"
                        >
                          📞
                        </button>
                        <button
                          onClick={() => handleUseHelp(1, 'doublePoints')}
                          disabled={!team1Helps.doublePoints}
                          className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                            team1Helps.doublePoints 
                              ? 'bg-[#4A1458] hover:bg-[#3A1048] text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title="دبل نقاط"
                        >
                          ✨
                        </button>
                        <button
                          onClick={() => handleUseHelp(1, 'twoAnswers')}
                          disabled={!team1Helps.twoAnswers}
                          className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                            team1Helps.twoAnswers 
                              ? 'bg-[#4A1458] hover:bg-[#3A1048] text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title="جاوب جوابين"
                        >
                          🎯
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{team2Name}</h3>
                  <div className="flex items-center gap-2">
                    {/* Team 2 Help Methods */}
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-bold text-white">وسائل المساعدة</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUseHelp(2, 'callFriend')}
                          disabled={!team2Helps.callFriend}
                          className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                            team2Helps.callFriend 
                              ? 'bg-[#4A1458] hover:bg-[#3A1048] text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title="اتصال بصديق"
                        >
                          📞
                        </button>
                        <button
                          onClick={() => handleUseHelp(2, 'doublePoints')}
                          disabled={!team2Helps.doublePoints}
                          className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                            team2Helps.doublePoints 
                              ? 'bg-[#4A1458] hover:bg-[#3A1048] text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title="دبل نقاط"
                        >
                          ✨
                        </button>
                        <button
                          onClick={() => handleUseHelp(2, 'twoAnswers')}
                          disabled={!team2Helps.twoAnswers}
                          className={`w-10 h-10 rounded-lg transition-colors flex items-center justify-center ${
                            team2Helps.twoAnswers 
                              ? 'bg-[#4A1458] hover:bg-[#3A1048] text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          title="جاوب جوابين"
                        >
                          🎯
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#5A1868] rounded-lg p-2 flex items-center justify-center space-x-4 rtl:space-x-reverse">
                      <button 
                        onClick={() => handleScoreAdjust(2, -100)}
                        className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                      >
                        -
                      </button>
                      <p className="text-2xl font-bold min-w-[80px]">{team2Score}</p>
                      <button 
                        onClick={() => handleScoreAdjust(2, 100)}
                        className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
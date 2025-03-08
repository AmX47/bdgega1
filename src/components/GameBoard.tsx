import React, { useState } from 'react';
import categories from '../data/questions';
import QuestionView from './QuestionView';
import { ResultView } from './ResultView';

interface GameBoardProps {
  categoryIds: number[];
  gameName: string;
  team1Name: string;
  team2Name: string;
  helpers: string[];
  onHome: () => void;
}

interface Question {
  id: string;
  points: number;
  isAnswered: boolean;
  buttonIndex: number;
}

type HelpType = 'callFriend' | 'doublePoints' | 'twoAnswers';

const GameBoard: React.FC<GameBoardProps> = ({
  categoryIds,
  gameName,
  team1Name,
  team2Name,
  helpers,
  onHome,
}) => {
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
    const questionKey = `${categoryId}-${points}-${buttonIndex}`;
    
    // Check if question is already used
    if (usedQuestions.has(questionKey)) {
      return;
    }

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
        setSelectedQuestion({ id: `${categoryId}`, points, isAnswered: false, buttonIndex });
        setCurrentQuestion(question);
        setShowQuestionView(true);
      }
    }
  };

  const handleQuestionBack = () => {
    setShowQuestionView(false);
    setCurrentQuestion(null);
    setSelectedQuestion(null);
    setActiveHelpMethod(null);
  };

  const handleScorePoint = (teamId: number, isCorrect: boolean) => {
    if (!selectedQuestion) return;

    const points = selectedQuestion.points;
    const questionKey = `${selectedQuestion.id}-${points}-${selectedQuestion.buttonIndex}`;
    
    // Mark question as used
    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(questionKey);
    setUsedQuestions(newUsedQuestions);

    // Award points to team only if they answered correctly
    if (isCorrect) {
      if (teamId === 1) {
        setTeam1Score(prev => prev + points);
      } else if (teamId === 2) {
        setTeam2Score(prev => prev + points);
      }
    }

    // Reset question view
    setShowQuestionView(false);
    setCurrentQuestion(null);
    setSelectedQuestion(null);
    setActiveHelpMethod(null);
    
    // Switch turns
    setCurrentTeamTurn(currentTeamTurn === 1 ? 2 : 1);

    // Check if game is complete
    if (newUsedQuestions.size === totalQuestions) {
      setShowResultView(true);
    }
  };

  const handleNoAnswer = () => {
    if (!selectedQuestion) return;

    const questionKey = `${selectedQuestion.id}-${selectedQuestion.points}-${selectedQuestion.buttonIndex}`;
    
    // Mark question as used
    const newUsedQuestions = new Set(usedQuestions);
    newUsedQuestions.add(questionKey);
    setUsedQuestions(newUsedQuestions);

    // Reset question view
    setShowQuestionView(false);
    setCurrentQuestion(null);
    setSelectedQuestion(null);
    setActiveHelpMethod(null);
    
    // Switch turns
    setCurrentTeamTurn(currentTeamTurn === 1 ? 2 : 1);

    // Check if game is complete
    if (newUsedQuestions.size === totalQuestions) {
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

  const handleExitClick = () => {
    setShowExitConfirm(true);
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
    <div className="min-h-screen bg-gradient-to-br from-[#afafaf] via-[#afafaf] to-[#afafaf]" dir="rtl">
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
          onScorePoint={(teamId, isCorrect) => handleScorePoint(teamId, isCorrect)}
          onNoAnswer={handleNoAnswer}
          onBack={handleQuestionBack}
          activeHelpMethod={activeHelpMethod}
          currentTeam={currentTeamTurn}
        />
      ) : (
        <>
          {/* Top Bar */}
          <div className="bg-[#800020] shadow-lg py-4 px-6 mb-6">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleExitClick}
                className="flex items-center gap-2 border-2 border-[#F5DEB3] text-[#F5DEB3] px-4 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
              >
                <span>🚪</span>
                <span>خروج</span>
              </button>
              <h1 className="text-3xl font-bold text-[#F5DEB3] drop-shadow-lg">{gameName}</h1>
              <button 
                onClick={handleEndGameClick}
                className="flex items-center gap-2 border-2 border-[#F5DEB3] text-[#F5DEB3] px-4 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
              >
                <span>🏁</span>
                <span>إنهاء اللعبة</span>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-6">
              {/* Left Side - Teams and Progress */}
              <div className="w-[280px] flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="bg-[#800020] bg-opacity-50 rounded-lg p-4 shadow-lg">
                  <div className="text-center text-[#F5DEB3]">
                    <div className="text-xl mb-4 font-bold drop-shadow-lg">تقدم اللعبة</div>
                    <div className="w-full h-2 bg-[#F5DEB3] bg-opacity-20 rounded-full">
                      <div 
                        className="h-full bg-[#F5DEB3] rounded-full shadow-lg"
                        style={{ width: `${(Array.from(usedQuestions).length / (selectedCategories.length * 6)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 font-bold">{Array.from(usedQuestions).length} / {selectedCategories.length * 6}</div>
                  </div>
                </div>

                {/* Team 1 */}
                <div className={`${currentTeamTurn === 1 ? 'border-[#F5DEB3] shadow-[0_0_15px_#F5DEB3]' : 'border-[#F5DEB3] border-opacity-50'} border-4 rounded-lg p-4 text-[#F5DEB3] bg-[#800020] bg-opacity-50`}>
                  <h2 className="text-xl font-bold mb-3">{team1Name}</h2>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {Object.entries(team1Helps).map(([help, isAvailable]) => (
                        <button
                          key={help}
                          onClick={() => handleUseHelp(1, help as HelpType)}
                          disabled={!isAvailable || currentTeamTurn !== 1}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            isAvailable ? 'bg-[#F5DEB3] text-[#800020]' : 'bg-[#A0455A] text-[#F5DEB3]'
                          }`}
                        >
                          {help === 'callFriend' ? '📞' : help === 'doublePoints' ? '2x' : '2A'}
                        </button>
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-[#F5DEB3]">{team1Score}</div>
                  </div>
                </div>

                {/* Team 2 */}
                <div className={`${currentTeamTurn === 2 ? 'border-[#F5DEB3] shadow-[0_0_15px_#F5DEB3]' : 'border-[#F5DEB3] border-opacity-50'} border-4 rounded-lg p-4 text-[#F5DEB3] bg-[#800020] bg-opacity-50`}>
                  <h2 className="text-xl font-bold mb-3">{team2Name}</h2>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {Object.entries(team2Helps).map(([help, isAvailable]) => (
                        <button
                          key={help}
                          onClick={() => handleUseHelp(2, help as HelpType)}
                          disabled={!isAvailable || currentTeamTurn !== 2}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            isAvailable ? 'bg-[#F5DEB3] text-[#800020]' : 'bg-[#A0455A] text-[#F5DEB3]'
                          }`}
                        >
                          {help === 'callFriend' ? '📞' : help === 'doublePoints' ? '2x' : '2A'}
                        </button>
                      ))}
                    </div>
                    <div className="text-3xl font-bold text-[#F5DEB3]">{team2Score}</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Categories Grid */}
              <div className="flex-1">
                <div className="grid grid-rows-2 gap-6">
                  {/* Top Row - First 3 Categories */}
                  <div className="grid grid-cols-3 gap-6">
                    {selectedCategories.slice(0, 3).map(category => (
                      <div key={category.id} className="flex flex-col">
                        <div className="relative mb-3">
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-40 object-cover rounded-lg shadow-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-[#800020] bg-opacity-90 p-2 rounded-b-lg">
                            <h3 className="text-lg font-bold text-[#F5DEB3] text-center drop-shadow-lg">{category.name}</h3>
                          </div>
                        </div>
                        {/* Points Buttons */}
                        <div className="flex flex-col gap-2">
                          {/* 300 Points Row */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuestionClick(category.id, 300, 0)}
                              disabled={usedQuestions.has(`${category.id}-300-0`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-300-0`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              300
                            </button>
                            <button
                              onClick={() => handleQuestionClick(category.id, 300, 1)}
                              disabled={usedQuestions.has(`${category.id}-300-1`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-300-1`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              300
                            </button>
                          </div>
                          {/* 500 Points Row */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuestionClick(category.id, 500, 2)}
                              disabled={usedQuestions.has(`${category.id}-500-2`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-500-2`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              500
                            </button>
                            <button
                              onClick={() => handleQuestionClick(category.id, 500, 3)}
                              disabled={usedQuestions.has(`${category.id}-500-3`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-500-3`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              500
                            </button>
                          </div>
                          {/* 700 Points Row */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuestionClick(category.id, 700, 4)}
                              disabled={usedQuestions.has(`${category.id}-700-4`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-700-4`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              700
                            </button>
                            <button
                              onClick={() => handleQuestionClick(category.id, 700, 5)}
                              disabled={usedQuestions.has(`${category.id}-700-5`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-700-5`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              700
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row - Last 3 Categories */}
                  <div className="grid grid-cols-3 gap-6">
                    {selectedCategories.slice(3).map(category => (
                      <div key={category.id} className="flex flex-col">
                        <div className="relative mb-3">
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-40 object-cover rounded-lg shadow-lg"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-[#800020] bg-opacity-90 p-2 rounded-b-lg">
                            <h3 className="text-lg font-bold text-[#F5DEB3] text-center drop-shadow-lg">{category.name}</h3>
                          </div>
                        </div>
                        {/* Points Buttons */}
                        <div className="flex flex-col gap-2">
                          {/* 300 Points Row */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuestionClick(category.id, 300, 0)}
                              disabled={usedQuestions.has(`${category.id}-300-0`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-300-0`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              300
                            </button>
                            <button
                              onClick={() => handleQuestionClick(category.id, 300, 1)}
                              disabled={usedQuestions.has(`${category.id}-300-1`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-300-1`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              300
                            </button>
                          </div>
                          {/* 500 Points Row */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuestionClick(category.id, 500, 2)}
                              disabled={usedQuestions.has(`${category.id}-500-2`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-500-2`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              500
                            </button>
                            <button
                              onClick={() => handleQuestionClick(category.id, 500, 3)}
                              disabled={usedQuestions.has(`${category.id}-500-3`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-500-3`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              500
                            </button>
                          </div>
                          {/* 700 Points Row */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleQuestionClick(category.id, 700, 4)}
                              disabled={usedQuestions.has(`${category.id}-700-4`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-700-4`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              700
                            </button>
                            <button
                              onClick={() => handleQuestionClick(category.id, 700, 5)}
                              disabled={usedQuestions.has(`${category.id}-700-5`)}
                              className={`flex-1 h-12 rounded-lg text-lg font-bold transition-colors ${
                                usedQuestions.has(`${category.id}-700-5`)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#636363] text-[#ffffff] hover:bg-[#E8D1A0] hover:shadow-lg'
                              }`}
                            >
                              700
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exit Confirmation Modal */}
          {showExitConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-[#800020] rounded-lg p-6 max-w-md w-full text-center">
                <div className="text-xl font-bold text-[#F5DEB3] mb-6">هل أنت متأكد من الخروج من اللعبة؟</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={onHome}
                    className="bg-[#F5DEB3] text-[#800020] px-6 py-2 rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors"
                  >
                    نعم
                  </button>
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-6 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
                  >
                    لا
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* End Game Confirmation Modal */}
          {showEndGameConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-[#800020] rounded-lg p-6 max-w-md w-full text-center">
                <div className="text-xl font-bold text-[#F5DEB3] mb-6">هل أنت متأكد من إنهاء اللعبة؟</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleEndGameConfirm}
                    className="bg-[#F5DEB3] text-[#800020] px-6 py-2 rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors"
                  >
                    نعم
                  </button>
                  <button
                    onClick={() => setShowEndGameConfirm(false)}
                    className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-6 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
                  >
                    لا
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { GameBoard };
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
  const [showResult, setShowResult] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const selectedCategories = categories.filter(cat => categoryIds.includes(cat.id));
  const totalQuestions = selectedCategories.reduce((total, cat) => total + cat.questions.length, 0);
  const isGameComplete = usedQuestions.size === 36;

  const checkGameCompletion = () => {
    if (usedQuestions.size === 36) {
      setShowResult(true);
    }
  };

  const handleQuestionClick = (categoryId: string, points: number, buttonIndex: number) => {
    const category = selectedCategories.find((c) => c.id === categoryId);
    if (!category) return;

    const question = category.questions.find(q => 
      q.points === points && 
      q.buttonIndex === buttonIndex
    );

    if (!question) return;

    const questionKey = `${categoryId}-${points}-${buttonIndex}`;
    if (usedQuestions.has(questionKey)) return;

    setSelectedQuestion({ id: questionKey, points, buttonIndex });
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

      if (newUsedQuestions.size === 36) {
        setShowResultView(true);
      }
    }

    setActiveHelpMethod(undefined);
    setShowQuestionView(false);
    setCurrentQuestion(null);
    setSelectedQuestion(null);
    setCurrentTeamTurn(currentTeamTurn === 1 ? 2 : 1);
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
    if (newUsedQuestions.size === 36) {
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

  if (showResult) {
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
    <div className={`min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] p-4 ${
      isMobileView ? 'max-w-[390px] mx-auto' : ''
    }`} dir="rtl">
      {showQuestionView && currentQuestion ? (
        <div className="flex" dir="rtl">
          {/* Teams Info */}
          <div className="w-[320px] fixed right-0 h-full flex flex-col justify-center gap-4 p-6 bg-[#800020]/10 backdrop-blur-sm border-r-2 border-[#800020]/20">
            {/* Progress Bar */}
            <div className="bg-[#800020] bg-opacity-50 rounded-lg p-6 shadow-lg">
              <div className="text-center text-[#F5DEB3]">
                <div className="text-2xl mb-4 font-bold drop-shadow-lg">تقدم اللعبة</div>
                <div className="w-full h-3 bg-[#F5DEB3] bg-opacity-20 rounded-full">
                  <div
                    className="h-full bg-[#F5DEB3] rounded-full transition-all duration-500"
                    style={{
                      width: `${(usedQuestions.size / (selectedCategories.length * 6)) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-lg">
                  {usedQuestions.size} / {selectedCategories.length * 6}
                </div>
              </div>
            </div>

            {/* Teams Info */}
            <div className="bg-[#800020]/20 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="flex flex-col gap-6">
                {/* Team 1 */}
                <div className={`p-6 rounded-lg transition-all duration-300 ${
                  currentTeamTurn === 1 
                    ? 'bg-[#800020] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-lg transform scale-105' 
                    : 'bg-[#800020] text-[#F5DEB3]'
                }`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{team1Name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleScoreChange(1, -100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
                      >
                        -
                      </button>
                      <div className="text-2xl font-bold min-w-[3ch] text-center">{team1Score}</div>
                      <button
                        onClick={() => handleScoreChange(1, 100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
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
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                            isAvailable 
                              ? currentTeamTurn === 1
                                ? 'bg-[#800020] text-white hover:bg-[#600018] cursor-pointer' 
                                : 'bg-[#800020]/10 text-[#800020] cursor-not-allowed'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {help === 'callFriend' ? '📞' : help === 'doublePoints' ? '2x' : '2A'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Team 2 */}
                <div className={`p-6 rounded-lg transition-all duration-300 ${
                  currentTeamTurn === 2 
                    ? 'bg-[#800020] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-lg transform scale-105' 
                    : 'bg-[#800020] text-[#F5DEB3]'
                }`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{team2Name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleScoreChange(2, -100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
                      >
                        -
                      </button>
                      <div className="text-2xl font-bold min-w-[3ch] text-center">{team2Score}</div>
                      <button
                        onClick={() => handleScoreChange(2, 100)}
                        className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
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
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                            isAvailable 
                              ? currentTeamTurn === 2
                                ? 'bg-[#800020] text-white hover:bg-[#600018] cursor-pointer' 
                                : 'bg-[#800020]/10 text-[#800020] cursor-not-allowed'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {help === 'callFriend' ? '📞' : help === 'doublePoints' ? '2x' : '2A'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 mr-[320px]">
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
          </div>
        </div>
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileView(!isMobileView)}
                  className="p-3 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
                >
                  {isMobileView ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <button 
                  onClick={handleEndGameClick}
                  className="flex items-center gap-2 border-2 border-[#F5DEB3] text-[#F5DEB3] px-4 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
                >
                  <span>🏁</span>
                  <span>إنهاء اللعبة</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-6">
              {/* Right Side - Teams and Progress */}
              <div className="w-[320px] flex flex-col gap-4">
                {/* Progress Bar */}
                <div className="bg-[#800020] bg-opacity-50 rounded-lg p-6 shadow-lg">
                  <div className="text-center text-[#F5DEB3]">
                    <div className="text-2xl mb-4 font-bold drop-shadow-lg">تقدم اللعبة</div>
                    <div className="w-full h-3 bg-[#F5DEB3] bg-opacity-20 rounded-full">
                      <div 
                        className="h-full bg-[#F5DEB3] rounded-full transition-all duration-500"
                        style={{
                          width: `${(usedQuestions.size / (selectedCategories.length * 6)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-lg">
                      {usedQuestions.size} / {selectedCategories.length * 6}
                    </div>
                  </div>
                </div>

                {/* Teams Info */}
                <div className="bg-[#800020]/20 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                  <div className="flex flex-col gap-6">
                    {/* Team 1 */}
                    <div className={`p-6 rounded-lg transition-all duration-300 ${
                      currentTeamTurn === 1 
                        ? 'bg-[#800020] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-lg transform scale-105' 
                        : 'bg-[#800020] text-[#F5DEB3]'
                    }`}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{team1Name}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(1, -100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
                          >
                            -
                          </button>
                          <div className="text-2xl font-bold min-w-[3ch] text-center">{team1Score}</div>
                          <button
                            onClick={() => handleScoreChange(1, 100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
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
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                                isAvailable 
                                  ? currentTeamTurn === 1
                                    ? 'bg-[#800020] text-white hover:bg-[#600018] cursor-pointer' 
                                    : 'bg-[#800020]/10 text-[#800020] cursor-not-allowed'
                                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              }`}
                            >
                              {help === 'callFriend' ? '📞' : help === 'doublePoints' ? '2x' : '2A'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div className={`p-6 rounded-lg transition-all duration-300 ${
                      currentTeamTurn === 2 
                        ? 'bg-[#800020] text-[#F5DEB3] ring-4 ring-[#F5DEB3] ring-opacity-70 shadow-lg transform scale-105' 
                        : 'bg-[#800020] text-[#F5DEB3]'
                    }`}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">{team2Name}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleScoreChange(2, -100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
                          >
                            -
                          </button>
                          <div className="text-2xl font-bold min-w-[3ch] text-center">{team2Score}</div>
                          <button
                            onClick={() => handleScoreChange(2, 100)}
                            className="w-8 h-8 rounded-full bg-[#F5DEB3]/20 text-[#F5DEB3] flex items-center justify-center text-xl font-bold hover:bg-[#F5DEB3] hover:text-[#800020] transition-all duration-300 border border-[#F5DEB3]/30"
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
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 ${
                                isAvailable 
                                  ? currentTeamTurn === 2
                                    ? 'bg-[#800020] text-white hover:bg-[#600018] cursor-pointer' 
                                    : 'bg-[#800020]/10 text-[#800020] cursor-not-allowed'
                                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              }`}
                            >
                              {help === 'callFriend' ? '📞' : help === 'doublePoints' ? '2x' : '2A'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Side - Categories Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-6">
                  {selectedCategories.map((category) => (
                    <div
                      key={category.id}
                      className="rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-200"
                    >
                      <div className="relative h-48">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover rounded-t-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <h3 className="absolute bottom-0 left-0 right-0 p-4 text-2xl font-bold text-white text-center">
                          {category.name}
                        </h3>
                      </div>

                      <div className="p-4 bg-[#800020]/10 backdrop-blur-sm rounded-b-xl">
                        <div className="grid grid-cols-2 gap-2">
                          {[300, 500, 700].map((points) => (
                            <React.Fragment key={points}>
                              {category.questions
                                .filter((q) => q.points === points)
                                .map((question) => {
                                  const questionKey = `${category.id}-${points}-${question.buttonIndex}`;
                                  const isUsed = usedQuestions.has(questionKey);
                                  return (
                                    <button
                                      key={`${question.points}-${question.buttonIndex}`}
                                      onClick={() => handleQuestionClick(category.id, points, question.buttonIndex)}
                                      className={`w-full py-3 px-4 rounded-lg text-lg font-extrabold ${
                                        isUsed
                                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                          : "bg-[#F5DEB3] text-[#800020] hover:bg-[#E8D1A0] transition-all"
                                      }`}
                                      disabled={isUsed}
                                    >
                                      {question.points}
                                    </button>
                                  );
                                })}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
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
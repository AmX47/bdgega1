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
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [currentTeamTurn, setCurrentTeamTurn] = useState(1);

  const selectedCategories = categories.filter(cat => categoryIds.includes(cat.id));
  const totalQuestions = selectedCategories.reduce((total, cat) => total + cat.questions.length, 0);
  const isGameComplete = answeredQuestions.length === totalQuestions;

  const handleQuestionClick = (categoryId: number, points: number, buttonIndex: number) => {
    const category = selectedCategories.find((c) => c.id === categoryId);
    if (category) {
      // Find questions with matching points
      const availableQuestions = category.questions.filter(q => q.points === points);
      // Get a random question from available questions
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
      
      if (question) {
        setSelectedQuestion({ id: `${categoryId}-${points}-${buttonIndex}`, points, isAnswered: false, buttonIndex });
        setCurrentQuestion(question);
        setShowQuestionView(true);
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
      setAnsweredQuestions(prev => [...prev, selectedQuestion.id]);
    }
    setCurrentTeamTurn(current => current === 1 ? 2 : 1);
    setShowQuestionView(false);
    setSelectedQuestion(null);
    setCurrentQuestion(null);

    // Check if game is complete after answering
    if (answeredQuestions.length + 1 === totalQuestions) {
      setShowResultView(true);
    }
  };

  const handleQuestionBack = () => {
    if (selectedQuestion) {
      setAnsweredQuestions(prev => [...prev, selectedQuestion.id]);
    }
    setCurrentTeamTurn(current => current === 1 ? 2 : 1);
    setShowQuestionView(false);
    setSelectedQuestion(null);
    setCurrentQuestion(null);

    // Check if game is complete after skipping
    if (answeredQuestions.length + 1 === totalQuestions) {
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
    setAnsweredQuestions([]);
    setSelectedQuestion(null);
    setCurrentQuestion(null);
    setCurrentTeamTurn(1);
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
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-[#7A288A] text-white p-4 flex justify-between items-center">
            <button onClick={onHome} className="text-white hover:text-gray-200">
              ارجع الى صفحة الرئيسية
            </button>
            <h1 className="text-2xl font-bold">Bdgeega</h1>
            <button
              onClick={handleEndGameClick}
              className="bg-[#5A1868] hover:bg-[#4A1458] px-4 py-2 rounded-lg transition-colors"
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
                      const isAnswered = answeredQuestions.includes(questionId);
                      return (
                        <button
                          key={`${category.id}-${pointValue}-${actualButtonIndex}`}
                          onClick={() => handleQuestionClick(category.id, pointValue, actualButtonIndex)}
                          disabled={isAnswered}
                          className={`w-full py-2 mb-2 rounded-lg text-lg font-bold transition-colors ${
                            isAnswered
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
              <div className="flex justify-between items-center">
                {/* Team Turn Indicator */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="bg-[#7A288A] rounded-t-lg px-8 py-3 shadow-lg text-center min-w-[200px]">
                    <p className="text-sm font-bold opacity-90">دور فريق</p>
                    <p className="text-xl font-bold">{currentTeamTurn === 1 ? team1Name : team2Name}</p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{team1Name}</h3>
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
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{team2Name}</h3>
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
        </>
      )}
    </div>
  );
}
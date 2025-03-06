import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  points: number;
  image?: string;
  buttonIndex: number;
}

interface Team {
  id: number;
  name: string;
  score: number;
}

interface QuestionViewProps {
  question: Question;
  teams: Team[];
  onScorePoint: (teamId: number) => void;
  onBack: () => void;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  teams,
  onScorePoint,
  onBack,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-4 right-4 bg-[#7A288A] hover:bg-[#4A1458] text-white px-6 py-3 rounded-lg transition-colors"
      >
        العودة للوحة
      </button>

      {/* Timer - Centered at the top */}
      <div className="w-full flex justify-center mb-8">
        <div className="bg-[#7A288A] rounded-lg p-4 flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={toggleTimer}
            className="text-2xl text-white hover:text-gray-300 transition-colors"
          >
            {isTimerRunning ? '⏸' : '▶️'}
          </button>
          <span className="text-2xl font-mono text-white">{formatTime(timer)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {!showAnswer && !showTeamSelection && (
          <div className="bg-[#7A288A] rounded-2xl p-12 shadow-lg">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">السؤال ({question.points} نقطة)</h2>
            <div className="bg-[#5A1868] rounded-lg p-8 mb-8">
              <p className="text-2xl text-white text-center">{question.text}</p>
            </div>
            {question.image && (
              <div className="mt-8 flex justify-center">
                <img
                  src={question.image}
                  alt="Question"
                  className="max-w-full max-h-[400px] rounded-lg"
                />
              </div>
            )}
            <div className="mt-12 text-center">
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-white text-[#7A288A] text-2xl px-12 py-6 rounded-lg transition-colors hover:bg-gray-100"
              >
                إظهار الإجابة
              </button>
            </div>
          </div>
        )}

        {showAnswer && !showTeamSelection && (
          <div className="bg-[#7A288A] rounded-2xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold mb-8 text-white text-center">الإجابة</h3>
            <div className="bg-[#5A1868] rounded-lg p-6 mb-8">
              <p className="text-2xl text-white text-center font-bold">{question.correctAnswer}</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowTeamSelection(true)}
                className="bg-white text-[#7A288A] text-2xl px-12 py-6 rounded-lg transition-colors hover:bg-gray-100"
              >
                منو جاوب؟
              </button>
            </div>
          </div>
        )}

        {showTeamSelection && (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-[#7A288A] text-center mb-12">اختر الفريق الفائز</h3>
            <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => onScorePoint(team.id)}
                  className="bg-[#7A288A] hover:bg-[#4A1458] text-white text-2xl px-8 py-6 rounded-lg transition-colors w-full"
                >
                  {team.name}
                </button>
              ))}
              <button
                onClick={onBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-2xl px-8 py-6 rounded-lg transition-colors w-full"
              >
                محد جاوب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionView;

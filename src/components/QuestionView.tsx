import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  points: number;
  image?: string;
  audio?: string;
  buttonIndex: number;
}

interface Team {
  id: number;
  name: string;
}

interface QuestionViewProps {
  question: Question;
  teams: Team[];
  onScorePoint: (teamId: number) => void;
  onBack: () => void;
  activeHelpMethod: 'callFriend' | 'doublePoints' | 'twoAnswers' | null;
  currentTeam: number;
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  teams,
  onScorePoint,
  onBack,
  activeHelpMethod,
  currentTeam,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const helpMethodDescriptions = {
    callFriend: "اتصل بصديق: يمكنك الاتصال بصديق للمساعدة في الإجابة",
    doublePoints: "دبل نقاط: ستحصل على ضعف النقاط إذا كانت إجابتك صحيحة",
    twoAnswers: "جاوب جوابين: لديك فرصتان للإجابة على هذا السؤال"
  };

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

  const handleNoAnswer = () => {
    onBack();
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
            {question.audio && (
              <div className="my-4">
                <AudioPlayer src={question.audio} />
              </div>
            )}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-[#5A1868] hover:bg-[#4A1458] text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
              >
                اظهر الإجابة
              </button>
            </div>
            
            {/* Help Method Description */}
            {activeHelpMethod && (
              <div className="mt-6">
                <div className="border-2 border-[#5A1868] rounded-lg p-4 text-center">
                  <p className="text-white text-lg">
                    {helpMethodDescriptions[activeHelpMethod]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {showAnswer && !showTeamSelection && (
          <div className="bg-[#7A288A] rounded-2xl p-12 shadow-lg">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">الإجابة</h2>
            <div className="bg-[#5A1868] rounded-lg p-8 mb-8">
              <p className="text-2xl text-white text-center">{question.correctAnswer}</p>
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowTeamSelection(true)}
                className="bg-[#5A1868] hover:bg-[#4A1458] text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
              >
                التالي
              </button>
            </div>
          </div>
        )}

        {showTeamSelection && (
          <div className="bg-[#7A288A] rounded-2xl p-12 shadow-lg">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">اختر الفريق</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => onScorePoint(team.id)}
                  className="bg-[#5A1868] hover:bg-[#4A1458] text-white p-8 rounded-lg text-2xl font-semibold transition-colors"
                >
                  {team.name}
                </button>
              ))}
            </div>
            {/* No Answer Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleNoAnswer}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-colors"
              >
                محد جاوب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionView;

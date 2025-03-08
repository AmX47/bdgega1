import React, { useState, useEffect, useRef } from 'react';

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  points: number;
  buttonIndex: number;
  image?: string;
  answerImage?: string;
  audio?: string;
}

interface Team {
  id: number;
  name: string;
  score: number;
}

interface QuestionViewProps {
  question: Question;
  teams: Team[];
  onScorePoint: (teamId: number, isCorrect: boolean) => void;
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
  const [showConfirmBack, setShowConfirmBack] = useState(false);
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timer]);

  useEffect(() => {
    if (audioRef.current && question.audio) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Auto-play failed:', error);
      });
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [question.audio]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleBack = () => {
    setShowConfirmBack(true);
  };

  const confirmBack = () => {
    onBack();
  };

  const handleShowTeamSelection = () => {
    setShowTeamSelection(true);
  };

  const handleNoAnswer = () => {
    onScorePoint(0, false);
  };

  const helpMethodDescriptions = {
    callFriend: "اتصل بصديق: يمكنك الاتصال بصديق للمساعدة في الإجابة",
    doublePoints: "دبل نقاط: ستحصل على ضعف النقاط إذا كانت إجابتك صحيحة",
    twoAnswers: "جاوب جوابين: لديك فرصتان للإجابة على هذا السؤال"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] flex items-center justify-center p-4" dir="rtl">
      {/* Timer */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#800020] px-6 py-2 rounded-lg shadow-lg flex items-center gap-3">
        <span className="text-2xl font-bold text-[#F5DEB3]">{formatTime(timer)}</span>
        <button
          onClick={toggleTimer}
          className="text-[#F5DEB3] text-xl hover:text-[#E8D1A0] transition-colors"
        >
          {isTimerRunning ? '⏸' : '▶'}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full">
        {/* Question/Answer Box */}
        <div className="bg-[#800020] rounded-lg p-8 mb-6 text-center">
          {!showAnswer ? (
            <>
              <div className="text-2xl font-bold text-[#F5DEB3] mb-4">
                السؤال ({question.points} نقطة)
              </div>
              <div className="text-4xl font-extrabold text-[#F5DEB3] mb-6 text-center tracking-wide">
                {question.text}
              </div>
              {question.image && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={question.image} 
                    alt="Question" 
                    className="max-w-full max-h-[300px] object-contain rounded-lg"
                  />
                </div>
              )}
              {question.audio && (
                <div className="mb-6 bg-[#A0455A] p-4 rounded-lg shadow-lg">
                  <audio 
                    ref={audioRef} 
                    src={question.audio}
                    onEnded={() => setIsPlaying(false)}
                    preload="auto"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-4 w-full">
                      <button
                        onClick={handlePlayPause}
                        className="w-14 h-14 bg-[#F5DEB3] rounded-full flex items-center justify-center text-[#800020] text-2xl font-bold hover:bg-[#E8D1A0] transition-colors shadow-lg"
                      >
                        {isPlaying ? "⏸" : "▶"}
                      </button>
                    </div>
                    <div className="w-full flex items-center gap-2">
                      <span className="text-sm text-[#F5DEB3] font-bold">{formatTime(currentTime)}</span>
                      <div className="flex-1 h-2 bg-[#F5DEB3] bg-opacity-20 rounded-full relative">
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                          className="h-full bg-[#F5DEB3] rounded-full"
                          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-[#F5DEB3] font-bold">{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowAnswer(true)}
                className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-lg text-xl font-bold hover:bg-[#E8D1A0] transition-colors"
              >
                اظهر الإجابة
              </button>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-[#F5DEB3] mb-4">الإجابة الصحيحة</div>
              <div className="text-4xl font-extrabold text-[#F5DEB3] mb-6 text-center tracking-wide">{question.correctAnswer}</div>
              {question.answerImage && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={question.answerImage} 
                    alt="Answer" 
                    className="max-w-full max-h-[300px] object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
              {!showTeamSelection ? (
                <button
                  onClick={handleShowTeamSelection}
                  className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-lg text-xl font-bold hover:bg-[#E8D1A0] transition-colors"
                >
                  منو جاوب؟
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => onScorePoint(team.id, true)}
                        className="bg-[#F5DEB3] text-[#800020] p-4 rounded-lg text-xl font-bold hover:bg-[#E8D1A0] transition-colors"
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNoAnswer}
                    className="bg-[#A0455A] text-[#F5DEB3] px-8 py-3 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-colors w-full"
                  >
                    محد جاوب
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-6 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
          >
            رجوع
          </button>
        </div>

        {/* Back Confirmation Modal */}
        {showConfirmBack && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#800020] rounded-lg p-6 max-w-md w-full text-center">
              <div className="text-xl font-bold text-[#F5DEB3] mb-6">هل أنت متأكد من الرجوع؟</div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={onBack}
                  className="bg-[#F5DEB3] text-[#800020] px-6 py-2 rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors"
                >
                  نعم
                </button>
                <button
                  onClick={() => setShowConfirmBack(false)}
                  className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-6 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
                >
                  لا
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionView;
import React, { useState, useEffect, useRef } from 'react';
import { ReportDialog } from './ReportDialog';

interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  points: number;
  buttonIndex: number;
  image?: string;
  answerImage?: string;
  audio?: string;
  video?: string;
}

interface Team {
  id: number;
  name: string;
  score: number;
}

interface QuestionViewProps {
  question: Question;
  teams: Team[];
  onScorePoint: (teamId: number, isCorrect: boolean, doublePoints?: boolean) => void;
  onBack: () => void;
  activeHelpMethod: 'callFriend' | 'doublePoints' | 'firstLetter' | null;
  currentTeam: number;
}

interface CallFriendDialogProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

const CallFriendDialog: React.FC<CallFriendDialogProps> = ({ open, onClose, onStart }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#800020] rounded-lg p-6 max-w-md w-full text-center">
        <div className="text-xl font-bold text-[#F5DEB3] mb-6">عندك 30 ثانية تدق على شخص جاهزززززز ؟</div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              onStart();
              onClose();
            }}
            className="bg-[#F5DEB3] text-[#800020] px-6 py-2 rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors"
          >
            اي
          </button>
          <button
            onClick={onClose}
            className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-6 py-2 rounded-lg hover:bg-[#F5DEB3] hover:text-[#800020] transition-colors"
          >
            لا
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [showCallFriendDialog, setShowCallFriendDialog] = useState(false);
  const [callFriendTimer, setCallFriendTimer] = useState(30);
  const [isCallFriendActive, setIsCallFriendActive] = useState(false);
  const [callFriendMessage, setCallFriendMessage] = useState<string>("");
  const [isCallFriendTimerStarted, setIsCallFriendTimerStarted] = useState(false);
  const [showFirstLetter, setShowFirstLetter] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

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
    let timerInterval: NodeJS.Timeout;
    let closeTimeout: NodeJS.Timeout;

    if (isCallFriendActive && isCallFriendTimerStarted) {
      timerInterval = setInterval(() => {
        setCallFriendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setCallFriendMessage("خلص الوقت !");
            closeTimeout = setTimeout(() => {
              setShowCallFriendDialog(false);
              setIsCallFriendActive(false);
            }, 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
      clearTimeout(closeTimeout);
    };
  }, [isCallFriendActive, isCallFriendTimerStarted]);

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

  useEffect(() => {
    if (videoRef.current && question.video) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Auto-play failed:', error);
      });
      
      return () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [question.video]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    } else if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    } else if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
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
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
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

  const startCallFriend = () => {
    setIsCallFriendActive(true);
    setShowCallFriendMessage(false);
  };

  const helpMethodDescriptions = {
    callFriend: "اتصل بصديق: يمكنك الاتصال بصديق للمساعدة في الإجابة",
    doublePoints: "دبل نقاط: ستحصل على ضعف النقاط إذا كانت إجابتك صحيحة",
    firstLetter: "الحرف الأول: سيظهر لك الحرف الأول من الإجابة"
  };

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

  const helpMethodLabels = {
    callFriend: "اتصل بصديق",
    doublePoints: "دبل النقاط",
    firstLetter: "الحرف الأول"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800020] via-[#A0455A] to-[#F5DEB3] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-4xl w-full relative">
        {/* Timer */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* Play/Pause Button */}
            <button
              onClick={toggleTimer}
              className="absolute -top-9 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#F5DEB3] hover:bg-[#E8D1A0] flex items-center justify-center shadow-lg transition-all duration-300 border border-[#800020] group"
            >
              {isTimerRunning ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#800020] group-hover:text-[#600018]">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#800020] group-hover:text-[#600018]">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Timer Circle */}
            <div className={`w-24 h-24 rounded-t-full flex items-center justify-center ${
              timer <= 10 ? 'bg-red-600' : timer <= 30 ? 'bg-yellow-600' : 'bg-[#800020]'
            } border-t-4 border-x-4 border-b-0 border-[#F5DEB3] shadow-lg transform transition-all duration-300 ${
              timer <= 10 ? 'scale-110' : ''
            }`}>
              <div className="text-[#F5DEB3] text-3xl font-bold">{formatTime(timer)}</div>
            </div>
          </div>
        </div>

        {/* Question/Answer Box */}
        <div className="min-h-[300px] bg-[#800020] rounded-xl rounded-t-none p-8 text-center relative">
          {/* Points and Question Title */}
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-[#F5DEB3] mb-2">
              السؤال ({question.points} نقطة)
            </div>
          </div>

          {/* Help Method Button */}
          {activeHelpMethod && (
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  if (activeHelpMethod === 'callFriend') {
                    setShowCallFriendDialog(true);
                  } else if (activeHelpMethod === 'firstLetter') {
                    setShowFirstLetter(true);
                  }
                }}
                disabled={activeHelpMethod === 'doublePoints'}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeHelpMethod === 'doublePoints'
                    ? 'bg-[#A0455A]/50 cursor-not-allowed'
                    : 'bg-[#A0455A] hover:bg-opacity-90 cursor-pointer'
                } text-[#F5DEB3] border border-[#F5DEB3]/20 shadow-lg`}
              >
                {helpMethodIcons[activeHelpMethod]}
                <span className="text-lg font-medium">{helpMethodLabels[activeHelpMethod]}</span>
              </button>
            </div>
          )}

          {!showAnswer ? (
            <>
              <div className="text-4xl font-extrabold text-[#F5DEB3] mb-6 text-center tracking-wide">
                {question.text}
              </div>
              {question.video && (
                <div className="mb-6 relative">
                  <video
                    ref={videoRef}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                    controls
                    autoPlay
                    playsInline
                  >
                    <source src={question.video} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                </div>
              )}
              {question.image && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={question.image} 
                    alt="Question" 
                    className={`rounded-lg cursor-pointer transition-transform duration-300 ${
                      !isImageEnlarged ? 'max-w-full max-h-[300px] object-contain hover:scale-105' : ''
                    }`}
                    onClick={() => setIsImageEnlarged(true)}
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
                        {isPlaying ? "||" : "▶︎"}
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
                شنو الإجابة ؟
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

        {/* Back and Report Buttons */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <button 
            onClick={() => setShowReportDialog(true)}
            className="inline-flex items-center gap-2 text-[#F5DEB3] hover:text-white transition-colors border border-[#800020] hover:border-[#600018] px-4 py-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>الإبلاغ عن مشكلة</span>
          </button>
          
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-[#F5DEB3] hover:text-white transition-colors border border-[#800020] hover:border-[#600018] px-4 py-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            رجوع
          </button>
        </div>

        <ReportDialog
          open={showReportDialog}
          onClose={() => setShowReportDialog(false)}
          currentPage="صفحة السؤال"
        />

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

        {/* نافذة الصورة المكبرة */}
        {isImageEnlarged && question.image && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setIsImageEnlarged(false)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <button
                className="absolute -top-4 -right-4 bg-white rounded-full p-1 hover:bg-gray-200 transition-colors"
                onClick={() => setIsImageEnlarged(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={question.image}
                alt="صورة السؤال"
                className="rounded-lg max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Call Friend Dialog */}
        {showCallFriendDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#800020] rounded-lg p-6 max-w-md w-full text-center">
              {!isCallFriendTimerStarted ? (
                <>
                  <div className="text-xl font-bold text-[#F5DEB3] mb-6">
                    عندك 30 ثانية
                    <div className="text-sm mt-2 text-[#F5DEB3]/80">
                      وقت الي يعرف كل شي 😉
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsCallFriendTimerStarted(true);
                      setIsCallFriendActive(true);
                      setCallFriendMessage("");
                    }}
                    className="bg-[#F5DEB3] text-[#800020] px-6 py-2 rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors"
                  >
                    يلا
                  </button>
                </>
              ) : (
                <div className="text-xl font-bold text-[#F5DEB3] mb-6">
                  {callFriendMessage || (
                    <>
                      الوقت المتبقي
                      <div className="text-6xl mt-4 font-bold tabular-nums">
                        {callFriendTimer}
                      </div>
                      <div className="text-sm mt-2 text-[#F5DEB3]/80">
                        ثانية
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* First Letter Dialog */}
        {showFirstLetter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#800020] rounded-lg p-6 max-w-md w-full text-center">
              <div className="text-xl font-bold text-[#F5DEB3] mb-6">
                الحرف الأول من الإجابة هو:
                <div className="text-4xl mt-4 font-bold flex items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#A0455A] flex items-center justify-center border-2 border-[#F5DEB3]">
                    <span className="text-[#F5DEB3]">{question.correctAnswer.charAt(0)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowFirstLetter(false)}
                className="bg-[#F5DEB3] text-[#800020] px-6 py-2 rounded-lg font-bold hover:bg-[#E8D1A0] transition-colors"
              >
                تمام
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionView;
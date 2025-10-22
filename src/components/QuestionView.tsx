import React, { useState, useEffect, useRef } from 'react';
import { ReportDialog } from './ReportDialog';
import { motion, AnimatePresence } from 'framer-motion';

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
  categoryName: string;
}

interface CallFriendDialogProps {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

const CallFriendDialog: React.FC<CallFriendDialogProps> = ({ open, onClose, onStart }) => {
  if (!open) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-[#800020] to-[#A0455A] rounded-2xl p-8 max-w-md w-full text-center border-2 border-[#F5DEB3]/30 shadow-2xl"
      >
        <div className="text-2xl font-bold text-[#F5DEB3] mb-6">عندك 30 ثانية تدق على شخص جاهز؟</div>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onStart();
              onClose();
            }}
            className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300 shadow-lg"
          >
            اي
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-8 py-3 rounded-xl hover:bg-[#F5DEB3]/10 transition-all duration-300"
          >
            لا
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  teams,
  onScorePoint,
  onBack,
  activeHelpMethod,
  currentTeam,
  categoryName,
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
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAnswerImageModal, setShowAnswerImageModal] = useState(false);

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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    setShowCallFriendDialog(true);
  };

  const helpMethodIcons = {
    callFriend: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    doublePoints: <span className="text-xl font-bold">2x</span>,
    firstLetter: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const helpMethodLabels = {
    callFriend: 'اتصل بصديق',
    doublePoints: 'مضاعفة النقاط',
    firstLetter: 'الحرف الأول',
  };

  // منع إعادة تحميل الصفحة في صفحة السؤال
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'هل أنت متأكد من أنك تريد مغادرة السؤال؟ سيتم فقدان التقدم الحالي.';
      return 'هل أنت متأكد من أنك تريد مغادرة السؤال؟ سيتم فقدان التقدم الحالي.';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // منع F5 و Ctrl+R و Ctrl+Shift+R
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'R')) {
        e.preventDefault();
        alert('لا يمكن إعادة تحميل الصفحة أثناء عرض السؤال. استخدم زر "رجوع" للعودة.');
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

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Timer and Controls */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-[#800020]/90 to-[#A0455A]/90 backdrop-blur-md rounded-2xl p-6 mb-6 border-2 border-[#F5DEB3]/30 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              {/* Timer */}
              <motion.div 
                className="flex items-center gap-4"
                animate={timer <= 10 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: timer <= 10 ? Infinity : 0 }}
              >
                <motion.div 
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-[#F5DEB3] shadow-2xl ${
                    timer <= 10 ? 'bg-red-600' : timer <= 30 ? 'bg-yellow-600' : 'bg-[#800020]'
                  }`}
                  animate={timer <= 10 ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: timer <= 10 ? Infinity : 0 }}
                >
                  <div className="text-[#F5DEB3] text-2xl font-bold">{formatTime(timer)}</div>
                </motion.div>
                <button
                  onClick={toggleTimer}
                  className="bg-[#F5DEB3]/20 text-[#F5DEB3] px-4 py-2 rounded-xl hover:bg-[#F5DEB3]/30 transition-all duration-300 border border-[#F5DEB3]/30"
                >
                  {isTimerRunning ? 'إيقاف' : 'تشغيل'}
                </button>
              </motion.div>

              {/* Points Display */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] text-[#800020] px-6 py-3 rounded-xl font-bold text-2xl shadow-lg"
              >
                {question.points} نقطة
              </motion.div>

              {/* Help Method Button */}
              {activeHelpMethod && (
                <motion.button
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  onClick={() => {
                    if (activeHelpMethod === 'callFriend') {
                      setShowCallFriendDialog(true);
                    } else if (activeHelpMethod === 'firstLetter') {
                      setShowFirstLetter(true);
                    }
                  }}
                  disabled={activeHelpMethod === 'doublePoints'}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeHelpMethod === 'doublePoints'
                      ? 'bg-[#A0455A]/50 cursor-not-allowed'
                      : 'bg-[#A0455A] hover:bg-opacity-90 cursor-pointer hover:scale-105'
                  } text-[#F5DEB3] border-2 border-[#F5DEB3]/30 shadow-lg`}
                >
                  {helpMethodIcons[activeHelpMethod]}
                  <span className="text-lg font-medium">{helpMethodLabels[activeHelpMethod]}</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Question/Answer Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-[#800020]/80 to-[#A0455A]/80 backdrop-blur-md rounded-2xl p-8 border-2 border-[#F5DEB3]/30 shadow-2xl relative"
          >
            {/* Category Name Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -top-3 -right-3 bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] text-[#800020] px-4 py-2 rounded-xl font-bold text-lg shadow-lg border-2 border-[#F5DEB3] z-10"
            >
              {categoryName}
            </motion.div>

            {!showAnswer ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Question Text */}
                <motion.div 
                  className="text-5xl font-bold text-[#F5DEB3] mb-8 text-center leading-relaxed"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {question.text}
                </motion.div>

                {/* Media Content */}
                <AnimatePresence>
                  {question.video && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="mb-8"
                    >
                      <video
                        ref={videoRef}
                        className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border-2 border-[#F5DEB3]/30"
                        controls
                        autoPlay
                        playsInline
                      >
                        <source src={question.video} type="video/mp4" />
                        متصفحك لا يدعم تشغيل الفيديو
                      </video>
                    </motion.div>
                  )}

                  {question.image && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex justify-center mb-8"
                    >
                      <motion.img 
                        src={question.image} 
                        alt="Question" 
                        className="max-w-full max-h-[400px] object-contain rounded-2xl shadow-2xl border-2 border-[#F5DEB3]/30 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsImageEnlarged(true)}
                      />
                    </motion.div>
                  )}

                  {question.audio && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="mb-8 bg-gradient-to-br from-[#A0455A]/60 to-[#800020]/60 p-6 rounded-2xl border-2 border-[#F5DEB3]/30 shadow-2xl"
                    >
                      <audio 
                        ref={audioRef} 
                        src={question.audio}
                        onEnded={() => setIsPlaying(false)}
                        preload="auto"
                      />
                      <div className="flex flex-col items-center gap-6">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePlayPause}
                          className="w-20 h-20 bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] rounded-full flex items-center justify-center text-[#800020] text-3xl font-bold shadow-2xl border-2 border-[#F5DEB3]"
                        >
                          {isPlaying ? "⏸" : "▶"}
                        </motion.button>
                        <div className="w-full flex items-center gap-4">
                          <span className="text-lg text-[#F5DEB3] font-bold">{formatTime(currentTime)}</span>
                          <div className="flex-1 h-3 bg-[#F5DEB3]/20 rounded-full relative overflow-hidden">
                            <input
                              type="range"
                              min="0"
                              max={duration || 100}
                              value={currentTime}
                              onChange={handleSeek}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <motion.div 
                              className="h-full bg-gradient-to-r from-[#F5DEB3] to-[#E8D1A0] rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <span className="text-lg text-[#F5DEB3] font-bold">{formatTime(duration)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show Answer Button */}
                <motion.div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAnswer(true)}
                    className="bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] text-[#800020] px-12 py-4 rounded-2xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 border-2 border-[#F5DEB3] shadow-lg"
                  >
                    شنو الإجابة ؟
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Answer Display */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-3xl font-bold text-[#F5DEB3] mb-4">الإجابة الصحيحة</div>
                  <div className="text-5xl font-bold text-[#F5DEB3] leading-relaxed">{question.correctAnswer}</div>
                </motion.div>

                {/* Answer Image */}
                {question.answerImage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center mb-8"
                  >
                    <img 
                      src={question.answerImage} 
                      alt="Answer" 
                      className="max-w-full max-h-[400px] object-contain rounded-2xl shadow-2xl border-2 border-[#F5DEB3]/30"
                    />
                  </motion.div>
                )}

                {/* Team Selection */}
                {!showTeamSelection ? (
                  <motion.div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShowTeamSelection}
                      className="bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] text-[#800020] px-12 py-4 rounded-2xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 border-2 border-[#F5DEB3] shadow-lg"
                    >
                      منو جاوب؟
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-6">
                      {teams.map((team, index) => (
                        <motion.button
                          key={team.id}
                          initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onScorePoint(team.id, true)}
                          className="bg-gradient-to-br from-[#F5DEB3] to-[#E8D1A0] text-[#800020] p-6 rounded-2xl text-2xl font-bold hover:shadow-2xl transition-all duration-300 border-2 border-[#F5DEB3] shadow-lg"
                        >
                          {team.name}
                        </motion.button>
                      ))}
                    </div>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNoAnswer}
                      className="bg-gradient-to-br from-[#A0455A] to-[#800020] text-[#F5DEB3] px-8 py-4 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 border-2 border-[#F5DEB3]/30 shadow-lg w-full"
                    >
                      محد جاوب
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReportDialog(true)}
              className="inline-flex items-center gap-3 text-[#F5DEB3] hover:text-white transition-all duration-300 border-2 border-[#800020] hover:border-[#600018] px-6 py-3 rounded-xl hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="font-semibold">الإبلاغ عن مشكلة</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="inline-flex items-center gap-3 text-[#F5DEB3] hover:text-white transition-all duration-300 border-2 border-[#800020] hover:border-[#600018] px-6 py-3 rounded-xl hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span className="font-semibold">رجوع</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modals and Dialogs */}
      <ReportDialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        currentPage="صفحة السؤال"
      />

      {/* Back Confirmation Modal */}
      <AnimatePresence>
        {showConfirmBack && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-[#800020] to-[#A0455A] rounded-2xl p-8 max-w-md w-full text-center border-2 border-[#F5DEB3]/30 shadow-2xl"
            >
              <div className="text-2xl font-bold text-[#F5DEB3] mb-6">هل أنت متأكد من الرجوع؟</div>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300"
                >
                  نعم
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmBack(false)}
                  className="border-2 border-[#F5DEB3] text-[#F5DEB3] px-8 py-3 rounded-xl hover:bg-[#F5DEB3]/10 transition-all duration-300"
                >
                  لا
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enlarged Image Modal */}
      <AnimatePresence>
        {isImageEnlarged && question.image && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsImageEnlarged(false)}
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-[90vw] max-h-[90vh]"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-4 -right-4 bg-[#F5DEB3] rounded-full p-2 hover:bg-[#E8D1A0] transition-colors shadow-lg"
                onClick={() => setIsImageEnlarged(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#800020]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              <img
                src={question.image}
                alt="صورة السؤال"
                className="rounded-2xl max-h-[90vh] object-contain border-2 border-[#F5DEB3]/30"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Friend Dialog */}
      <AnimatePresence>
        {showCallFriendDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-[#800020] to-[#A0455A] rounded-2xl p-8 max-w-md w-full text-center border-2 border-[#F5DEB3]/30 shadow-2xl"
            >
              {!isCallFriendTimerStarted ? (
                <>
                  <div className="text-2xl font-bold text-[#F5DEB3] mb-6">
                    عندك 30 ثانية
                    <div className="text-lg mt-2 text-[#F5DEB3]/80">
                      وقت الي يعرف كل شي 😉
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsCallFriendTimerStarted(true);
                      setIsCallFriendActive(true);
                      setCallFriendMessage("");
                    }}
                    className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300"
                  >
                    يلا
                  </motion.button>
                </>
              ) : (
                <div className="text-2xl font-bold text-[#F5DEB3] mb-6">
                  {callFriendMessage || (
                    <>
                      الوقت المتبقي
                      <motion.div 
                        className="text-7xl mt-4 font-bold tabular-nums"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {callFriendTimer}
                      </motion.div>
                      <div className="text-lg mt-2 text-[#F5DEB3]/80">
                        ثانية
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* First Letter Dialog */}
      <AnimatePresence>
        {showFirstLetter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-[#800020] to-[#A0455A] rounded-2xl p-8 max-w-md w-full text-center border-2 border-[#F5DEB3]/30 shadow-2xl"
            >
              <div className="text-2xl font-bold text-[#F5DEB3] mb-6">
                الحرف الأول من الإجابة هو:
                <motion.div 
                  className="text-4xl mt-6 font-bold flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A0455A] to-[#800020] flex items-center justify-center border-4 border-[#F5DEB3] shadow-2xl">
                    <span className="text-[#F5DEB3] text-3xl font-bold">{question.correctAnswer.charAt(0)}</span>
                  </div>
                </motion.div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFirstLetter(false)}
                className="bg-[#F5DEB3] text-[#800020] px-8 py-3 rounded-xl font-bold hover:bg-[#E8D1A0] transition-all duration-300"
              >
                تمام
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuestionView;
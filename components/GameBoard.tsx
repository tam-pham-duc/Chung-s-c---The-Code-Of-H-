'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from './GameProvider';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Gem, Heart, Star, Sparkles, Flower2, Flame, Clock } from 'lucide-react';

// Sound effect generators using Web Audio API
const playCorrectSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a magical chime sound (Giải Mã Phái Đẹp theme)
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(523.25, now, 0.4); // C5
    playNote(659.25, now + 0.1, 0.4); // E5
    playNote(783.99, now + 0.2, 0.6); // G5
    playNote(1046.50, now + 0.3, 1.0); // C6
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

const playWrongSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a dramatic buzzer sound
    const playBuzzer = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, startTime + duration);
      
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playBuzzer(150, now, 0.4);
    playBuzzer(140, now + 0.1, 0.5);
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

const playWinSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a triumphant fanfare
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'square') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // C major arpeggio fanfare
    playNote(523.25, now, 0.2);       // C5
    playNote(659.25, now + 0.2, 0.2); // E5
    playNote(783.99, now + 0.4, 0.2); // G5
    playNote(1046.50, now + 0.6, 0.8); // C6
    
    // Harmony
    playNote(392.00, now, 0.2, 'triangle');       // G4
    playNote(523.25, now + 0.2, 0.2, 'triangle'); // C5
    playNote(659.25, now + 0.4, 0.2, 'triangle'); // E5
    playNote(783.99, now + 0.6, 0.8, 'triangle'); // G5
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

// Helper function to get theme colors and icons based on answer rank
const getAnswerTheme = (index: number) => {
  switch (index) {
    case 0:
      return {
        gradient: 'from-yellow-300 via-yellow-400 to-amber-500',
        text: 'text-amber-900',
        bg: 'bg-amber-100',
        border: 'border-yellow-500',
        icon: <Crown className="w-6 h-6 text-amber-600 drop-shadow-sm" />,
        shadow: 'shadow-[0_0_25px_rgba(250,204,21,0.6)]'
      };
    case 1:
      return {
        gradient: 'from-pink-300 via-pink-400 to-rose-500',
        text: 'text-rose-900',
        bg: 'bg-rose-50',
        border: 'border-pink-500',
        icon: <Gem className="w-6 h-6 text-rose-600 drop-shadow-sm" />,
        shadow: 'shadow-[0_0_20px_rgba(244,114,182,0.5)]'
      };
    case 2:
      return {
        gradient: 'from-fuchsia-300 via-fuchsia-400 to-purple-500',
        text: 'text-purple-900',
        bg: 'bg-purple-50',
        border: 'border-fuchsia-500',
        icon: <Heart className="w-6 h-6 text-purple-600 drop-shadow-sm" />,
        shadow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]'
      };
    case 3:
      return {
        gradient: 'from-violet-300 via-violet-400 to-indigo-500',
        text: 'text-indigo-900',
        bg: 'bg-indigo-50',
        border: 'border-violet-500',
        icon: <Star className="w-6 h-6 text-indigo-600 drop-shadow-sm" />,
        shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]'
      };
    case 4:
      return {
        gradient: 'from-teal-300 via-teal-400 to-emerald-500',
        text: 'text-teal-900',
        bg: 'bg-teal-50',
        border: 'border-teal-500',
        icon: <Flower2 className="w-6 h-6 text-teal-600 drop-shadow-sm" />,
        shadow: 'shadow-[0_0_15px_rgba(45,212,191,0.5)]'
      };
    default:
      return {
        gradient: 'from-slate-300 via-slate-400 to-slate-500',
        text: 'text-slate-900',
        bg: 'bg-slate-50',
        border: 'border-slate-400',
        icon: <Sparkles className="w-6 h-6 text-slate-600 drop-shadow-sm" />,
        shadow: 'shadow-[0_0_10px_rgba(148,163,184,0.5)]'
      };
  }
};

export default function GameBoard() {
  const { gameState } = useGame();
  const { teams, questions, currentQuestionIndex, strikes, tempScore, showStrike } = gameState;
  const currentQuestion = questions[currentQuestionIndex];

  const [introPlayedFor, setIntroPlayedFor] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [showCelebration, setShowCelebration] = useState<string | null>(null);
  
  const displayTime = gameState.timerStartedAt 
    ? Math.max(0, (gameState.timerDuration || 30) - Math.floor((currentTime - gameState.timerStartedAt) / 1000))
    : (gameState.timerDuration || 30);
  
  // Generate confetti properties once using a deterministic pseudo-random generator
  const confettiProps = React.useMemo(() => {
    // Simple seeded PRNG
    let seed = 12345;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return Array.from({ length: 50 }).map((_, i) => {
      const colors = ['#facc15', '#f472b6', '#c084fc', '#38bdf8', '#34d399'];
      return {
        id: i,
        color: colors[i % colors.length],
        size: random() * 10 + 10,
        left: `${random() * 100}%`,
        duration: random() * 3 + 2,
        delay: random() * 2,
        xOffset: (random() - 0.5) * 200,
        isTriangle: i % 2 === 0,
        isCircle: i % 2 !== 0
      };
    });
  }, []);

  // Refs for tracking changes to play sounds
  const prevStrikesRef = useRef(strikes);
  const prevRevealedCountRef = useRef(0);
  const prevQuestionIdRef = useRef<string | null>(null);
  const prevScoresRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // Check for winning threshold (e.g., 300 points)
    const WIN_THRESHOLD = 300;
    
    teams.forEach(team => {
      const prevScore = prevScoresRef.current[team.id] || 0;
      if (team.score >= WIN_THRESHOLD && prevScore < WIN_THRESHOLD) {
        setShowCelebration(team.id);
        playWinSound();
        
        // Hide celebration after 8 seconds
        setTimeout(() => {
          setShowCelebration(null);
        }, 8000);
      }
      prevScoresRef.current[team.id] = team.score;
    });
  }, [teams]);

  useEffect(() => {
    if (strikes > prevStrikesRef.current) {
      playWrongSound();
    }
    prevStrikesRef.current = strikes;
  }, [strikes]);

  useEffect(() => {
    const currentRevealedCount = currentQuestion?.answers.filter(a => a.revealed).length || 0;
    
    if (currentQuestion?.id !== prevQuestionIdRef.current) {
      // Question changed, reset tracking
      prevQuestionIdRef.current = currentQuestion?.id || null;
      prevRevealedCountRef.current = currentRevealedCount;
    } else if (currentRevealedCount > prevRevealedCountRef.current) {
      // New answer revealed
      playCorrectSound();
      prevRevealedCountRef.current = currentRevealedCount;
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (gameState.timerStartedAt) {
      const interval = setInterval(() => setCurrentTime(Date.now()), 100);
      return () => clearInterval(interval);
    }
  }, [gameState.timerStartedAt]);

  useEffect(() => {
    if (currentQuestion?.isSuddenDeath && introPlayedFor !== currentQuestion.id) {
      const timer = setTimeout(() => {
        setIntroPlayedFor(currentQuestion.id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, introPlayedFor]);

  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-screen text-white text-2xl">Chưa có câu hỏi nào</div>;
  }

  // Show Sudden Death Intro Screen
  if (currentQuestion.isSuddenDeath && introPlayedFor !== currentQuestion.id) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-rose-950 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/40 via-transparent to-transparent pointer-events-none"></div>
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
          className="z-10 flex flex-col items-center text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="mb-8"
          >
            <Flame className="w-40 h-40 text-rose-500 drop-shadow-[0_0_50px_rgba(244,63,94,0.8)]" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-300 to-red-600 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-widest uppercase mb-4">
            SUDDEN DEATH
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-rose-200 tracking-[0.3em] uppercase drop-shadow-lg">
            CÂU HỎI QUYẾT ĐỊNH
          </h2>
        </motion.div>
      </div>
    );
  }

  // Ensure we always show an even number of slots (e.g., 8 slots max)
  const maxAnswers = Math.max(currentQuestion.answers.length, 6);
  const displayAnswers = [...currentQuestion.answers];
  while (displayAnswers.length < maxAnswers) {
    displayAnswers.push({ id: `empty-${displayAnswers.length}`, text: '', points: 0, revealed: false });
  }

  const isSuddenDeathActive = currentQuestion.isSuddenDeath && introPlayedFor === currentQuestion.id;

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden font-sans transition-colors duration-1000 ${isSuddenDeathActive ? 'bg-gradient-to-br from-rose-950 via-red-900 to-orange-950' : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950'}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
      <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] pointer-events-none ${isSuddenDeathActive ? 'from-red-500/20' : 'from-pink-500/20'} via-transparent to-transparent`}></div>
      <div className={`absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] pointer-events-none ${isSuddenDeathActive ? 'from-orange-500/20' : 'from-purple-500/20'} via-transparent to-transparent`}></div>

      {/* Header & Timer */}
      <div className="z-10 flex flex-col items-center mb-8 mt-4 w-full px-8">
        {(gameState.showTimer || gameState.timerStartedAt || isSuddenDeathActive) && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-8 flex items-center gap-4 bg-black/40 backdrop-blur-md border border-rose-500/50 px-8 py-3 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          >
            <Clock className={`w-8 h-8 ${displayTime <= 5 ? 'text-red-500 animate-pulse' : 'text-rose-300'}`} />
            <span className={`text-5xl font-black tracking-widest ${displayTime <= 5 ? 'text-red-500 animate-pulse' : 'text-rose-100'}`}>
              {displayTime}
            </span>
          </motion.div>
        )}

        <div className={`text-center ${(gameState.showTimer || gameState.timerStartedAt || isSuddenDeathActive) ? 'mt-20' : ''}`}>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider uppercase"
          >
            {gameState.programName || 'CHUNG SỨC'}
            {gameState.programNameEn && <span className="text-2xl md:text-4xl ml-4 opacity-80">- {gameState.programNameEn}</span>}
          </motion.h1>
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-bold text-pink-100 drop-shadow-md mt-2 tracking-widest uppercase"
          >
            {gameState.programTheme || 'Giải Mã Phái Đẹp'}
            {gameState.programThemeEn && <span className="opacity-80 ml-2">- {gameState.programThemeEn}</span>}
          </motion.h2>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="z-10 flex w-full max-w-6xl justify-between px-4 mb-8">
        {/* Team 1 */}
        <div className={`flex flex-col items-center bg-white/10 backdrop-blur-md border-2 ${gameState.controllingTeamId === teams[0].id ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-pink-300/30'} rounded-2xl p-4 min-w-[200px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 relative`}>
          {gameState.controllingTeamId === teams[0].id && (
            <div className="absolute -top-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-bounce">
              Đang kiểm soát
            </div>
          )}
          {gameState.isStealing && gameState.stealingTeamId === teams[0].id && (
            <div className="absolute -top-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
              Đang cướp điểm
            </div>
          )}
          <h3 className="text-2xl font-bold text-pink-100 mb-2 uppercase text-center tracking-wide">{teams[0].name}</h3>
          <motion.div 
            key={teams[0].score}
            initial={{ scale: 1.5, color: '#fcd34d' }}
            animate={{ scale: 1, color: '#facc15' }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="text-5xl font-black text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            {teams[0].score}
          </motion.div>
        </div>

        {/* Current Points */}
        <div className="flex flex-col items-center justify-center relative">
          {gameState.isStealing && (
            <div className="absolute -top-12 bg-orange-600/80 backdrop-blur text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest border border-orange-400 shadow-[0_0_30px_rgba(234,88,12,0.6)] animate-pulse whitespace-nowrap">
              CƠ HỘI CƯỚP ĐIỂM
            </div>
          )}
          <motion.div 
            key={tempScore}
            initial={{ scale: 1.3, borderColor: '#fcd34d', boxShadow: '0 0 60px rgba(250,204,21,0.8)' }}
            animate={{ scale: 1, borderColor: 'rgba(250,204,21,0.8)', boxShadow: '0 0 40px rgba(250,204,21,0.4)' }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="bg-gradient-to-b from-purple-900 to-indigo-950 border-4 rounded-full w-32 h-32 flex items-center justify-center"
          >
            <motion.span 
              key={`text-${tempScore}`}
              initial={{ scale: 1.2, color: '#fcd34d' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              className="text-6xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {tempScore}
            </motion.span>
          </motion.div>
          <div className="mt-3 text-yellow-400/90 font-bold text-sm tracking-[0.2em] uppercase">Điểm Tích Lũy</div>
        </div>

        {/* Team 2 */}
        <div className={`flex flex-col items-center bg-white/10 backdrop-blur-md border-2 ${gameState.controllingTeamId === teams[1].id ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-pink-300/30'} rounded-2xl p-4 min-w-[200px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 relative`}>
          {gameState.controllingTeamId === teams[1].id && (
            <div className="absolute -top-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-bounce">
              Đang kiểm soát
            </div>
          )}
          {gameState.isStealing && gameState.stealingTeamId === teams[1].id && (
            <div className="absolute -top-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
              Đang cướp điểm
            </div>
          )}
          <h3 className="text-2xl font-bold text-pink-100 mb-2 uppercase text-center tracking-wide">{teams[1].name}</h3>
          <motion.div 
            key={teams[1].score}
            initial={{ scale: 1.5, color: '#fcd34d' }}
            animate={{ scale: 1, color: '#facc15' }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="text-5xl font-black text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            {teams[1].score}
          </motion.div>
        </div>
      </div>

      {/* Question */}
      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="z-10 w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <motion.h3 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold text-white leading-relaxed drop-shadow-md"
        >
          {currentQuestion.text}
        </motion.h3>
        <div className="mt-4 text-pink-300 font-medium tracking-wider uppercase text-sm">
          {currentQuestion.isSuddenDeath ? (
            <span className="text-rose-400 font-bold animate-pulse">✨ Câu hỏi phụ - Sudden Death ✨</span>
          ) : (
            `Vòng ${currentQuestion.round} • Hệ số: x${currentQuestion.multiplier}`
          )}
        </div>
      </motion.div>

      {/* Answers Grid */}
      <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-12">
        {displayAnswers.map((answer, index) => {
          const theme = getAnswerTheme(index);
          
          return (
            <div key={answer.id} className="relative h-20 perspective-1000">
              <motion.div
                className="w-full h-full relative preserve-3d cursor-default"
                initial={false}
                animate={{ 
                  rotateX: answer.revealed ? 180 : 0,
                  scale: answer.revealed ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
              >
                {/* Front (Hidden) */}
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-r from-indigo-800/80 to-purple-800/80 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-2xl font-bold text-white/90 shadow-inner">
                    {index + 1}
                  </div>
                </div>

                {/* Back (Revealed) */}
                <div 
                  className={`absolute w-full h-full backface-hidden bg-white rounded-xl flex items-center overflow-hidden ${theme.shadow} border-2 ${theme.border}`} 
                  style={{ transform: 'rotateX(180deg)' }}
                >
                  {answer.text ? (
                    <>
                      <div className={`flex items-center justify-center w-16 h-full bg-gradient-to-br ${theme.gradient} border-r border-white/50`}>
                        {theme.icon}
                      </div>
                      <div className={`flex-grow px-6 text-xl md:text-2xl font-bold ${theme.text} uppercase truncate`}>
                        {answer.text}
                      </div>
                      <div className={`w-24 h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-3xl font-black text-white drop-shadow-md border-l border-white/50`}>
                        {answer.points}
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-gray-300 text-2xl font-bold">
                      ---
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Big Strikes Overlay */}
      <AnimatePresence>
        {showStrike && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm"
          >
            <div className="flex gap-8 md:gap-12">
              {Array.from({ length: strikes }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ 
                    type: 'spring', 
                    bounce: 0.6, 
                    duration: 0.8,
                    delay: i * 0.15 
                  }}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute w-full h-full bg-red-600 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-500 to-red-800 border-[12px] border-white rounded-full p-6 md:p-10 shadow-[0_0_60px_rgba(220,38,38,0.8)]">
                    <X className="w-32 h-32 md:w-48 md:h-48 text-white drop-shadow-[0_8px_8px_rgba(0,0,0,0.6)]" strokeWidth={4} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small Strikes Indicator (Bottom) */}
      <div className="fixed bottom-8 flex gap-3 z-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              i < strikes 
                ? 'bg-rose-500 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-110' 
                : 'bg-white/5 border-white/20 backdrop-blur-sm'
            }`}
          >
            {i < strikes && <X className="w-8 h-8 text-white" strokeWidth={3} />}
          </div>
        ))}
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm overflow-hidden"
          >
            {/* Confetti particles */}
            {confettiProps.map((props) => (
              <motion.div
                key={`confetti-${props.id}`}
                initial={{ y: -100, x: 0, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: '100vh', 
                  x: props.xOffset,
                  rotate: 360 * 5,
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: props.duration, 
                  delay: props.delay, 
                  ease: "linear",
                  repeat: Infinity
                }}
                className="absolute top-0"
                style={{ 
                  left: props.left, 
                  width: props.size, 
                  height: props.size, 
                  backgroundColor: props.color,
                  clipPath: props.isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
                  borderRadius: props.isCircle ? '50%' : '0%'
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
              className="relative bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 p-1 rounded-3xl shadow-[0_0_100px_rgba(250,204,21,0.8)]"
            >
              <div className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-[22px] p-12 flex flex-col items-center text-center border-4 border-yellow-400/50">
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    y: [-10, 10, -10]
                  }}
                  transition={{ 
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="mb-6"
                >
                  <Crown className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-yellow-200 tracking-widest uppercase mb-2">
                  CHÚC MỪNG
                </h2>
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase mb-6">
                  {teams.find(t => t.id === showCelebration)?.name}
                </h1>
                <div className="text-2xl font-bold text-white bg-white/10 px-8 py-3 rounded-full border border-white/20 backdrop-blur-md">
                  ĐÃ ĐẠT {teams.find(t => t.id === showCelebration)?.score} ĐIỂM!
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

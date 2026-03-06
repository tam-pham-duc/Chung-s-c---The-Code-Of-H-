'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from './GameProvider';
import { motion, AnimatePresence } from 'motion/react';
import { X, Crown, Gem, Heart, Star, Sparkles, Flower2, Flame, Clock, Music, Music2 } from 'lucide-react';

// Sound effect generators using Web Audio API
const playCorrectSound = (rank: number = 0, settings?: any) => {
  try {
    if (settings?.correctSoundType === 'custom' && settings.customUrls?.correct) {
      const audio = new Audio(settings.customUrls.correct);
      audio.play().catch(e => console.error("Custom audio play failed:", e));
      return;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
    if (settings?.correctSoundType === 'bell') {
      playNote(880.00, now, 0.5, 'triangle'); // A5
      if (rank === 0) playNote(1046.50, now + 0.2, 0.8, 'triangle'); // C6
    } else if (settings?.correctSoundType === 'chime') {
      playNote(523.25, now, 0.3); // C5
      playNote(659.25, now + 0.1, 0.3); // E5
      playNote(783.99, now + 0.2, 0.6); // G5
    } else {
      // Default 'magic'
      if (rank === 0) {
        // Top answer: Epic magical chime
        playNote(523.25, now, 0.4); // C5
        playNote(659.25, now + 0.1, 0.4); // E5
        playNote(783.99, now + 0.2, 0.6); // G5
        playNote(1046.50, now + 0.3, 1.0); // C6
        playNote(1318.51, now + 0.4, 1.5, 'triangle'); // E6
      } else if (rank === 1 || rank === 2) {
        // High answers: Good chime
        playNote(523.25, now, 0.4); // C5
        playNote(659.25, now + 0.1, 0.4); // E5
        playNote(783.99, now + 0.2, 0.8); // G5
      } else {
        // Lower answers: Simple chime
        playNote(523.25, now, 0.4); // C5
        playNote(659.25, now + 0.1, 0.6); // E5
      }
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

const playCompleteSound = (settings?: any) => {
  try {
    if (settings?.completeSoundType === 'custom' && settings.customUrls?.complete) {
      const audio = new Audio(settings.customUrls.complete);
      audio.play().catch(e => console.error("Custom audio play failed:", e));
      return;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
    if (settings?.completeSoundType === 'fanfare') {
      playNote(523.25, now, 0.2, 'square'); // C5
      playNote(523.25, now + 0.2, 0.2, 'square'); // C5
      playNote(523.25, now + 0.4, 0.2, 'square'); // C5
      playNote(659.25, now + 0.6, 0.8, 'square'); // E5
    } else {
      // Default 'triumphant'
      playNote(523.25, now, 0.5); // C5
      playNote(659.25, now, 0.5); // E5
      playNote(783.99, now, 0.5); // G5
      
      playNote(698.46, now + 0.3, 0.5); // F5
      playNote(880.00, now + 0.3, 0.5); // A5
      playNote(1046.50, now + 0.3, 0.5); // C6
      
      playNote(783.99, now + 0.6, 1.5, 'triangle'); // G5
      playNote(987.77, now + 0.6, 1.5, 'triangle'); // B5
      playNote(1174.66, now + 0.6, 1.5, 'triangle'); // D6
      playNote(1567.98, now + 0.6, 2.0, 'sine'); // G6
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

const playWrongSound = (settings?: any) => {
  try {
    if (settings?.wrongSoundType === 'custom' && settings.customUrls?.wrong) {
      const audio = new Audio(settings.customUrls.wrong);
      audio.play().catch(e => console.error("Custom audio play failed:", e));
      return;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sawtooth') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
    if (settings?.wrongSoundType === 'horn') {
      playNote(150, now, 0.8, 'square');
      playNote(145, now, 0.8, 'sawtooth');
    } else {
      // Default 'buzzer'
      playNote(150, now, 0.5);
      playNote(140, now + 0.1, 0.6);
      playNote(130, now + 0.2, 0.8);
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

const playWinSound = (settings?: any) => {
  try {
    if (settings?.winSoundType === 'custom' && settings.customUrls?.win) {
      const audio = new Audio(settings.customUrls.win);
      audio.play().catch(e => console.error("Custom audio play failed:", e));
      return;
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    
    if (settings?.winSoundType === 'applause') {
      // Simulate applause with noise
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 1000;
      noise.connect(noiseFilter);
      const noiseGain = ctx.createGain();
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
      noise.start(now);
    } else {
      // Default 'fanfare'
      playNote(523.25, now, 0.4, 'triangle'); // C5
      playNote(659.25, now + 0.2, 0.4, 'triangle'); // E5
      playNote(783.99, now + 0.4, 0.4, 'triangle'); // G5
      playNote(1046.50, now + 0.6, 1.5, 'triangle'); // C6
      
      playNote(523.25, now + 0.6, 1.5, 'sine'); // C5
      playNote(659.25, now + 0.6, 1.5, 'sine'); // E5
      playNote(783.99, now + 0.6, 1.5, 'sine'); // G5
    }
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { updateGameState } = useGame();
  
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
  const prevRevealedAnswersRef = useRef<string[]>([]);

  useEffect(() => {
    // Check for winning threshold (e.g., 300 points)
    const WIN_THRESHOLD = 300;
    
    teams.slice(0, gameState.numberOfTeams || 2).forEach(team => {
      const prevScore = prevScoresRef.current[team.id] || 0;
      if (team.score >= WIN_THRESHOLD && prevScore < WIN_THRESHOLD) {
        setShowCelebration(team.id);
        playWinSound(gameState.soundSettings);
        
        // Hide celebration after 8 seconds
        setTimeout(() => {
          setShowCelebration(null);
        }, 8000);
      }
      prevScoresRef.current[team.id] = team.score;
    });
  }, [teams, gameState.soundSettings, gameState.numberOfTeams]);

  useEffect(() => {
    if (strikes > prevStrikesRef.current) {
      playWrongSound(gameState.soundSettings);
    }
    prevStrikesRef.current = strikes;
  }, [strikes, gameState.soundSettings]);

  useEffect(() => {
    const currentRevealedAnswers = currentQuestion?.answers.filter(a => a.revealed).map(a => a.id) || [];
    const currentRevealedCount = currentRevealedAnswers.length;
    
    if (currentQuestion?.id !== prevQuestionIdRef.current) {
      // Question changed, reset tracking
      prevQuestionIdRef.current = currentQuestion?.id || null;
      prevRevealedCountRef.current = currentRevealedCount;
      prevRevealedAnswersRef.current = currentRevealedAnswers;
    } else if (currentRevealedCount > prevRevealedCountRef.current) {
      // Find the newly revealed answer
      const newlyRevealedId = currentRevealedAnswers.find(id => !prevRevealedAnswersRef.current.includes(id));
      const newlyRevealedIndex = currentQuestion?.answers.findIndex(a => a.id === newlyRevealedId);
      
      if (currentRevealedCount === currentQuestion?.answers.length) {
        // All answers revealed
        playCompleteSound(gameState.soundSettings);
      } else {
        // Play sound based on rank (index)
        playCorrectSound(newlyRevealedIndex !== undefined && newlyRevealedIndex !== -1 ? newlyRevealedIndex : 0, gameState.soundSettings);
      }
      
      prevRevealedCountRef.current = currentRevealedCount;
      prevRevealedAnswersRef.current = currentRevealedAnswers;
    }
  }, [currentQuestion, gameState.soundSettings]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = gameState.soundSettings?.bgmVolume ?? 0.5;
      audioRef.current.playbackRate = gameState.bgmSpeed ?? 1.0;
      if (gameState.bgmPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [gameState.bgmPlaying, gameState.soundSettings?.bgmVolume, gameState.bgmSpeed]);

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

  const displayAnswers = [...currentQuestion.answers];

  const isSuddenDeathActive = currentQuestion.isSuddenDeath && introPlayedFor === currentQuestion.id;

  return (
    <div className={`relative flex flex-col items-center justify-start h-screen overflow-hidden font-sans py-4 px-4 transition-colors duration-1000 ${isSuddenDeathActive ? 'bg-gradient-to-br from-rose-950 via-red-900 to-orange-950' : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950'}`}>
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay fixed"></div>
      <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] pointer-events-none fixed ${isSuddenDeathActive ? 'from-red-500/20' : 'from-pink-500/20'} via-transparent to-transparent`}></div>
      <div className={`absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] pointer-events-none fixed ${isSuddenDeathActive ? 'from-orange-500/20' : 'from-purple-500/20'} via-transparent to-transparent`}></div>

      {/* Background Music Audio Element */}
      <audio 
        ref={audioRef} 
        src={gameState.soundSettings?.bgmUrl || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"} 
        loop 
        preload="auto"
      />

      {/* Music Toggle Button */}
      <button
        onClick={() => updateGameState({ bgmPlaying: !gameState.bgmPlaying })}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md border-2 transition-all duration-300 shadow-lg ${
          gameState.bgmPlaying 
            ? 'bg-pink-500/20 border-pink-400 text-pink-200 shadow-[0_0_15px_rgba(244,114,182,0.5)]' 
            : 'bg-white/5 border-white/20 text-white/50 hover:bg-white/10'
        }`}
        title={gameState.bgmPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      >
        {gameState.bgmPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Music2 className="w-6 h-6" />}
      </button>

      {/* Header & Timer */}
      <div className="z-10 flex flex-col items-center mb-4 w-full max-w-6xl relative justify-center mt-2">
        <div className="text-center mb-4">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wider uppercase"
          >
            {gameState.programName || 'CHUNG SỨC'}
            {gameState.programNameEn && <span className="text-xl md:text-2xl lg:text-3xl ml-3 opacity-80">- {gameState.programNameEn}</span>}
          </motion.h1>
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg lg:text-xl font-bold text-pink-100 drop-shadow-md mt-1 tracking-widest uppercase"
          >
            {gameState.programTheme || 'Giải Mã Phái Đẹp'}
            {gameState.programThemeEn && <span className="opacity-80 ml-2">- {gameState.programThemeEn}</span>}
          </motion.h2>
        </div>

        <AnimatePresence>
          {(gameState.showTimer || gameState.timerStartedAt || isSuddenDeathActive) && (
            <motion.div 
              initial={{ y: -20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              className="flex items-center gap-4 bg-black/60 backdrop-blur-md border border-rose-500/50 px-8 py-2 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.4)]"
            >
              <Clock className={`w-6 h-6 md:w-8 md:h-8 ${displayTime <= 5 ? 'text-red-500 animate-pulse' : 'text-rose-300'}`} />
              <span className={`text-4xl md:text-5xl font-black tracking-widest ${displayTime <= 5 ? 'text-red-500 animate-pulse' : 'text-rose-100'}`}>
                {displayTime}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scoreboard */}
      <div className="z-10 flex flex-col items-center w-full max-w-6xl px-4 mb-8">
        {/* Current Points */}
        <div className="flex flex-col items-center justify-start relative pt-2 mb-6">
          <div className="h-8 mb-2 flex items-end justify-center w-full">
            {gameState.isStealing && (
              <div className="bg-orange-600/80 backdrop-blur text-white px-4 py-1 rounded-full font-bold uppercase tracking-widest border border-orange-400 shadow-[0_0_30px_rgba(234,88,12,0.6)] animate-pulse whitespace-nowrap text-xs">
                CƠ HỘI CƯỚP ĐIỂM
              </div>
            )}
          </div>
          <motion.div 
            key={tempScore}
            initial={{ scale: 1.3, borderColor: '#fcd34d', boxShadow: '0 0 60px rgba(250,204,21,0.8)' }}
            animate={{ scale: 1, borderColor: 'rgba(250,204,21,0.8)', boxShadow: '0 0 40px rgba(250,204,21,0.4)' }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
            className="bg-gradient-to-b from-purple-900 to-indigo-950 border-4 rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0"
          >
            <motion.span 
              key={`text-${tempScore}`}
              initial={{ scale: 1.2, color: '#fcd34d' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
              className="text-4xl md:text-5xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {tempScore}
            </motion.span>
          </motion.div>
          <div className="mt-3 text-yellow-400/90 font-bold text-xs tracking-[0.2em] uppercase text-center">Điểm Tích Lũy</div>
        </div>

        {/* Teams */}
        <div className={`grid w-full gap-4 md:gap-8 grid-cols-1 ${
          {
            2: 'sm:grid-cols-2',
            3: 'sm:grid-cols-3',
            4: 'sm:grid-cols-4',
            5: 'sm:grid-cols-5',
          }[gameState.numberOfTeams || 2] || 'sm:grid-cols-2'
        }`}>
          {teams.slice(0, gameState.numberOfTeams || 2).map((team) => (
            <div key={team.id} className={`flex flex-col items-center bg-white/10 backdrop-blur-md border-2 ${gameState.controllingTeamId === team.id ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-pink-300/30'} rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 relative mt-6`}>
              <div className="absolute -top-5 w-full flex justify-center">
                {gameState.controllingTeamId === team.id && (
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-bounce whitespace-nowrap">
                    Đang kiểm soát
                  </div>
                )}
                {gameState.isStealing && gameState.stealingTeamId === team.id && (
                  <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse whitespace-nowrap">
                    Đang cướp điểm
                  </div>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-pink-100 mb-2 uppercase text-center tracking-wide w-full truncate px-2">{team.name}</h3>
              <motion.div 
                key={team.score}
                initial={{ scale: 2, y: -30, color: '#ffffff', textShadow: '0 0 20px #ffffff, 0 0 40px #facc15' }}
                animate={{ scale: 1, y: 0, color: '#facc15', textShadow: '0 4px 8px rgba(0,0,0,0.8)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 10, duration: 0.8 }}
                className="text-4xl md:text-5xl font-black text-yellow-400"
              >
                {team.score}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Question */}
      <motion.div 
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-4xl bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-900/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 mb-8 text-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed drop-shadow-md">
          {currentQuestion.text}
        </h3>
        {currentQuestion.textEn && (
          <h4 className="text-lg md:text-xl lg:text-2xl font-medium text-pink-200 mt-2 leading-relaxed drop-shadow-md italic">
            {currentQuestion.textEn}
          </h4>
        )}
        <div className="mt-4 text-pink-300 font-medium tracking-wider uppercase text-xs md:text-sm">
          {currentQuestion.isSuddenDeath ? (
            <span className="text-rose-400 font-bold animate-pulse">✨ Câu hỏi phụ - Sudden Death ✨</span>
          ) : (
            `Vòng ${currentQuestion.round} • Hệ số: x${currentQuestion.multiplier}`
          )}
        </div>
      </motion.div>

      {/* Answers Grid */}
      <div className="z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 mb-24">
        {displayAnswers.map((answer, index) => {
          const theme = getAnswerTheme(index);
          
          return (
            <div key={answer.id} className="relative h-20 perspective-1000 group hover:-translate-y-1 transition-transform duration-300">
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
                <div className="absolute w-full h-full backface-hidden bg-gradient-to-r from-indigo-800/80 to-purple-800/80 backdrop-blur-sm border border-white/20 group-hover:border-white/50 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-xl flex items-center justify-center shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-2xl font-bold text-white/90 shadow-inner">
                    {index + 1}
                  </div>
                </div>

                {/* Back (Revealed) */}
                <div 
                  className={`absolute w-full h-full backface-hidden bg-white rounded-xl flex items-center overflow-hidden ${theme.shadow} border-2 ${theme.border} group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:border-white/80 transition-all duration-300`} 
                  style={{ transform: 'rotateX(180deg)' }}
                >
                  {answer.text ? (
                    <motion.div 
                      className="w-full h-full flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: answer.revealed ? 1 : 0, scale: answer.revealed ? 1 : 0.8 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                    >
                      <div className={`flex items-center justify-center w-16 h-full bg-gradient-to-br ${theme.gradient} border-r border-white/50 shrink-0`}>
                        {theme.icon}
                      </div>
                      <div className={`flex-grow px-4 md:px-6 py-1 flex flex-col justify-center min-w-0`}>
                        <div 
                          className={`font-bold ${theme.text} uppercase leading-tight`}
                          style={{ 
                            fontSize: answer.text.length > 30 ? '1rem' : answer.text.length > 20 ? '1.25rem' : '1.5rem'
                          }}
                        >
                          {answer.text}
                        </div>
                        {answer.textEn && (
                          <div 
                            className={`font-medium ${theme.text} opacity-80 italic leading-tight mt-0.5`}
                            style={{ 
                              fontSize: answer.textEn.length > 40 ? '0.75rem' : '0.875rem'
                            }}
                          >
                            {answer.textEn}
                          </div>
                        )}
                      </div>
                      <div className={`w-20 md:w-24 h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl md:text-3xl font-black text-white drop-shadow-md border-l border-white/50 shrink-0`}>
                        {answer.points}
                      </div>
                    </motion.div>
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
      <div className="fixed bottom-6 flex gap-3 z-10 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              i < strikes 
                ? 'bg-rose-600 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.8)] scale-110' 
                : 'bg-white/5 border-white/20'
            }`}
          >
            {i < strikes && <X className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={3} />}
          </div>
        ))}
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {(showCelebration || gameState.specialEffect === 'confetti') && (
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

            {showCelebration && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Special Effects */}
      <AnimatePresence>
        {gameState.specialEffect === 'applause' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] uppercase tracking-widest animate-pulse">
              VỖ TAY!
            </div>
          </motion.div>
        )}
        {gameState.specialEffect === 'alert' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: 3 }}
            className="fixed inset-0 z-50 pointer-events-none bg-red-600/30"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

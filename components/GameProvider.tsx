'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, Question, Team } from '@/lib/types';
import { defaultGameState } from '@/lib/default-data';
import { motion } from 'motion/react';
import { Sparkles, Heart, Crown } from 'lucide-react';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  revealAnswer: (questionId: string, answerId: string) => void;
  addStrike: () => void;
  clearStrikes: () => void;
  awardPoints: (teamId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  updateQuestion: (questionId: string, updates: Partial<Question>) => void;
  addQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chungSucGameState');
    if (saved) {
      try {
        setGameState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved game state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('chungSucGameState', JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chungSucGameState' && e.newValue) {
        try {
          setGameState(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Failed to sync game state from other tab', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const revealAnswer = (questionId: string, answerId: string) => {
    setGameState((prev) => {
      const newQuestions = prev.questions.map((q) => {
        if (q.id === questionId) {
          const newAnswers = q.answers.map((a) => {
            if (a.id === answerId && !a.revealed) {
              // Add points to temp score
              prev.tempScore += a.points * q.multiplier;
              return { ...a, revealed: true };
            }
            return a;
          });
          return { ...q, answers: newAnswers };
        }
        return q;
      });
      return { ...prev, questions: newQuestions, tempScore: prev.tempScore };
    });
  };

  const addStrike = () => {
    setGameState((prev) => ({
      ...prev,
      strikes: Math.min(prev.strikes + 1, 3),
      showStrike: true,
    }));
    
    // Hide strike after 2 seconds
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, showStrike: false }));
    }, 2000);
  };

  const clearStrikes = () => {
    setGameState((prev) => ({ ...prev, strikes: 0, showStrike: false }));
  };

  const awardPoints = (teamId: string) => {
    setGameState((prev) => {
      const newTeams = prev.teams.map((t) => {
        if (t.id === teamId) {
          return { ...t, score: t.score + prev.tempScore };
        }
        return t;
      });
      return { ...prev, teams: newTeams, tempScore: 0, strikes: 0 };
    });
  };

  const nextQuestion = () => {
    setGameState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
      tempScore: 0,
      strikes: 0,
    }));
  };

  const prevQuestion = () => {
    setGameState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
      tempScore: 0,
      strikes: 0,
    }));
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setGameState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => (t.id === teamId ? { ...t, ...updates } : t)),
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setGameState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    }));
  };

  const addQuestion = (question: Question) => {
    setGameState((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setGameState((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
      currentQuestionIndex: 0, // Reset to first question to avoid out of bounds
    }));
  };

  const resetGame = () => {
    setGameState(defaultGameState);
    localStorage.removeItem('chungSucGameState');
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-950 text-white overflow-hidden relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative flex items-center justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 rounded-full border-t-2 border-r-2 border-pink-400/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 rounded-full border-b-2 border-l-2 border-purple-400/30"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full shadow-[0_0_30px_rgba(217,70,239,0.5)]"
            >
              <Crown className="w-12 h-12 text-white drop-shadow-md" />
            </motion.div>
            
            {/* Floating icons */}
            <motion.div
              animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8"
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6"
            >
              <Heart className="w-8 h-8 text-pink-400" />
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest uppercase mb-2">
            CHUNG SỨC
          </h1>
          <h2 className="text-lg md:text-xl font-bold text-pink-200 tracking-[0.2em] uppercase mb-8">
            Giải Mã Phái Đẹp
          </h2>

          <div className="flex items-center gap-2 text-pink-100/80 font-medium">
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 rounded-full bg-pink-400"
            />
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-purple-400"
            />
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 rounded-full bg-indigo-400"
            />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        revealAnswer,
        addStrike,
        clearStrikes,
        awardPoints,
        nextQuestion,
        prevQuestion,
        updateTeam,
        updateQuestion,
        addQuestion,
        deleteQuestion,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

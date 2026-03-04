'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from './GameProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Gem, Heart, Star, Sparkles, Flower2, Eye, EyeOff, Clock, Flame } from 'lucide-react';

// Re-use the theme generator from GameBoard
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

export default function MCPanel() {
  const { gameState, revealAnswer, nextQuestion } = useGame();
  const { questions, currentQuestionIndex, teams, tempScore, strikes, showStrike } = gameState;
  const currentQuestion = questions[currentQuestionIndex];
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    if (gameState.timerStartedAt) {
      const interval = setInterval(() => setCurrentTime(Date.now()), 100);
      return () => clearInterval(interval);
    }
  }, [gameState.timerStartedAt]);

  const displayTime = gameState.timerStartedAt 
    ? Math.max(0, (gameState.timerDuration || 30) - Math.floor((currentTime - gameState.timerStartedAt) / 1000))
    : (gameState.timerDuration || 30);

  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-full min-h-[50vh] bg-slate-900 text-white text-2xl">Chưa có câu hỏi nào</div>;
  }

  return (
    <div className="min-h-full bg-slate-900 text-slate-100 p-4 md:p-8 font-sans overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Màn Hình MC</h1>
            <div className="text-slate-400 text-sm flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-700 rounded text-xs font-medium uppercase tracking-wider">
                {currentQuestion.isSuddenDeath ? 'Sudden Death' : `Vòng ${currentQuestion.round}`}
              </span>
              {!currentQuestion.isSuddenDeath && (
                <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 rounded text-xs font-medium uppercase tracking-wider border border-indigo-700/50">
                  Hệ số: x{currentQuestion.multiplier}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Điểm Tích Lũy</span>
              <span className="text-3xl font-black text-yellow-400">{tempScore}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Thời gian</span>
              <div className={`flex items-center gap-2 text-2xl font-black ${displayTime <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                <Clock className="w-6 h-6" />
                {displayTime}s
              </div>
            </div>
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex >= questions.length - 1}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-bold transition-colors shadow-lg"
            >
              Câu Tiếp Theo
            </button>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-2xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          {currentQuestion.isSuddenDeath && (
            <div className="absolute top-4 right-4 flex items-center gap-2 text-rose-400 bg-rose-950/50 px-3 py-1 rounded-full border border-rose-500/30">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Câu hỏi phụ</span>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 relative z-10">
            {currentQuestion.text}
          </h2>
          {currentQuestion.textEn && (
            <h3 className="text-xl md:text-2xl font-medium text-pink-200/80 italic relative z-10">
              {currentQuestion.textEn}
            </h3>
          )}
        </div>

        {/* Answers Grid for MC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer, index) => {
            const theme = getAnswerTheme(index);
            
            return (
              <div 
                key={answer.id} 
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col ${
                  answer.revealed 
                    ? `bg-white ${theme.border} shadow-[0_0_15px_rgba(255,255,255,0.1)]` 
                    : 'bg-slate-800 border-slate-600 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Status Indicator Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase tracking-wider z-10 flex items-center gap-1 ${
                  answer.revealed 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {answer.revealed ? (
                    <><Eye className="w-3 h-3" /> Đã mở</>
                  ) : (
                    <><EyeOff className="w-3 h-3" /> Đang ẩn</>
                  )}
                </div>

                <div className="flex h-full min-h-[5rem]">
                  {/* Rank Number */}
                  <div className={`flex items-center justify-center w-16 ${
                    answer.revealed ? `bg-gradient-to-br ${theme.gradient}` : 'bg-slate-700'
                  }`}>
                    {answer.revealed ? (
                      theme.icon
                    ) : (
                      <span className="text-2xl font-bold text-slate-400">{index + 1}</span>
                    )}
                  </div>

                  {/* Answer Content */}
                  <div className="flex-grow p-4 flex flex-col justify-center pr-24">
                    <div className={`text-xl font-bold uppercase ${
                      answer.revealed ? theme.text : 'text-slate-300'
                    }`}>
                      {answer.text}
                    </div>
                    {answer.textEn && (
                      <div className={`text-sm italic ${
                        answer.revealed ? `${theme.text} opacity-80` : 'text-slate-500'
                      }`}>
                        {answer.textEn}
                      </div>
                    )}
                  </div>

                  {/* Points */}
                  <div className={`absolute right-0 top-0 bottom-0 w-20 flex flex-col items-center justify-center border-l ${
                    answer.revealed ? `bg-gradient-to-br ${theme.gradient} border-white/50 text-white` : 'bg-slate-700/50 border-slate-600 text-slate-400'
                  }`}>
                    <span className="text-2xl font-black">{answer.points}</span>
                  </div>
                </div>
                
                {/* Reveal Button */}
                {!answer.revealed && (
                  <button
                    onClick={() => revealAnswer(currentQuestion.id, answer.id)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-wider transition-colors border-t border-indigo-700"
                  >
                    Lật đáp án
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Teams Status (Optional for MC to keep track) */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <h3 className="text-lg font-bold text-slate-300 mb-4 uppercase tracking-wider">Trạng thái các đội</h3>
          <div className={`grid gap-4 grid-cols-1 ${
            {
              2: 'sm:grid-cols-2',
              3: 'sm:grid-cols-3',
              4: 'sm:grid-cols-4',
              5: 'sm:grid-cols-5',
            }[gameState.numberOfTeams || 2] || 'sm:grid-cols-2'
          }`}>
            {teams.slice(0, gameState.numberOfTeams || 2).map(team => (
              <div key={team.id} className={`p-4 rounded-xl border ${
                gameState.controllingTeamId === team.id 
                  ? 'bg-yellow-900/30 border-yellow-500/50' 
                  : gameState.isStealing && gameState.stealingTeamId === team.id
                    ? 'bg-orange-900/30 border-orange-500/50'
                    : 'bg-slate-800 border-slate-700'
              }`}>
                <div className="text-sm text-slate-400 mb-1">{team.name}</div>
                <div className="text-2xl font-bold text-white">{team.score}</div>
                {gameState.controllingTeamId === team.id && (
                  <div className="text-xs text-yellow-400 mt-2 uppercase tracking-wider font-bold">Đang kiểm soát</div>
                )}
                {gameState.isStealing && gameState.stealingTeamId === team.id && (
                  <div className="text-xs text-orange-400 mt-2 uppercase tracking-wider font-bold">Đang cướp điểm</div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

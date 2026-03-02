'use client';

import React from 'react';
import { useGame } from './GameProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Star } from 'lucide-react';

export default function Leaderboard() {
  const { gameState } = useGame();
  
  // Sort teams by score descending
  const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 to-purple-950 overflow-hidden font-sans p-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none"></div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="z-10 text-center mb-12"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider uppercase">
          {gameState.programName || 'BẢNG XẾP HẠNG'}
          {gameState.programNameEn && <span className="text-2xl md:text-4xl ml-4 opacity-80">- {gameState.programNameEn}</span>}
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mt-4">
          {gameState.programTheme || 'Giải Mã Phái Đẹp'}
          {gameState.programThemeEn && <span className="opacity-80 ml-2">- {gameState.programThemeEn}</span>}
        </h2>
      </motion.div>

      <div className="z-10 w-full max-w-4xl flex flex-col gap-6">
        <AnimatePresence mode="popLayout">
          {sortedTeams.map((team, index) => {
            // Determine styling based on rank
            let cardStyle = "bg-white/10 border-white/20 text-white";
            let rankIcon = <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 text-xl font-bold">{index + 1}</div>;
            
            if (index === 0) {
              cardStyle = "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/50 text-yellow-100 shadow-[0_0_30px_rgba(250,204,21,0.3)]";
              rankIcon = <Medal className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
            } else if (index === 1) {
              cardStyle = "bg-gradient-to-r from-slate-300/20 to-slate-400/20 border-slate-300/50 text-slate-100";
              rankIcon = <Medal className="w-12 h-12 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" />;
            }

            return (
              <motion.div
                layout
                key={team.id}
                initial={{ x: -50, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: index === 0 ? 1.05 : 1 }}
                exit={{ x: 50, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                className={`flex items-center justify-between p-6 rounded-2xl border-2 backdrop-blur-sm ${cardStyle}`}
              >
                <div className="flex items-center gap-6">
                  <motion.div 
                    layout="position"
                    className="flex-shrink-0"
                  >
                    {rankIcon}
                  </motion.div>
                  <motion.div layout="position">
                    <h3 className="text-3xl font-bold uppercase tracking-wide mb-1">{team.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member, mIdx) => (
                        <span key={mIdx} className="text-sm px-2 py-1 rounded bg-black/20 text-white/80">
                          {mIdx === 0 ? <Star className="w-3 h-3 inline mr-1 text-yellow-400" /> : null}
                          {member}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  key={team.score}
                  initial={{ scale: 1.5, color: '#4ade80' }}
                  animate={{ scale: 1, color: index === 0 ? '#fef08a' : '#ffffff' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="text-6xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                >
                  {team.score}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Play, Award, Zap, UserCheck, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { UserStats } from '../types';

interface HomeScreenProps {
  stats: UserStats;
  onUpdateName: (name: string) => void;
  onStartQuiz: () => void;
  onOpenStats: () => void;
  onOpenMiniGame?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  onUpdateName,
  onStartQuiz,
  onOpenStats,
  onOpenMiniGame,
}) => {
  const [inputName, setInputName] = useState(stats.playerName || '');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = () => {
    soundEngine.playButtonClick();
    if (!inputName.trim()) {
      setErrorMsg('Please enter your player name to start!');
      return;
    }
    setErrorMsg('');
    onUpdateName(inputName.trim());
    onStartQuiz();
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 overflow-hidden bg-transparent text-[#3b1d0c]">
      {/* Background Floating Y2K Graphic Elements */}
      <div className="absolute top-10 left-8 text-4xl opacity-40 pointer-events-none select-none">
        ✨
      </div>
      <div className="absolute top-1/4 right-10 text-5xl opacity-40 pointer-events-none select-none">
        🎮
      </div>
      <div className="absolute bottom-16 left-12 text-5xl opacity-40 pointer-events-none select-none">
        🌟
      </div>
      <div className="absolute bottom-20 right-16 text-4xl opacity-40 pointer-events-none select-none">
        🎉
      </div>

      <div className="w-full max-w-lg z-10 space-y-6 text-center">
        {/* Main Logo & Title Hero Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 shadow-2xl relative"
        >
          {/* Top Decorative Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#fef08a] border-2 border-[#78350f] text-[#78350f] font-extrabold text-xs mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#854d0e] animate-spin" />
            ULTIMATE TRIVIA CHALLENGE
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-black uppercase leading-[0.9]">
            QUIZ<span className="text-[#854d0e]">TOPIA</span> <span className="text-[#eab308] inline-block animate-bounce">✨</span>
          </h1>

          <p className="text-[#78350f] font-serif italic text-base sm:text-lg mt-3 font-bold">
            "Enter a world of quizzes."
          </p>

          <p className="text-gray-700 text-xs sm:text-sm mt-3 leading-relaxed max-w-md mx-auto font-medium">
            Test your knowledge across <span className="font-extrabold text-[#78350f]">Anime</span>,{' '}
            <span className="font-extrabold text-black">Marvel</span>,{' '}
            <span className="font-extrabold text-[#854d0e]">Football</span>,{' '}
            <span className="font-extrabold text-[#374151]">Music</span>, and{' '}
            <span className="font-extrabold text-[#b45309]">Flags</span> with timed challenges & rewards!
          </p>

          {/* Player Name Entry Box */}
          <div className="mt-6 space-y-2.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#78350f] uppercase tracking-wider">
                ENTER YOUR PLAYER NAME:
              </label>
              <span className="text-[10px] font-mono font-bold text-[#854d0e] uppercase">REQUIRED</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStart();
                }}
                placeholder="e.g. AlexTheGamer, AnimeKing..."
                maxLength={20}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#fdf2f8] border-3 border-[#78350f]/40 focus:border-[#78350f] focus:bg-white text-black font-extrabold text-base outline-none transition-all placeholder:text-gray-400 shadow-inner"
              />
              {inputName && (
                <UserCheck className="absolute right-3.5 top-3.5 w-5 h-5 text-[#854d0e]" />
              )}
            </div>
            {errorMsg && (
              <p className="text-xs font-extrabold text-rose-600 animate-pulse">{errorMsg}</p>
            )}
          </div>

          {/* Start Button & Mini-game Button */}
          <div className="mt-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="w-full py-4 px-8 bg-[#fde047] hover:bg-[#facc15] text-[#3b1d0c] font-black text-xl rounded-2xl border-4 border-[#78350f] flex items-center justify-center gap-3 cursor-pointer shadow-lg tracking-wider transition-all"
            >
              <Play className="w-6 h-6 fill-current text-[#78350f]" />
              PLAY NOW !!!!
            </motion.button>

            {onOpenMiniGame && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundEngine.playButtonClick();
                  onOpenMiniGame();
                }}
                className="w-full py-3 px-6 bg-[#fef08a] hover:bg-[#fde047] text-black font-black text-sm sm:text-base rounded-2xl border-3 border-[#78350f] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-700 animate-spin" />
                🎰 PLAY LUCKY PRIZE MINI-GAME (SPIN & WIN!) 🎁
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Quick Stats Summary Footer Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-3 border-[#78350f] hover:border-black rounded-2xl p-4 shadow-lg flex items-center justify-between text-left cursor-pointer transition-all"
          onClick={() => {
            soundEngine.playButtonClick();
            onOpenStats();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fef08a] border-2 border-[#78350f] flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <div className="text-xs font-black text-[#78350f] uppercase">
                YOUR PROGRESS
              </div>
              <div className="text-sm font-extrabold text-black">
                {stats.winsCount} Total Wins • {stats.totalScore} PTS
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-black text-[#78350f] uppercase tracking-wider">
            <span>VIEW STATS</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

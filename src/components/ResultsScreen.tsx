import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Trophy, CheckCircle, XCircle, Award, Sparkles, ChevronRight } from 'lucide-react';
import { QuizRoundResult, UserStats } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface ResultsScreenProps {
  result: QuizRoundResult;
  stats: UserStats;
  onTryAgain: () => void;
  onNavigateHome: () => void;
  onOpenStats: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  stats,
  onTryAgain,
  onNavigateHome,
  onOpenStats,
}) => {
  const accuracyPercent = Math.round((result.correctCount / result.totalQuestions) * 100);
  const isWin = result.winsEarned > 0;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-transparent text-[#3b1d0c] p-4 sm:p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-xl relative"
      >
        {/* Result Header Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fef08a] border-2 border-[#78350f] text-[#78350f] font-black text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-[#854d0e]" />
            ROUND COMPLETED
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight uppercase">
            {isWin ? 'VICTORY! 🏆' : 'QUIZ COMPLETE 🎯'}
          </h2>

          <p className="text-xs font-black text-[#78350f]">
            PLAYER: <span className="text-black font-extrabold">{stats.playerName}</span>
          </p>
        </div>

        {/* Score & Accuracy Box */}
        <div className="bg-[#fde047] border-3 border-[#78350f] rounded-3xl p-6 text-[#3b1d0c] shadow-md space-y-3">
          <div className="text-xs font-black text-[#78350f] uppercase tracking-widest">
            FINAL ROUND SCORE
          </div>
          <div className="text-5xl font-black text-black tracking-tight">
            +{result.score} <span className="text-xl font-black text-[#78350f]">PTS</span>
          </div>

          <div className="flex items-center justify-center gap-4 pt-3 border-t-2 border-[#78350f]/20 text-xs font-black">
            <div className="flex items-center gap-1 text-emerald-800">
              <CheckCircle className="w-4 h-4" /> {result.correctCount} Correct
            </div>
            <div className="flex items-center gap-1 text-rose-800">
              <XCircle className="w-4 h-4" /> {result.incorrectCount} Incorrect
            </div>
            <div className="text-[#78350f]">{accuracyPercent}% Accuracy</div>
          </div>
        </div>

        {/* Details Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-[#fdf2f8] border-2 border-[#78350f]/30 rounded-2xl p-3">
            <div className="text-[9px] font-black text-[#78350f] uppercase tracking-widest">CATEGORY</div>
            <div className="text-sm font-black text-black truncate uppercase">{result.category}</div>
          </div>

          <div className="bg-[#fdf2f8] border-2 border-[#78350f]/30 rounded-2xl p-3">
            <div className="text-[9px] font-black text-[#78350f] uppercase tracking-widest">DIFFICULTY</div>
            <div className="text-sm font-black text-black uppercase">
              {result.difficulty.replace('_', ' ')}
            </div>
          </div>

          <div className="bg-[#fef08a] border-2 border-[#78350f] rounded-2xl p-3 col-span-2 flex items-center justify-between">
            <div>
              <div className="text-[9px] font-black text-[#78350f] uppercase tracking-widest">
                WINS RECORDED
              </div>
              <div className="text-sm font-black text-black">
                +{result.winsEarned} Win ({stats.winsCount} Total Session Wins)
              </div>
            </div>
            <Trophy className="w-6 h-6 text-[#854d0e]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onTryAgain();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#fde047] hover:bg-[#facc15] border-3 border-[#78350f] text-[#3b1d0c] font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all tracking-wider uppercase"
          >
            <RotateCcw className="w-5 h-5 text-[#78350f]" /> TRY AGAIN
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onNavigateHome();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-gray-100 border-2 border-[#78350f] text-[#3b1d0c] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all uppercase"
            >
              <Home className="w-4 h-4 text-[#854d0e]" /> Home
            </button>

            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onOpenStats();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#fef08a] hover:bg-[#fde047] border-2 border-[#78350f] text-[#78350f] font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all uppercase"
            >
              <Award className="w-4 h-4 text-[#854d0e]" /> View Stats
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

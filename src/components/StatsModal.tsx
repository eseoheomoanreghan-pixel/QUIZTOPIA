import React from 'react';
import { motion } from 'motion/react';
import { X, Trophy, Award, Package, Flame, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserStats } from '../types';
import { CATEGORIES, DIFFICULTIES } from '../data/categoriesAndDifficulties';
import { ALL_STICKERS, ALL_BADGES } from '../data/stickersAndBadges';
import { soundEngine } from '../utils/soundEngine';

interface StatsModalProps {
  stats: UserStats;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose, onResetStats }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-3xl bg-[#141414] border border-white/10 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative text-[#e5e5e5]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                PROGRESS & METRICS
              </h2>
              <p className="text-xs font-mono text-white/50">
                PLAYER: <span className="text-blue-400 font-bold">{stats.playerName || 'Guest'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
            <div className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">TOTAL SCORE</div>
            <div className="text-2xl font-black text-white">{stats.totalScore}</div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-center">
            <div className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">TOTAL WINS</div>
            <div className="text-2xl font-black text-amber-400">🏆 {stats.winsCount}</div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">GAMES PLAYED</div>
            <div className="text-2xl font-black text-white">{stats.gamesPlayed}</div>
          </div>
        </div>

        {/* Unlocked Power-ups Inventory */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-400" />
            POWER-UPS INVENTORY
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {stats.unlockedRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-sm"
              >
                <div className="text-2xl">{reward.icon}</div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-xs font-bold text-white truncate">{reward.name}</div>
                  <div className="text-[10px] text-white/50 font-mono">
                    QTY: <span className="text-blue-400 font-bold">{reward.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collected Stickers & Badges */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            COLLECTED STICKERS & BADGES
          </h3>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-3">
            <div>
              <div className="text-[10px] font-mono text-white/50 mb-1.5 uppercase font-bold">
                STICKERS ({(stats.unlockedStickers || []).length}/{ALL_STICKERS.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_STICKERS.map((stk) => {
                  const has = (stats.unlockedStickers || []).includes(stk.id);
                  return (
                    <div
                      key={stk.id}
                      title={stk.name}
                      className={`text-xl p-2 rounded-xl border ${
                        has
                          ? 'bg-amber-400/20 border-amber-400/50 opacity-100'
                          : 'bg-white/5 border-white/10 opacity-30 grayscale'
                      }`}
                    >
                      {stk.emoji}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-white/50 mb-1.5 uppercase font-bold">
                BADGES ({(stats.unlockedBadges || []).length}/{ALL_BADGES.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_BADGES.map((bdg) => {
                  const has = (stats.unlockedBadges || []).includes(bdg.id);
                  return (
                    <div
                      key={bdg.id}
                      title={bdg.title}
                      className={`text-lg p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                        has
                          ? 'bg-rose-500/20 border-rose-500/50 text-white opacity-100'
                          : 'bg-white/5 border-white/10 text-white/30 opacity-30 grayscale'
                      }`}
                    >
                      <span>{bdg.icon}</span>
                      <span className="text-[10px]">{bdg.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Wins by Category Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            WINS BY CATEGORY
          </h3>

          <div className="space-y-1 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs font-mono">
            {CATEGORIES.map((cat) => {
              const wins = stats.categoryWins[cat.id] || 0;
              return (
                <div key={cat.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2 text-white/80">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                  <span className="bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 text-blue-400 font-bold">
                    {wins} {wins === 1 ? 'win' : 'wins'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wins by Difficulty Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            WINS BY DIFFICULTY
          </h3>

          <div className="space-y-1 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs font-mono">
            {DIFFICULTIES.map((diff) => {
              const wins = stats.difficultyWins[diff.id] || 0;
              return (
                <div key={diff.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-white/80 font-bold uppercase">{diff.name}</span>
                  <span className="bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 text-blue-400 font-bold">
                    {wins} {wins === 1 ? 'win' : 'wins'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Progress Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all quiz progress and scores?')) {
                soundEngine.playButtonClick();
                onResetStats();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all uppercase"
          >
            <Trash2 className="w-4 h-4" /> RESET SESSION STATS
          </button>
        </div>
      </motion.div>
    </div>
  );
};

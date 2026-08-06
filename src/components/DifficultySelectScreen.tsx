import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Zap, Flame, ShieldAlert, ChevronRight } from 'lucide-react';
import { DIFFICULTIES, CATEGORIES } from '../data/categoriesAndDifficulties';
import { CategoryId, DifficultyId } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface DifficultySelectScreenProps {
  categoryId: CategoryId;
  customTopic?: string;
  onSelectDifficulty: (difficultyId: DifficultyId) => void;
  onBackToCategory: () => void;
}

export const DifficultySelectScreen: React.FC<DifficultySelectScreenProps> = ({
  categoryId,
  customTopic,
  onSelectDifficulty,
  onBackToCategory,
}) => {
  const currentCategory = CATEGORIES.find((c) => c.id === categoryId);
  const categoryName = customTopic
    ? `Custom AI: ${customTopic}`
    : currentCategory?.name || categoryId;
  const categoryIcon = customTopic ? '🤖' : currentCategory?.icon || '🎯';

  return (
    <div className="min-h-[calc(100vh-65px)] bg-transparent text-[#3b1d0c] p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onBackToCategory();
            }}
            className="px-4 py-2 rounded-xl bg-white border-2 border-[#78350f] text-[#3b1d0c] font-black text-xs flex items-center gap-1.5 hover:bg-[#fde047] transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> CHANGE CATEGORY
          </button>
          <div className="text-xs font-black text-[#78350f] bg-[#fef08a] px-3.5 py-1 rounded-full border-2 border-[#78350f] uppercase tracking-wider">
            STEP 02 / 02
          </div>
        </div>

        {/* Selected Category Banner */}
        <div className="bg-white border-3 border-[#78350f] rounded-2xl p-4 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#fef08a] border-2 border-[#78350f] flex items-center justify-center text-2xl shadow-sm">
            {categoryIcon}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-[#78350f]">
              SELECTED DOMAIN
            </div>
            <div className="text-lg font-black text-black uppercase">{categoryName}</div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
            CHOOSE YOUR <span className="text-[#854d0e]">MODE</span> ⚡
          </h2>
          <p className="text-[#78350f] font-serif italic text-sm font-bold">
            Select a difficulty level to determine question complexity and timer speed!
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 gap-4">
          {DIFFICULTIES.map((diff) => (
            <motion.div
              key={diff.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playButtonClick();
                onSelectDifficulty(diff.id);
              }}
              className="bg-white border-3 border-[#78350f] hover:border-black rounded-3xl p-5 cursor-pointer flex items-center justify-between group transition-all shadow-lg"
            >
              <div className="flex items-center gap-4">
                {/* Dot / Badge Icon */}
                <div
                  className="w-12 h-12 rounded-2xl bg-[#fdf2f8] border-2 border-[#78350f]/30 text-black flex items-center justify-center text-xl font-black shadow-sm group-hover:border-[#78350f]"
                >
                  {diff.id === 'very_easy' && '🟢'}
                  {diff.id === 'easy' && '🔵'}
                  {diff.id === 'medium' && '🟠'}
                  {diff.id === 'hard' && '🔴'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl text-black group-hover:text-[#854d0e] transition-colors uppercase tracking-tight">
                      {diff.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-700 font-bold mt-0.5">{diff.description}</p>
                </div>
              </div>

              {/* Timer Pill & Action */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 bg-[#fef08a] border border-[#78350f] px-3 py-1.5 rounded-xl text-xs font-black text-[#78350f]">
                  <Clock className="w-4 h-4 text-[#854d0e]" />
                  {diff.timeSeconds}s Timer
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#fde047] border-2 border-[#78350f] text-[#78350f] group-hover:bg-[#facc15] flex items-center justify-center transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

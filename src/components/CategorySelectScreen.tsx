import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Bot, Wand2, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/categoriesAndDifficulties';
import { CategoryId } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CategorySelectScreenProps {
  onSelectCategory: (categoryId: CategoryId, customTopic?: string) => void;
  onBackToHome: () => void;
}

export const CategorySelectScreen: React.FC<CategorySelectScreenProps> = ({
  onSelectCategory,
  onBackToHome,
}) => {
  const [customTopicInput, setCustomTopicInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopicInput.trim()) return;
    soundEngine.playButtonClick();
    onSelectCategory('custom', customTopicInput.trim());
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-transparent text-[#3b1d0c] p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-6">
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onBackToHome();
            }}
            className="px-4 py-2 rounded-xl bg-white border-2 border-[#78350f] text-[#3b1d0c] font-black text-xs flex items-center gap-1.5 hover:bg-[#fde047] transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> BACK TO HOME
          </button>
          <div className="text-xs font-black text-[#78350f] bg-[#fef08a] px-3.5 py-1 rounded-full border-2 border-[#78350f] uppercase tracking-wider">
            STEP 01 / 02
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
            CHOOSE YOUR <span className="text-[#854d0e]">CATEGORY</span>
          </h2>
          <p className="text-[#78350f] font-serif italic text-sm font-bold">
            Select a quiz domain or type a custom topic to generate dynamic AI questions!
          </p>
        </div>

        {/* Custom AI Topic Banner Box */}
        <div className="bg-white border-4 border-[#78350f] rounded-3xl p-5 text-[#3b1d0c] shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fef08a] border-2 border-[#78350f] flex items-center justify-center text-2xl shadow-sm">
                🤖
              </div>
              <div>
                <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-tight text-black">
                  <span>Custom AI Topic Generator</span>
                  <span className="bg-[#fde047] text-[#78350f] border border-[#78350f] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    GEMINI AI
                  </span>
                </h3>
                <p className="text-xs text-gray-700 font-medium">
                  Type ANY topic (e.g., Roblox, K-Pop, Fortnite, Harry Potter) to generate a custom quiz!
                </p>
              </div>
            </div>

            <form onSubmit={handleCustomSubmit} className="w-full md:w-auto flex items-center gap-2">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="Type any topic..."
                className="px-4 py-2.5 rounded-xl bg-[#fdf2f8] text-black font-extrabold text-sm outline-none placeholder:text-gray-400 w-full md:w-56 shadow-inner border-2 border-[#78350f]/40 focus:border-[#78350f]"
              />
              <button
                type="submit"
                disabled={!customTopicInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#fde047] hover:bg-[#facc15] text-[#3b1d0c] font-black text-xs uppercase tracking-wider transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-md border-2 border-[#78350f]"
              >
                <Wand2 className="w-4 h-4 text-[#78350f]" /> PLAY AI TOPIC
              </button>
            </form>
          </div>
        </div>

        {/* 6 Grid Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playButtonClick();
                onSelectCategory(cat.id);
              }}
              className="bg-white border-3 border-[#78350f] hover:border-black rounded-3xl p-5 cursor-pointer flex flex-col justify-between group transition-all shadow-lg"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fdf2f8] border-2 border-[#78350f]/30 flex items-center justify-center text-2xl shadow-sm group-hover:border-[#78350f] group-hover:scale-105 transition-all">
                    {cat.icon}
                  </div>
                </div>

                {/* Name & Description */}
                <h3 className="font-black text-xl text-black group-hover:text-[#854d0e] transition-colors uppercase tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-700 font-medium mt-1 leading-relaxed">
                  {cat.description}
                </p>

                {/* Topics Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cat.topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold bg-[#fdf2f8] text-[#78350f] border border-[#78350f]/20 px-2 py-0.5 rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Pill */}
              <div className="mt-4 pt-3 border-t-2 border-[#78350f]/10 flex items-center justify-between text-xs font-black text-[#78350f] group-hover:text-black">
                <span>SELECT CATEGORY</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

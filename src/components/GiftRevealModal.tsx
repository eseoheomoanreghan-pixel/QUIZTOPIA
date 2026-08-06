import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Check, X, Sparkles, Trophy } from 'lucide-react';
import { Reward, RewardType } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface GiftRevealModalProps {
  rewardToReveal: Reward;
  onClaim: (reward: Reward) => void;
  onDecline: () => void;
}

export const GiftRevealModal: React.FC<GiftRevealModalProps> = ({
  rewardToReveal,
  onClaim,
  onDecline,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [isExploded, setIsExploded] = useState(false);

  const handleBoxTap = () => {
    if (isExploded) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    soundEngine.playGiftTap(nextCount);

    if (nextCount >= 3) {
      setIsExploded(true);
      soundEngine.playGiftExplode();
      // Grand Confetti Explosion
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl p-6 sm:p-8 bg-[#141414] border border-white/10 text-center shadow-2xl relative overflow-hidden text-[#e5e5e5]"
      >
        {!isExploded ? (
          /* Gift Box State (Tapping phase 1, 2, 3) */
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold text-[10px] tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              MILESTONE REWARD UNLOCKED
            </div>

            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              MYSTERY GIFT BOX 🎁
            </h2>

            <p className="text-white/60 font-serif italic text-sm animate-pulse">
              "Tap the gift box to reveal your gift!"
            </p>

            {/* Interactive Gift Box Button */}
            <motion.div
              animate={{
                rotate: tapCount === 1 ? [-5, 5, -5, 0] : tapCount === 2 ? [-12, 12, -12, 0] : 0,
                scale: tapCount === 1 ? 1.05 : tapCount === 2 ? 1.15 : 1,
              }}
              transition={{ duration: 0.2 }}
              onClick={handleBoxTap}
              className="w-40 h-40 mx-auto bg-blue-600/10 hover:bg-blue-600/20 rounded-3xl border border-blue-500/40 flex flex-col items-center justify-center cursor-pointer shadow-2xl relative group hover:scale-105 active:scale-95 transition-all"
            >
              <Gift className="w-20 h-20 text-blue-400 drop-shadow-lg animate-bounce" />

              {/* Progress Indicator Dots */}
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full border border-blue-400/50 ${
                      tapCount >= step ? 'bg-blue-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            <p className="text-xs font-mono font-bold text-white/50 uppercase tracking-wider">
              {3 - tapCount} {3 - tapCount === 1 ? 'TAP' : 'TAPS'} REMAINING!
            </p>
          </div>
        ) : (
          /* Exploded State - Revealed Reward with Claim / Decline */
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-5"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-5xl shadow-xl animate-bounce">
              {rewardToReveal.icon}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                YOU REVEALED
              </span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                {rewardToReveal.name}
              </h2>
              <p className="text-xs font-bold text-white/70 bg-white/5 p-3 rounded-2xl border border-white/10">
                {rewardToReveal.description}
              </p>
            </div>

            {/* Claim / Decline Choice Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onClaim(rewardToReveal);
                }}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white font-mono font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 active:scale-95 transition-all uppercase"
              >
                <Check className="w-5 h-5" /> CLAIM
              </button>

              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onDecline();
                }}
                className="py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/70 font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all uppercase"
              >
                <X className="w-4 h-4" /> DECLINE
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

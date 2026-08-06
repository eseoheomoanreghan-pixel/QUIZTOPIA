import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  Gift,
  ArrowLeft,
  RotateCw,
  Zap,
  HelpCircle,
  Clock,
  Smile,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { UserStats, Reward } from '../types';
import { ALL_STICKERS, ALL_BADGES, StickerItem, BadgeItem } from '../data/stickersAndBadges';
import { soundEngine } from '../utils/soundEngine';

interface PrizeMiniGameScreenProps {
  stats: UserStats;
  onUpdateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

interface PrizeResult {
  type: 'hints' | 'extra_time' | 'skip' | 'sticker' | 'badge' | 'points';
  title: string;
  description: string;
  icon: string;
  item?: StickerItem | BadgeItem;
}

export const PrizeMiniGameScreen: React.FC<PrizeMiniGameScreenProps> = ({
  stats,
  onUpdateStats,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'spin' | 'boxes' | 'collection'>('spin');
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<PrizeResult | null>(null);

  // Mystery Box State
  const [openedBoxIndex, setOpenedBoxIndex] = useState<number | null>(null);
  const [boxPrize, setBoxPrize] = useState<PrizeResult | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState(false);

  const tokens = stats.miniGameTokens ?? 3;

  // Possible Wheel Prizes
  const WHEEL_SECTORS = [
    { title: '+3 Hints', icon: '💡', type: 'hints', color: 'bg-amber-400 text-amber-950' },
    { title: 'Rare Sticker', icon: '🎨', type: 'sticker', color: 'bg-purple-400 text-purple-950' },
    { title: '+15s Time', icon: '⏳', type: 'extra_time', color: 'bg-sky-400 text-sky-950' },
    { title: 'Badge Unlock', icon: '🏆', type: 'badge', color: 'bg-rose-400 text-rose-950' },
    { title: '+2 Skips', icon: '⚡', type: 'skip', color: 'bg-emerald-400 text-emerald-950' },
    { title: '+500 XP', icon: '⭐', type: 'points', color: 'bg-yellow-300 text-yellow-950' },
  ];

  const handleSpinWheel = () => {
    if (isSpinning) return;

    soundEngine.playButtonClick();
    setIsSpinning(true);
    setWonPrize(null);

    // Pick random prize index
    const randomIndex = Math.floor(Math.random() * WHEEL_SECTORS.length);
    const sector = WHEEL_SECTORS[randomIndex];

    // Calculate rotation: at least 5 full spins (1800 deg) + sector slice angle
    const degreesPerSlice = 360 / WHEEL_SECTORS.length;
    const extraDegrees = 360 - randomIndex * degreesPerSlice - degreesPerSlice / 2;
    const newRotation = wheelRotation + 1800 + extraDegrees;

    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      soundEngine.playGiftExplode();

      // Grant Prize logic
      let prizeDetail: PrizeResult = {
        type: sector.type as any,
        title: sector.title,
        description: '',
        icon: sector.icon,
      };

      onUpdateStats((prev) => {
        const next = { ...prev };
        // Deduct token or keep at 0 if free mode
        if ((next.miniGameTokens ?? 0) > 0) {
          next.miniGameTokens = (next.miniGameTokens ?? 1) - 1;
        }

        if (sector.type === 'hints') {
          prizeDetail.description = 'Added +3 Hints to your inventory powerups!';
          next.unlockedRewards = next.unlockedRewards.map((r) =>
            r.type === 'hints' ? { ...r, quantity: r.quantity + 3 } : r
          );
        } else if (sector.type === 'extra_time') {
          prizeDetail.description = 'Added +2 Extra Time powerups!';
          next.unlockedRewards = next.unlockedRewards.map((r) =>
            r.type === 'extra_time' ? { ...r, quantity: r.quantity + 2 } : r
          );
        } else if (sector.type === 'skip') {
          prizeDetail.description = 'Added +2 Question Skips!';
          next.unlockedRewards = next.unlockedRewards.map((r) =>
            r.type === 'skip' ? { ...r, quantity: r.quantity + 2 } : r
          );
        } else if (sector.type === 'points') {
          prizeDetail.description = 'Earned +500 Bonus XP for your overall score!';
          next.totalScore = (next.totalScore || 0) + 500;
        } else if (sector.type === 'sticker') {
          const currentStickers = prev.unlockedStickers || [];
          const lockedStickers = ALL_STICKERS.filter((s) => !currentStickers.includes(s.id));
          const awardedSticker =
            lockedStickers.length > 0
              ? lockedStickers[Math.floor(Math.random() * lockedStickers.length)]
              : ALL_STICKERS[Math.floor(Math.random() * ALL_STICKERS.length)];

          if (!currentStickers.includes(awardedSticker.id)) {
            next.unlockedStickers = [...currentStickers, awardedSticker.id];
          }
          prizeDetail.title = `${awardedSticker.emoji} ${awardedSticker.name} Sticker`;
          prizeDetail.description = awardedSticker.description;
          prizeDetail.item = awardedSticker;
        } else if (sector.type === 'badge') {
          const currentBadges = prev.unlockedBadges || [];
          const lockedBadges = ALL_BADGES.filter((b) => !currentBadges.includes(b.id));
          const awardedBadge =
            lockedBadges.length > 0
              ? lockedBadges[Math.floor(Math.random() * lockedBadges.length)]
              : ALL_BADGES[Math.floor(Math.random() * ALL_BADGES.length)];

          if (!currentBadges.includes(awardedBadge.id)) {
            next.unlockedBadges = [...currentBadges, awardedBadge.id];
          }
          prizeDetail.title = `${awardedBadge.icon} ${awardedBadge.title} Badge`;
          prizeDetail.description = awardedBadge.description;
          prizeDetail.item = awardedBadge;
        }

        return next;
      });

      setWonPrize(prizeDetail);
    }, 3200);
  };

  const handlePickBox = (boxIdx: number) => {
    if (isOpeningBox || openedBoxIndex !== null) return;

    setIsOpeningBox(true);
    setOpenedBoxIndex(boxIdx);

    soundEngine.playGiftTap(1);
    setTimeout(() => soundEngine.playGiftTap(2), 200);
    setTimeout(() => soundEngine.playGiftTap(3), 400);

    setTimeout(() => {
      soundEngine.playGiftExplode();
      const randomSector = WHEEL_SECTORS[Math.floor(Math.random() * WHEEL_SECTORS.length)];

      let prizeDetail: PrizeResult = {
        type: randomSector.type as any,
        title: randomSector.title,
        description: '',
        icon: randomSector.icon,
      };

      onUpdateStats((prev) => {
        const next = { ...prev };
        if (randomSector.type === 'hints') {
          prizeDetail.description = 'Added +3 Hints to your powerup inventory!';
          next.unlockedRewards = next.unlockedRewards.map((r) =>
            r.type === 'hints' ? { ...r, quantity: r.quantity + 3 } : r
          );
        } else if (randomSector.type === 'extra_time') {
          prizeDetail.description = 'Added +2 Extra Time powerups!';
          next.unlockedRewards = next.unlockedRewards.map((r) =>
            r.type === 'extra_time' ? { ...r, quantity: r.quantity + 2 } : r
          );
        } else if (randomSector.type === 'skip') {
          prizeDetail.description = 'Added +2 Question Skips!';
          next.unlockedRewards = next.unlockedRewards.map((r) =>
            r.type === 'skip' ? { ...r, quantity: r.quantity + 2 } : r
          );
        } else if (randomSector.type === 'points') {
          prizeDetail.description = 'Added +500 Bonus XP to your high score!';
          next.totalScore += 500;
        } else if (randomSector.type === 'sticker') {
          const currentStickers = prev.unlockedStickers || [];
          const lockedStickers = ALL_STICKERS.filter((s) => !currentStickers.includes(s.id));
          const awardedSticker =
            lockedStickers.length > 0
              ? lockedStickers[Math.floor(Math.random() * lockedStickers.length)]
              : ALL_STICKERS[Math.floor(Math.random() * ALL_STICKERS.length)];

          if (!currentStickers.includes(awardedSticker.id)) {
            next.unlockedStickers = [...currentStickers, awardedSticker.id];
          }
          prizeDetail.title = `${awardedSticker.emoji} ${awardedSticker.name} Sticker`;
          prizeDetail.description = awardedSticker.description;
        } else if (randomSector.type === 'badge') {
          const currentBadges = prev.unlockedBadges || [];
          const lockedBadges = ALL_BADGES.filter((b) => !currentBadges.includes(b.id));
          const awardedBadge =
            lockedBadges.length > 0
              ? lockedBadges[Math.floor(Math.random() * lockedBadges.length)]
              : ALL_BADGES[Math.floor(Math.random() * ALL_BADGES.length)];

          if (!currentBadges.includes(awardedBadge.id)) {
            next.unlockedBadges = [...currentBadges, awardedBadge.id];
          }
          prizeDetail.title = `${awardedBadge.icon} ${awardedBadge.title} Badge`;
          prizeDetail.description = awardedBadge.description;
        }
        return next;
      });

      setBoxPrize(prizeDetail);
      setIsOpeningBox(false);
    }, 700);
  };

  const resetBoxGame = () => {
    setOpenedBoxIndex(null);
    setBoxPrize(null);
    setIsOpeningBox(false);
  };

  const unlockedStickersCount = (stats.unlockedStickers || []).length;
  const unlockedBadgesCount = (stats.unlockedBadges || []).length;

  return (
    <div className="min-h-screen bg-transparent text-[#78350f] font-sans pb-16 pt-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onBack();
            }}
            className="flex items-center gap-2 bg-white border-2 border-[#78350f] px-4 py-2 rounded-2xl font-bold text-sm shadow-sm hover:bg-[#fef08a] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#78350f]" />
            Back to Quiz
          </button>

          <div className="flex items-center gap-2 bg-[#fef08a] border-2 border-[#78350f] px-3.5 py-1.5 rounded-full font-black text-xs shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-700 animate-spin" />
            LUCKY ARCADE
          </div>
        </div>

        {/* Title Banner */}
        <div className="bg-white border-4 border-[#78350f] rounded-3xl p-6 shadow-xl text-center relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight">
              🎰 Lucky Prize Arcade 🎁
            </h1>
            <p className="text-sm font-bold text-[#78350f]/80 max-w-md mx-auto">
              Play mini-games to win stickers, exclusive badges, extra hints, and powerups!
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-3">
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  setActiveTab('spin');
                }}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 border-[#78350f] shadow-md transition-all cursor-pointer ${
                  activeTab === 'spin'
                    ? 'bg-[#fef08a] text-black scale-105'
                    : 'bg-white text-[#78350f] opacity-80'
                }`}
              >
                🎡 Spin Prize Wheel
              </button>

              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  setActiveTab('boxes');
                  resetBoxGame();
                }}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 border-[#78350f] shadow-md transition-all cursor-pointer ${
                  activeTab === 'boxes'
                    ? 'bg-[#fef08a] text-black scale-105'
                    : 'bg-white text-[#78350f] opacity-80'
                }`}
              >
                📦 Pick 1 of 3 Mystery Boxes
              </button>

              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  setActiveTab('collection');
                }}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm border-2 border-[#78350f] shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'collection'
                    ? 'bg-[#fef08a] text-black scale-105'
                    : 'bg-white text-[#78350f] opacity-80'
                }`}
              >
                🖼️ Gallery ({unlockedStickersCount + unlockedBadgesCount})
              </button>
            </div>
          </div>
        </div>

        {/* MAIN TAB CONTENT */}
        {activeTab === 'spin' && (
          <div className="bg-white border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
            {/* Tokens Badge */}
            <div className="flex items-center gap-3 bg-[#fef08a] border-2 border-[#78350f] px-5 py-2 rounded-2xl shadow-sm">
              <Gift className="w-5 h-5 text-amber-700 animate-bounce" />
              <span className="font-extrabold text-sm sm:text-base text-black">
                Available Spins: <span className="text-amber-800 font-black">{tokens > 0 ? tokens : 'Free Daily Spins!'}</span>
              </span>
            </div>

            {/* Wheel Container */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Top Pointer Indicator */}
              <div className="absolute -top-3 z-30 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-red-600 drop-shadow-md" />

              {/* Rotating Wheel Circle */}
              <motion.div
                animate={{ rotate: wheelRotation }}
                transition={{ duration: 3, ease: [0.15, 0.85, 0.35, 1] }}
                className="w-full h-full rounded-full border-8 border-[#78350f] relative overflow-hidden shadow-2xl bg-amber-100"
              >
                {WHEEL_SECTORS.map((sec, idx) => {
                  const angle = (360 / WHEEL_SECTORS.length) * idx;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 left-0 w-full h-full origin-center flex justify-center items-center"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: 'polygon(50% 50%, 0 0, 100% 0)',
                      }}
                    >
                      <div
                        className={`w-full h-full ${sec.color} flex flex-col items-center justify-start pt-4 sm:pt-6 font-black text-xs sm:text-sm text-center`}
                      >
                        <span className="text-xl sm:text-2xl">{sec.icon}</span>
                        <span className="mt-1 max-w-[60px] leading-tight drop-shadow-sm">{sec.title}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Wheel Center Peg */}
                <div className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-4 border-[#78350f] shadow-lg flex items-center justify-center font-black text-amber-900 text-xs sm:text-sm z-20">
                  SPIN
                </div>
              </motion.div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`w-full max-w-sm py-4 rounded-2xl font-black text-lg sm:text-xl border-4 border-[#78350f] shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer ${
                isSpinning
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#fef08a] hover:bg-[#fde047] text-black active:scale-95'
              }`}
            >
              <RotateCw className={`w-6 h-6 ${isSpinning ? 'animate-spin text-gray-600' : 'text-amber-800'}`} />
              {isSpinning ? 'Spinning Wheel...' : 'SPIN FOR PRIZES!'}
            </button>

            {/* Prize Reveal Card */}
            <AnimatePresence>
              {wonPrize && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-[#fef08a] border-4 border-[#78350f] rounded-2xl p-6 text-center max-w-md w-full space-y-3 shadow-2xl relative"
                >
                  <div className="text-5xl animate-bounce">{wonPrize.icon}</div>
                  <h3 className="text-2xl font-black text-black uppercase">{wonPrize.title}</h3>
                  <p className="text-sm font-bold text-[#78350f]">{wonPrize.description}</p>
                  <div className="inline-block px-4 py-1.5 bg-white border-2 border-[#78350f] rounded-full text-xs font-black text-emerald-800">
                    🎉 Prize Claimed to Inventory!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 📦 PICK 1 OF 3 MYSTERY GIFT BOXES TAB */}
        {activeTab === 'boxes' && (
          <div className="bg-white border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                🎁 Pick 1 of 3 Mystery Gift Boxes 🎁
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#78350f]">
                Tap any box to unwrap a surprise sticker, badge, hint or bonus XP!
              </p>
            </div>

            {/* 3 Boxes Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl pt-2">
              {[0, 1, 2].map((idx) => {
                const isSelected = openedBoxIndex === idx;
                const isDisabled = isOpeningBox || (openedBoxIndex !== null && !isSelected);

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: isDisabled ? 1 : 1.05, y: isDisabled ? 0 : -6 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                    onClick={() => handlePickBox(idx)}
                    disabled={isDisabled}
                    className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center space-y-3 relative shadow-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-300 border-amber-800 scale-105'
                        : isDisabled
                        ? 'bg-gray-100 border-gray-300 opacity-40 cursor-not-allowed'
                        : 'bg-amber-100 hover:bg-amber-200 border-[#78350f]'
                    }`}
                  >
                    <div className="text-6xl sm:text-7xl animate-pulse">
                      {isSelected ? (boxPrize ? boxPrize.icon : '✨') : '🎁'}
                    </div>

                    <span className="font-black text-sm sm:text-base text-black uppercase">
                      {isSelected ? (boxPrize ? boxPrize.title : 'Unwrapping...') : `BOX #${idx + 1}`}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Revealed Box Prize Details */}
            <AnimatePresence>
              {boxPrize && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-[#fef08a] border-4 border-[#78350f] rounded-2xl p-6 text-center max-w-md w-full space-y-3 shadow-2xl relative"
                >
                  <div className="text-5xl animate-bounce">{boxPrize.icon}</div>
                  <h3 className="text-2xl font-black text-black uppercase">{boxPrize.title}</h3>
                  <p className="text-sm font-bold text-[#78350f]">{boxPrize.description}</p>

                  <button
                    onClick={resetBoxGame}
                    className="mt-3 px-6 py-2.5 rounded-2xl bg-white hover:bg-amber-100 border-2 border-[#78350f] font-black text-xs uppercase text-black shadow-md cursor-pointer transition-all"
                  >
                    🔄 Open Another Box
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* COLLECTION GALLERY TAB */}
        {activeTab === 'collection' && (
          <div className="bg-white border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
            {/* Stickers Collection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#78350f]/20 pb-2">
                <h2 className="text-xl font-black text-black uppercase flex items-center gap-2">
                  🎨 Sticker Collection ({unlockedStickersCount}/{ALL_STICKERS.length})
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ALL_STICKERS.map((stk) => {
                  const isUnlocked = (stats.unlockedStickers || []).includes(stk.id);
                  return (
                    <div
                      key={stk.id}
                      className={`p-4 rounded-2xl border-2 border-[#78350f] flex flex-col items-center justify-center text-center space-y-2 relative shadow-sm transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-amber-50 to-amber-100 opacity-100'
                          : 'bg-gray-100 opacity-50 grayscale'
                      }`}
                    >
                      <div className="text-4xl">{stk.emoji}</div>
                      <span className="font-extrabold text-xs text-black leading-tight">
                        {stk.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#78350f]/30">
                        {isUnlocked ? stk.rarity : 'Locked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Collection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#78350f]/20 pb-2">
                <h2 className="text-xl font-black text-black uppercase flex items-center gap-2">
                  🏆 Badges Showcase ({unlockedBadgesCount}/{ALL_BADGES.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ALL_BADGES.map((bdg) => {
                  const isUnlocked = (stats.unlockedBadges || []).includes(bdg.id);
                  return (
                    <div
                      key={bdg.id}
                      className={`p-4 rounded-2xl border-2 ${bdg.borderBg} flex items-center gap-3.5 shadow-sm transition-all ${
                        isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'
                      }`}
                    >
                      <div className="text-3xl p-2 bg-white border border-[#78350f]/30 rounded-xl shadow-inner">
                        {bdg.icon}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-black text-xs text-black uppercase">{bdg.title}</h4>
                        <p className="text-[10px] text-[#78350f]/80 font-semibold leading-tight">
                          {bdg.description}
                        </p>
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-gray-500">Locked Prize</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

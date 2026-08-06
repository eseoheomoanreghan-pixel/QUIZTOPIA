import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, HelpCircle, FastForward, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Question, DifficultyId, Reward } from '../types';
import { CATEGORIES, DIFFICULTIES } from '../data/categoriesAndDifficulties';
import { soundEngine } from '../utils/soundEngine';

interface GameplayScreenProps {
  playerName: string;
  categoryName: string;
  categoryIcon: string;
  difficultyId: DifficultyId;
  questions: Question[];
  currentQuestionIndex: number;
  unlockedRewards: Reward[];
  onAnswerQuestion: (
    isCorrect: boolean,
    selectedOption: string,
    question: Question,
    timeRemaining: number
  ) => void;
  onUsePowerup: (type: 'extra_time' | 'hints' | 'skip') => void;
  onTimeExpired: () => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  playerName,
  categoryName,
  categoryIcon,
  difficultyId,
  questions,
  currentQuestionIndex,
  unlockedRewards,
  onAnswerQuestion,
  onUsePowerup,
  onTimeExpired,
}) => {
  const diffInfo = DIFFICULTIES.find((d) => d.id === difficultyId) || DIFFICULTIES[1];
  const initialTime = diffInfo.timeSeconds;

  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [isAnsweringLocked, setIsAnsweringLocked] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  // Reset timer and state whenever currentQuestionIndex changes
  useEffect(() => {
    setTimeRemaining(initialTime);
    setDisabledOptions([]);
    setIsAnsweringLocked(false);
  }, [currentQuestionIndex, initialTime]);

  // Powerup counts from inventory
  const extraTimeCount = unlockedRewards.find((r) => r.type === 'extra_time')?.quantity || 0;
  const hintsCount = unlockedRewards.find((r) => r.type === 'hints')?.quantity || 0;
  const skipCount = unlockedRewards.find((r) => r.type === 'skip')?.quantity || 0;

  // Countdown timer effect
  useEffect(() => {
    if (isAnsweringLocked || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnsweringLocked, timeRemaining]);

  // Handle timer expiration & audio cues
  useEffect(() => {
    if (timeRemaining === 0 && !isAnsweringLocked) {
      setIsAnsweringLocked(true);
      soundEngine.playTimerExpired();
      onTimeExpired();
    } else if (timeRemaining > 0 && timeRemaining <= 10 && !isAnsweringLocked) {
      soundEngine.playTimerTick();
    }
  }, [timeRemaining, isAnsweringLocked, onTimeExpired]);

  // Handle Option Click
  const handleSelectOption = (option: string) => {
    if (isAnsweringLocked || disabledOptions.includes(option)) return;
    setIsAnsweringLocked(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    onAnswerQuestion(isCorrect, option, currentQuestion, timeRemaining);
  };

  // Power-up Handlers
  const handleAddExtraTime = () => {
    if (extraTimeCount > 0 && !isAnsweringLocked) {
      soundEngine.playButtonClick();
      setTimeRemaining((prev) => prev + 15);
      onUsePowerup('extra_time');
    }
  };

  const handleUseHint = () => {
    if (hintsCount > 0 && !isAnsweringLocked && disabledOptions.length === 0) {
      soundEngine.playButtonClick();
      const wrongOptions = currentQuestion.options.filter(
        (opt) => opt !== currentQuestion.correctAnswer
      );
      if (wrongOptions.length > 0) {
        setDisabledOptions([wrongOptions[0]]);
        onUsePowerup('hints');
      }
    }
  };

  const handleSkipQuestion = () => {
    if (skipCount > 0 && !isAnsweringLocked) {
      soundEngine.playButtonClick();
      setIsAnsweringLocked(true);
      onUsePowerup('skip');
      onAnswerQuestion(true, currentQuestion.correctAnswer, currentQuestion, timeRemaining);
    }
  };

  const timerPercent = Math.max(0, Math.min(100, (timeRemaining / initialTime) * 100));
  const isTimeCritical = timeRemaining <= 10;

  if (!currentQuestion) return null;

  return (
    <div className="min-h-[calc(100vh-65px)] bg-transparent text-[#3b1d0c] p-4 sm:p-6 flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl space-y-5">
        {/* Top Info Bar */}
        <div className="bg-white border-3 border-[#78350f] rounded-2xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fef08a] border-2 border-[#78350f] flex items-center justify-center text-xl">
              {categoryIcon}
            </div>
            <div>
              <div className="text-xs font-black text-black uppercase tracking-tight">{categoryName}</div>
              <div className="text-[11px] font-mono text-[#78350f] font-bold">
                PLAYER: <span className="text-black font-extrabold">{playerName}</span> • MODE:{' '}
                <span className="uppercase text-[#854d0e] font-extrabold">{diffInfo.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-[#fef08a] text-[#78350f] px-3.5 py-1.5 rounded-full border-2 border-[#78350f]">
              QUESTION {currentQuestionIndex + 1} OF {questions.length}
            </span>
          </div>
        </div>

        {/* Timer Bar & Countdown */}
        <div className="bg-white border-3 border-[#78350f] rounded-2xl p-4 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-1.5 text-[#78350f]">
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600 animate-bounce' : 'text-[#854d0e]'}`} />
              <span>TIME REMAINING</span>
            </div>
            <div
              className={`text-xl font-black ${
                isTimeCritical ? 'text-rose-600 animate-pulse' : 'text-black'
              }`}
            >
              {timeRemaining}s
            </div>
          </div>

          {/* Animated Bar */}
          <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden border-2 border-[#78350f]">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isTimeCritical
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        {/* Power-ups Inventory Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={handleAddExtraTime}
            disabled={extraTimeCount === 0 || isAnsweringLocked}
            className={`px-3.5 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              extraTimeCount > 0
                ? 'bg-[#fef08a] border-[#78350f] text-[#78350f] hover:bg-[#fde047]'
                : 'bg-gray-100 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#854d0e]" />
            +15s Time ({extraTimeCount})
          </button>

          <button
            onClick={handleUseHint}
            disabled={hintsCount === 0 || disabledOptions.length > 0 || isAnsweringLocked}
            className={`px-3.5 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              hintsCount > 0 && disabledOptions.length === 0
                ? 'bg-[#fef08a] border-[#78350f] text-[#78350f] hover:bg-[#fde047]'
                : 'bg-gray-100 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#854d0e]" />
            50/50 Hint ({hintsCount})
          </button>

          <button
            onClick={handleSkipQuestion}
            disabled={skipCount === 0 || isAnsweringLocked}
            className={`px-3.5 py-2 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              skipCount > 0
                ? 'bg-[#fef08a] border-[#78350f] text-[#78350f] hover:bg-[#fde047]'
                : 'bg-gray-100 border-gray-300 text-gray-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <FastForward className="w-4 h-4 text-[#854d0e]" />
            Skip ({skipCount})
          </button>
        </div>

        {/* Central Question Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border-4 border-[#78350f] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative"
          >
            {/* Image Visual if Anime/Custom Image or Flag Category */}
            {currentQuestion.imageUrl ? (
              <div className="flex flex-col items-center justify-center my-1">
                <div className="relative p-2.5 bg-[#fdf2f8] border-4 border-[#78350f] rounded-2xl shadow-lg max-w-[320px] w-full">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question Visual"
                    className="w-full h-44 sm:h-48 object-cover rounded-xl border-2 border-[#78350f]/20 shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            ) : (currentQuestion.flagCode || currentQuestion.flagUrl) ? (
              <div className="flex flex-col items-center justify-center my-1">
                <div className="relative p-2.5 bg-[#fdf2f8] border-4 border-[#78350f] rounded-2xl shadow-lg max-w-[280px] w-full">
                  <img
                    src={
                      currentQuestion.flagUrl ||
                      `https://flagcdn.com/w320/${currentQuestion.flagCode?.toLowerCase()}.png`
                    }
                    alt="Flag"
                    className="w-full h-36 sm:h-40 object-contain rounded-xl bg-white border-2 border-[#78350f]/20 shadow-inner"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {currentQuestion.flagEmoji && (
                    <div className="absolute -top-3 -right-3 text-3xl bg-[#fef08a] border-2 border-[#78350f] rounded-full p-1 shadow-md">
                      {currentQuestion.flagEmoji}
                    </div>
                  )}
                </div>
              </div>
            ) : currentQuestion.flagEmoji ? (
              <div className="text-6xl sm:text-7xl text-center py-2 animate-bounce">
                {currentQuestion.flagEmoji}
              </div>
            ) : null}

            <h2 className="text-xl sm:text-2xl font-black text-black text-center leading-relaxed uppercase">
              "{currentQuestion.question}"
            </h2>

            {/* Answer Choice Buttons (3 options) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, index) => {
                const label = ['A', 'B', 'C'][index];
                const isDisabled = disabledOptions.includes(option);

                return (
                  <button
                    key={index}
                    disabled={isDisabled || isAnsweringLocked}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full py-4 px-5 rounded-2xl border-3 text-left font-black text-base flex items-center gap-3 transition-all cursor-pointer shadow-sm ${
                      isDisabled
                        ? 'bg-gray-100 border-gray-300 text-gray-400 line-through cursor-not-allowed'
                        : 'bg-[#fdf2f8] hover:bg-[#fef08a] border-[#78350f] text-black active:scale-[0.99]'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#fde047] text-[#78350f] border border-[#78350f] flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      {label}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

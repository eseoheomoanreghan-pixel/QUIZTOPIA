import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ThumbsDown, ArrowRight, Sparkles } from 'lucide-react';
import { Question } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface AnswerFeedbackModalProps {
  isCorrect: boolean;
  selectedOption: string;
  question: Question;
  pointsEarned: number;
  onNextQuestion: () => void;
}

export const AnswerFeedbackModal: React.FC<AnswerFeedbackModalProps> = ({
  isCorrect,
  selectedOption,
  question,
  pointsEarned,
  onNextQuestion,
}) => {
  useEffect(() => {
    // Trigger screen shake & sounds
    soundEngine.triggerScreenShake();

    if (isCorrect) {
      soundEngine.playCorrectAnswer();
      // Confetti burst
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      soundEngine.playWrongAnswer();
    }
  }, [isCorrect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border text-center shadow-2xl relative overflow-hidden bg-[#141414] text-[#e5e5e5] ${
          isCorrect ? 'border-emerald-500/50' : 'border-rose-500/50'
        }`}
      >
        {/* Banner Graphics */}
        {isCorrect ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-lg">
              ✓
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              CORRECT! 🎉
            </h2>

            <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider">
              +{pointsEarned} PTS EARNED
            </div>

            {question.explanation && (
              <p className="text-xs font-serif italic text-white/80 bg-white/5 p-3.5 rounded-2xl border border-white/10 leading-relaxed">
                "{question.explanation}"
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-3xl shadow-lg">
              ✕
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              INCORRECT ✕
            </h2>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left space-y-2 text-xs font-mono">
              <div className="text-rose-400">
                YOUR ANSWER:{' '}
                <span className="line-through text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded">
                  {selectedOption}
                </span>
              </div>
              <div className="text-emerald-400">
                CORRECT ANSWER:{' '}
                <span className="text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                  {question.correctAnswer}
                </span>
              </div>

              {question.explanation && (
                <div className="mt-2 pt-2 border-t border-white/10 text-white/70 font-serif italic">
                  "{question.explanation}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onNextQuestion();
          }}
          className={`w-full mt-6 py-4 px-6 rounded-2xl font-mono font-bold text-sm text-white border flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all uppercase tracking-wider ${
            isCorrect
              ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 shadow-emerald-600/30'
              : 'bg-rose-600 hover:bg-rose-500 border-rose-400 shadow-rose-600/30'
          }`}
        >
          <span>CONTINUE QUIZ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

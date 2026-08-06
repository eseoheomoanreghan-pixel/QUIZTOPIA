import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { CategorySelectScreen } from './components/CategorySelectScreen';
import { DifficultySelectScreen } from './components/DifficultySelectScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { AnswerFeedbackModal } from './components/AnswerFeedbackModal';
import { GiftRevealModal } from './components/GiftRevealModal';
import { ResultsScreen } from './components/ResultsScreen';
import { StatsModal } from './components/StatsModal';
import { SettingsModal, SettingsData } from './components/SettingsModal';
import { PrizeMiniGameScreen } from './components/PrizeMiniGameScreen';

import {
  AppScreen,
  CategoryId,
  DifficultyId,
  Question,
  UserStats,
  Reward,
  QuizRoundResult,
} from './types';
import { CURATED_QUESTIONS } from './data/curatedQuestions';
import { CATEGORIES, DIFFICULTIES } from './data/categoriesAndDifficulties';
import { soundEngine } from './utils/soundEngine';
import { generateTopicQuestions } from './utils/customTopicGenerator';

const INITIAL_REWARDS: Reward[] = [
  {
    id: 'r1',
    type: 'extra_time',
    name: '⏰ Extra Time (+15s)',
    description: 'Adds +15 bonus seconds to your quiz timer during a round.',
    icon: '⏰',
    quantity: 1,
  },
  {
    id: 'r2',
    type: 'hints',
    name: '💡 50/50 Hint',
    description: 'Eliminates 1 wrong answer option from the choices.',
    icon: '💡',
    quantity: 1,
  },
  {
    id: 'r3',
    type: 'skip',
    name: '⏭️ Skip Question',
    description: 'Skips a tricky question with full points without penalty.',
    icon: '⏭️',
    quantity: 1,
  },
  {
    id: 'r4',
    type: 'bonus_points',
    name: '⭐ Bonus Points (+500)',
    description: 'Gives +500 bonus score instantly to your total score.',
    icon: '⭐',
    quantity: 1,
  },
];

const INITIAL_STATS: UserStats = {
  playerName: '',
  totalScore: 0,
  winsCount: 0,
  categoryWins: {},
  difficultyWins: {},
  gamesPlayed: 0,
  unlockedRewards: INITIAL_REWARDS,
  claimedMilestones: [],
};

const PLAYERS_HISTORY_KEY = 'quiztopia_players_history';

function getPlayersHistory(): Record<string, UserStats> {
  const saved = localStorage.getItem(PLAYERS_HISTORY_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return {};
}

function savePlayerToHistory(playerStats: UserStats) {
  if (!playerStats.playerName || !playerStats.playerName.trim()) return;
  const history = getPlayersHistory();
  history[playerStats.playerName.trim().toLowerCase()] = playerStats;
  localStorage.setItem(PLAYERS_HISTORY_KEY, JSON.stringify(history));
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('quiztopia_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STATS;
  });

  // Selected Quiz Config
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('anime');
  const [customTopic, setCustomTopic] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('easy');

  // Active Round Gameplay State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [roundScore, setRoundScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);

  // Modals & Feedback
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    selectedOption: string;
    question: Question | null;
    pointsEarned: number;
  }>({
    show: false,
    isCorrect: false,
    selectedOption: '',
    question: null,
    pointsEarned: 0,
  });

  const [lastRoundResult, setLastRoundResult] = useState<QuizRoundResult | null>(null);
  const [rewardToReveal, setRewardToReveal] = useState<Reward | null>(null);

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Audio & Settings State
  const [isMusicMuted, setIsMusicMuted] = useState(soundEngine.getIsMusicMuted());
  const [isSfxMuted, setIsSfxMuted] = useState(soundEngine.getIsSfxMuted());
  const [musicVol, setMusicVol] = useState(soundEngine.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(soundEngine.getSfxVolume());
  const [useAiGen, setUseAiGen] = useState(true);

  // Brightness and Theme State
  const [brightness, setBrightness] = useState(1.0);
  const [colorTheme, setColorTheme] = useState<'gold' | 'red' | 'blue' | 'green' | 'orange'>(() => {
    const saved = localStorage.getItem('quiztopia_theme');
    return (saved as any) || 'gold';
  });

  useEffect(() => {
    localStorage.setItem('quiztopia_theme', colorTheme);
  }, [colorTheme]);

  const THEME_BG_CLASSES: Record<string, string> = {
    gold: 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fde68a]',
    red: 'bg-gradient-to-br from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
    blue: 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]',
    green: 'bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]',
    orange: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa]',
  };

  // Save stats to localStorage and player history
  useEffect(() => {
    localStorage.setItem('quiztopia_stats', JSON.stringify(stats));
    if (stats.playerName && stats.playerName.trim()) {
      savePlayerToHistory(stats);
    }
  }, [stats]);

  // Update Player Name with Auto-Save & Fresh Reset for New Players
  const handleUpdatePlayerName = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    // If same name as active stats, just sync casing/trimming
    if (trimmed.toLowerCase() === stats.playerName.trim().toLowerCase()) {
      setStats((prev) => ({ ...prev, playerName: trimmed }));
      return;
    }

    // 1. Save current active player's stats to player history archive
    if (stats.playerName && stats.playerName.trim()) {
      savePlayerToHistory(stats);
    }

    // 2. Check if new player name has previous archived stats
    const history = getPlayersHistory();
    const existing = history[trimmed.toLowerCase()];

    if (existing) {
      // Restore previous player's stats
      setStats({
        ...existing,
        playerName: trimmed,
      });
    } else {
      // Reset screen stats for brand new player
      const freshStats: UserStats = {
        ...INITIAL_STATS,
        playerName: trimmed,
        unlockedRewards: JSON.parse(JSON.stringify(INITIAL_REWARDS)),
      };
      setStats(freshStats);
    }
  };

  // Handle Music Toggle
  const handleToggleMusic = () => {
    const next = !isMusicMuted;
    setIsMusicMuted(next);
    soundEngine.setMusicMuted(next);
  };

  const handleToggleSfx = () => {
    const next = !isSfxMuted;
    setIsSfxMuted(next);
    soundEngine.setSfxMuted(next);
  };

  const handleChangeMusicVol = (vol: number) => {
    setMusicVol(vol);
    soundEngine.setMusicVolume(vol);
  };

  const handleChangeSfxVol = (vol: number) => {
    setSfxVol(vol);
    soundEngine.setSfxVolume(vol);
  };

  // Start Quiz Loading & Gameplay
  const handleStartRound = async (catId: CategoryId, diffId: DifficultyId, topic?: string) => {
    setIsLoadingQuestions(true);
    setQuestionIndex(0);
    setRoundScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);

    let questionsLoaded: Question[] = [];

    // Attempt Gemini AI Generation first if enabled or custom topic, with a fast 1.5s timeout
    if (useAiGen || topic || catId === 'custom') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch('/api/questions/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            category: catId,
            difficulty: diffId,
            customTopic: topic,
            count: 4,
          }),
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          questionsLoaded = data.questions.map((q: any, i: number) => ({
            id: `ai_${Date.now()}_${i}`,
            category: catId,
            difficulty: diffId,
            question: q.question,
            options: q.options as [string, string, string],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            flagCode: q.flagCode,
            flagEmoji: q.flagEmoji,
          }));
        }
      } catch (err) {
        console.warn('AI question generation timeout/fallback to curated questions:', err);
      }
    }

    // Fallback to custom topic generator or curated questions if AI generation unavailable
    if (questionsLoaded.length === 0) {
      if (catId === 'custom' || topic || customTopic) {
        const topicName = topic || customTopic || 'Custom Topic';
        questionsLoaded = generateTopicQuestions(topicName, diffId);
      } else {
        let filtered = CURATED_QUESTIONS.filter(
          (q) =>
            (catId === 'random' || q.category === catId) &&
            (q.difficulty === diffId || q.difficulty === 'easy')
        );

        if (filtered.length < 4) {
          filtered = CURATED_QUESTIONS.filter((q) => catId === 'random' || q.category === catId);
        }

        if (filtered.length < 4) {
          filtered = CURATED_QUESTIONS;
        }

        // Shuffle & pick 4
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        questionsLoaded = shuffled.slice(0, 4);
      }
    }

    // Always shuffle answer options so correct answers are randomized across A, B, and C
    const randomizedQuestions = questionsLoaded.map((q) => {
      const opts = [...q.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return {
        ...q,
        options: opts as [string, string, string],
      };
    });

    setActiveQuestions(randomizedQuestions);
    setIsLoadingQuestions(false);
    setScreen('gameplay');
  };

  // Answer Submission Handler
  const handleAnswerQuestion = (
    isCorrect: boolean,
    selectedOption: string,
    question: Question,
    timeRemaining: number
  ) => {
    const points = isCorrect ? 100 + timeRemaining * 5 : 0;

    if (isCorrect) {
      setRoundScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }

    setFeedback({
      show: true,
      isCorrect,
      selectedOption,
      question,
      pointsEarned: points,
    });
  };

  // Move to next question or complete round
  const handleNextQuestion = () => {
    setFeedback((prev) => ({ ...prev, show: false }));

    const nextIndex = questionIndex + 1;
    if (nextIndex < activeQuestions.length) {
      setQuestionIndex(nextIndex);
    } else {
      // Complete Round
      finishQuizRound();
    }
  };

  // Handle Time Expired Timeout
  const handleTimeExpired = () => {
    const currentQ = activeQuestions[questionIndex];
    setIncorrectCount((prev) => prev + 1);
    setFeedback({
      show: true,
      isCorrect: false,
      selectedOption: 'TIME EXPIRED ⏰',
      question: currentQ,
      pointsEarned: 0,
    });
  };

  // Finish Round & Milestone Check
  const finishQuizRound = () => {
    const totalQ = activeQuestions.length;
    const isWin = correctCount >= Math.ceil(totalQ * 0.75);
    const winsEarned = isWin ? 1 : 0;

    const roundRes: QuizRoundResult = {
      score: roundScore,
      correctCount,
      incorrectCount,
      category: customTopic ? customTopic : selectedCategory,
      difficulty: selectedDifficulty,
      totalQuestions: totalQ,
      winsEarned,
    };

    setLastRoundResult(roundRes);

    // Update User Stats
    setStats((prev) => {
      const newWins = prev.winsCount + winsEarned;
      const catWins = { ...prev.categoryWins };
      const diffWins = { ...prev.difficultyWins };

      if (winsEarned > 0) {
        catWins[selectedCategory] = (catWins[selectedCategory] || 0) + 1;
        diffWins[selectedDifficulty] = (diffWins[selectedDifficulty] || 0) + 1;
      }

      return {
        ...prev,
        totalScore: prev.totalScore + roundScore,
        winsCount: newWins,
        categoryWins: catWins,
        difficultyWins: diffWins,
        gamesPlayed: prev.gamesPlayed + 1,
      };
    });

    // Check Mystery Gift Milestone Unlock (e.g. at 1st win, 3rd win, 5th win, 10th win)
    const milestoneCheck = stats.winsCount + winsEarned;
    const milestones = [1, 3, 5, 10, 15, 20];
    const newMilestone = milestones.find(
      (m) => milestoneCheck >= m && !stats.claimedMilestones.includes(m)
    );

    if (newMilestone) {
      // Pick random reward type
      const rewardTypes: ('extra_time' | 'hints' | 'skip' | 'bonus_points')[] = [
        'extra_time',
        'hints',
        'skip',
        'bonus_points',
      ];
      const randomType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
      const rewardTemplate = INITIAL_REWARDS.find((r) => r.type === randomType) || INITIAL_REWARDS[0];

      setRewardToReveal(rewardTemplate);
      setStats((prev) => ({
        ...prev,
        claimedMilestones: [...prev.claimedMilestones, newMilestone],
      }));
      setScreen('gift_reveal');
    } else {
      setScreen('results');
    }
  };

  // Power-up Inventory Usage
  const handleUsePowerup = (type: 'extra_time' | 'hints' | 'skip') => {
    setStats((prev) => {
      const updated = prev.unlockedRewards.map((r) => {
        if (r.type === type && r.quantity > 0) {
          return { ...r, quantity: r.quantity - 1 };
        }
        return r;
      });
      return { ...prev, unlockedRewards: updated };
    });
  };

  // Claim Reward Handler
  const handleClaimReward = (reward: Reward) => {
    setStats((prev) => {
      const updated = prev.unlockedRewards.map((r) => {
        if (r.type === reward.type) {
          return { ...r, quantity: r.quantity + 1 };
        }
        return r;
      });
      return {
        ...prev,
        totalScore: reward.type === 'bonus_points' ? prev.totalScore + 500 : prev.totalScore,
        unlockedRewards: updated,
      };
    });
    setRewardToReveal(null);
    setScreen('results');
  };

  const handleDeclineReward = () => {
    setRewardToReveal(null);
    setScreen('results');
  };

  // Reset Session Stats
  const handleResetStats = () => {
    setStats(INITIAL_STATS);
    localStorage.removeItem('quiztopia_stats');
    setShowStatsModal(false);
  };

  const categoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const categoryNameDisplay = customTopic
    ? `Custom AI: ${customTopic}`
    : categoryObj?.name || selectedCategory;
  const categoryIconDisplay = customTopic ? '🤖' : categoryObj?.icon || '🎯';

  return (
    <div
      style={{ filter: `brightness(${brightness})` }}
      className={`min-h-screen ${THEME_BG_CLASSES[colorTheme] || 'bg-[#fdf0f4]'} font-sans text-[#3b1d0c] transition-colors duration-300 selection:bg-[#fde047] selection:text-[#3b1d0c]`}
    >
      {/* Top Navigation Bar */}
      <Navbar
        stats={stats}
        currentScreen={screen}
        onNavigateHome={() => setScreen('home')}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenMiniGame={() => setScreen('minigame')}
        isMusicMuted={isMusicMuted}
        isSfxMuted={isSfxMuted}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
      />

      {/* Main Screen Renderer */}
      <main>
        {screen === 'home' && (
          <HomeScreen
            stats={stats}
            onUpdateName={handleUpdatePlayerName}
            onStartQuiz={() => setScreen('category_select')}
            onOpenStats={() => setShowStatsModal(true)}
            onOpenMiniGame={() => setScreen('minigame')}
          />
        )}

        {screen === 'minigame' && (
          <PrizeMiniGameScreen
            stats={stats}
            onUpdateStats={setStats}
            onBack={() => setScreen('home')}
          />
        )}

        {screen === 'category_select' && (
          <CategorySelectScreen
            onSelectCategory={(catId, topic) => {
              setSelectedCategory(catId);
              setCustomTopic(topic);
              setScreen('difficulty_select');
            }}
            onBackToHome={() => setScreen('home')}
          />
        )}

        {screen === 'difficulty_select' && (
          <DifficultySelectScreen
            categoryId={selectedCategory}
            customTopic={customTopic}
            onSelectDifficulty={(diffId) => {
              setSelectedDifficulty(diffId);
              handleStartRound(selectedCategory, diffId, customTopic);
            }}
            onBackToCategory={() => setScreen('category_select')}
          />
        )}

        {screen === 'gameplay' && (
          <>
            {isLoadingQuestions ? (
              <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-transparent">
                <div className="w-16 h-16 rounded-full bg-[#fde047] text-[#78350f] flex items-center justify-center text-3xl animate-bounce shadow-xl border-3 border-[#78350f]">
                  ⚡
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef08a] border border-[#78350f] text-xs font-black uppercase text-[#78350f]">
                  GENERATING QUESTIONS...
                </div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tight">
                  Crafting Questions...
                </h2>
                <p className="text-xs font-bold text-[#78350f] max-w-sm italic">
                  Gemini AI is generating dynamic questions for <span className="text-black font-black">{categoryNameDisplay}</span>!
                </p>
              </div>
            ) : (
              <GameplayScreen
                playerName={stats.playerName || 'Player'}
                categoryName={categoryNameDisplay}
                categoryIcon={categoryIconDisplay}
                difficultyId={selectedDifficulty}
                questions={activeQuestions}
                currentQuestionIndex={questionIndex}
                unlockedRewards={stats.unlockedRewards}
                onAnswerQuestion={handleAnswerQuestion}
                onUsePowerup={handleUsePowerup}
                onTimeExpired={handleTimeExpired}
              />
            )}
          </>
        )}

        {screen === 'results' && lastRoundResult && (
          <ResultsScreen
            result={lastRoundResult}
            stats={stats}
            onTryAgain={() => handleStartRound(selectedCategory, selectedDifficulty, customTopic)}
            onNavigateHome={() => setScreen('category_select')}
            onOpenStats={() => setShowStatsModal(true)}
          />
        )}
      </main>

      {/* Answer Feedback Modal Overlay */}
      {feedback.show && feedback.question && (
        <AnswerFeedbackModal
          isCorrect={feedback.isCorrect}
          selectedOption={feedback.selectedOption}
          question={feedback.question}
          pointsEarned={feedback.pointsEarned}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {/* Gift Box Reveal Modal Overlay */}
      {screen === 'gift_reveal' && rewardToReveal && (
        <GiftRevealModal
          rewardToReveal={rewardToReveal}
          onClaim={handleClaimReward}
          onDecline={handleDeclineReward}
        />
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStatsModal(false)}
          onResetStats={handleResetStats}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          isMusicMuted={isMusicMuted}
          isSfxMuted={isSfxMuted}
          musicVol={musicVol}
          sfxVol={sfxVol}
          brightness={brightness}
          theme={colorTheme}
          useAiGen={useAiGen}
          onToggleMusic={handleToggleMusic}
          onToggleSfx={handleToggleSfx}
          onChangeMusicVol={handleChangeMusicVol}
          onChangeSfxVol={handleChangeSfxVol}
          onChangeBrightness={setBrightness}
          onChangeTheme={setColorTheme}
          onToggleAiGen={setUseAiGen}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}

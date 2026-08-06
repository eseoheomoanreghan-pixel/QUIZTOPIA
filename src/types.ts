export type CategoryId = 'anime' | 'marvel' | 'football' | 'music' | 'flags' | 'random' | string;

export type DifficultyId = 'very_easy' | 'easy' | 'medium' | 'hard';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  description: string;
  topics: string[];
}

export interface DifficultyInfo {
  id: DifficultyId;
  name: string;
  timeSeconds: number;
  color: string;
  dotColor: string;
  description: string;
}

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: DifficultyId;
  question: string;
  options: [string, string, string];
  correctAnswer: string;
  explanation?: string;
  flagEmoji?: string;
  flagCode?: string;
  flagUrl?: string;
  imageUrl?: string;
}

export type RewardType = 'extra_time' | 'hints' | 'skip' | 'bonus_points';

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  icon: string;
  quantity: number;
}

export interface UserStats {
  playerName: string;
  totalScore: number;
  winsCount: number;
  categoryWins: Record<string, number>;
  difficultyWins: Record<string, number>;
  gamesPlayed: number;
  unlockedRewards: Reward[];
  claimedMilestones: number[];
  unlockedStickers?: string[];
  unlockedBadges?: string[];
  miniGameTokens?: number;
}

export interface QuizRoundResult {
  score: number;
  correctCount: number;
  incorrectCount: number;
  category: string;
  difficulty: DifficultyId;
  totalQuestions: number;
  winsEarned: number;
}

export type AppScreen =
  | 'home'
  | 'category_select'
  | 'difficulty_select'
  | 'gameplay'
  | 'results'
  | 'gift_reveal'
  | 'stats'
  | 'settings'
  | 'minigame';

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  color: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  borderBg: string;
}

export const ALL_STICKERS: StickerItem[] = [
  {
    id: 'stk_fire',
    name: 'On Fire',
    emoji: '🔥',
    rarity: 'Common',
    description: 'Blazing through quiz questions with intense heat!',
    color: 'from-amber-400 to-red-500',
  },
  {
    id: 'stk_brain',
    name: 'Galaxy Brain',
    emoji: '🧠',
    rarity: 'Rare',
    description: 'Expanded intellectual consciousness activated!',
    color: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'stk_crown',
    name: 'Royalty Crown',
    emoji: '👑',
    rarity: 'Legendary',
    description: 'Worthy of ruling the Quiztopia Kingdom!',
    color: 'from-yellow-300 to-amber-500',
  },
  {
    id: 'stk_diamond',
    name: 'Diamond Mind',
    emoji: '💎',
    rarity: 'Epic',
    description: 'Unbreakable trivia knowledge and sharp focus!',
    color: 'from-cyan-300 to-blue-500',
  },
  {
    id: 'stk_rocket',
    name: 'To The Moon',
    emoji: '🚀',
    rarity: 'Rare',
    description: 'Soaring past all difficulty levels into orbit!',
    color: 'from-violet-400 to-fuchsia-600',
  },
  {
    id: 'stk_bolt',
    name: 'Lightning Speed',
    emoji: '⚡',
    rarity: 'Common',
    description: 'Answering before the timer even counts down!',
    color: 'from-yellow-200 to-yellow-500',
  },
  {
    id: 'stk_unicorn',
    name: 'Mythic Unicorn',
    emoji: '🦄',
    rarity: 'Legendary',
    description: 'A ultra-rare mythical prize from the lucky arcade!',
    color: 'from-pink-300 to-purple-500',
  },
  {
    id: 'stk_target',
    name: 'Bullseye',
    emoji: '🎯',
    rarity: 'Epic',
    description: 'Pinpoint accuracy on every single question choice!',
    color: 'from-rose-400 to-red-600',
  },
  {
    id: 'stk_ninja',
    name: 'Anime Shinobi',
    emoji: '🥷',
    rarity: 'Rare',
    description: 'Stealthy anime master trained in hidden scroll lore!',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'stk_flag',
    name: 'Globe Trotter',
    emoji: '🗺️',
    rarity: 'Epic',
    description: 'Identified obscure flags from every corner of Earth!',
    color: 'from-sky-300 to-indigo-500',
  },
];

export const ALL_BADGES: BadgeItem[] = [
  {
    id: 'bdg_grandmaster',
    title: 'Trivia Grandmaster',
    icon: '🏆',
    category: 'General',
    description: 'Mastered all quiz modes and difficulties with pride!',
    borderBg: 'border-amber-400 bg-amber-50',
  },
  {
    id: 'bdg_flag_scholar',
    title: 'Flag Scholar',
    icon: '🏴‍☠️',
    category: 'Flags',
    description: 'Conquered the hardest obscure world flags in trivia!',
    borderBg: 'border-blue-400 bg-blue-50',
  },
  {
    id: 'bdg_otaku',
    title: 'Otaku Legend',
    icon: '⛩️',
    category: 'Anime',
    description: 'Recognizes any anime character, quote, or jutsu instantly!',
    borderBg: 'border-pink-400 bg-pink-50',
  },
  {
    id: 'bdg_goat',
    title: 'GOAT Strategist',
    icon: '⚽',
    category: 'Football',
    description: 'World Cup stats master and pitch tactician!',
    borderBg: 'border-emerald-400 bg-emerald-50',
  },
  {
    id: 'bdg_marvel',
    title: 'Multiverse Hero',
    icon: '🦸',
    category: 'Marvel',
    description: 'Protector of the MCU and comic book timeline!',
    borderBg: 'border-red-400 bg-red-50',
  },
  {
    id: 'bdg_arcade',
    title: 'Spin Champion',
    icon: '🎰',
    category: 'Arcade',
    description: 'Hit the jackpot prize wheel in the Mini-Game Arcade!',
    borderBg: 'border-purple-400 bg-purple-50',
  },
];

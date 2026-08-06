import React from 'react';
import { Volume2, VolumeX, Music, Settings, Award, Package, Home } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { UserStats } from '../types';

interface NavbarProps {
  stats: UserStats;
  currentScreen: string;
  onNavigateHome: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenMiniGame?: () => void;
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentScreen,
  onNavigateHome,
  onOpenStats,
  onOpenSettings,
  onOpenMiniGame,
  isMusicMuted,
  isSfxMuted,
  onToggleMusic,
  onToggleSfx,
}) => {
  const totalPowerups = stats.unlockedRewards.reduce((sum, r) => sum + r.quantity, 0);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#fce7f3]/95 backdrop-blur-md border-b-2 border-[#78350f]/20 px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateHome}>
          <div className="w-9 h-9 rounded-full bg-[#fde047] border-2 border-[#78350f] flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-[#3b1d0c] uppercase">
                QUIZTOPIA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#78350f] hidden sm:inline-block border border-[#78350f]/30 px-1.5 py-0.5 rounded-sm bg-[#fef08a]">
                v.4.02
              </span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-[#78350f]/70 uppercase hidden sm:block font-bold">
              Quiz Universe
            </div>
          </div>
        </div>

        {/* Center: Player Tag if name entered */}
        {stats.playerName && (
          <div className="hidden md:flex items-center gap-2 bg-white/90 border-2 border-[#78350f]/30 px-3.5 py-1 rounded-full shadow-sm text-xs font-mono text-[#3b1d0c]">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
            <span className="text-[#78350f] uppercase text-[10px] tracking-wider font-bold">Player:</span>
            <span className="text-black font-extrabold">{stats.playerName}</span>
            <span className="text-[#854d0e] font-extrabold ml-1">🏆 {stats.winsCount} Wins</span>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Home Button if not on home */}
          {currentScreen !== 'home' && (
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onNavigateHome();
              }}
              className="p-2 rounded-xl bg-white border-2 border-[#78350f] text-[#3b1d0c] hover:bg-[#fde047] transition-all shadow-sm cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          {/* Audio Controls */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onToggleMusic();
            }}
            className={`p-2 rounded-xl border-2 transition-all shadow-sm flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
              !isMusicMuted
                ? 'bg-[#fde047] text-[#3b1d0c] border-[#78350f] font-bold'
                : 'bg-white text-[#78350f]/60 border-[#78350f]/30 hover:border-[#78350f]'
            }`}
            title={isMusicMuted ? 'Turn Music ON' : 'Turn Music OFF'}
          >
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">{!isMusicMuted ? 'BGM ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onToggleSfx();
            }}
            className={`p-2 rounded-xl border-2 transition-all shadow-sm text-xs font-mono cursor-pointer ${
              !isSfxMuted
                ? 'bg-[#fde047] text-[#3b1d0c] border-[#78350f] font-bold'
                : 'bg-white text-[#78350f]/60 border-[#78350f]/30 hover:border-[#78350f]'
            }`}
            title={isSfxMuted ? 'Unmute SFX' : 'Mute SFX'}
          >
            {!isSfxMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Lucky Arcade Mini-Game */}
          {onOpenMiniGame && (
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                onOpenMiniGame();
              }}
              className="p-2 px-3 rounded-xl bg-amber-300 border-2 border-[#78350f] text-black hover:bg-amber-400 transition-all shadow-sm flex items-center gap-1.5 font-black text-xs cursor-pointer animate-pulse"
              title="Lucky Arcade Mini-Game"
            >
              <span>🎰</span>
              <span className="hidden md:inline">MINI-GAME</span>
            </button>
          )}

          {/* Stats & Progress */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenStats();
            }}
            className="p-2 px-3 rounded-xl bg-[#fef08a] border-2 border-[#78350f] text-[#3b1d0c] hover:bg-[#fde047] transition-all shadow-sm flex items-center gap-1.5 font-mono text-xs cursor-pointer font-bold"
            title="Stats & Inventory"
          >
            <Award className="w-4 h-4 text-[#854d0e]" />
            <span className="hidden sm:inline font-bold">STATS</span>
            {totalPowerups > 0 && (
              <span className="bg-black text-yellow-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {totalPowerups}
              </span>
            )}
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-white border-2 border-[#78350f] text-[#3b1d0c] hover:bg-[#fde047] transition-all shadow-sm cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

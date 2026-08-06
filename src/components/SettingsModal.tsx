import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Music, Volume2, Sun, Palette, Bot, Save, Check } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export type ColorTheme = 'gold' | 'red' | 'blue' | 'green' | 'orange';

export interface SettingsData {
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  musicVol: number;
  sfxVol: number;
  brightness: number;
  theme: ColorTheme;
  useAiGen: boolean;
}

interface SettingsModalProps {
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  musicVol: number;
  sfxVol: number;
  brightness: number;
  theme: ColorTheme;
  useAiGen: boolean;
  onSaveSettings: (settings: SettingsData) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isMusicMuted,
  isSfxMuted,
  musicVol,
  sfxVol,
  brightness,
  theme,
  useAiGen,
  onSaveSettings,
  onClose,
}) => {
  const [localTheme, setLocalTheme] = useState<ColorTheme>(theme);
  const [localBrightness, setLocalBrightness] = useState<number>(brightness);
  const [localMusicMuted, setLocalMusicMuted] = useState<boolean>(isMusicMuted);
  const [localSfxMuted, setLocalSfxMuted] = useState<boolean>(isSfxMuted);
  const [localMusicVol, setLocalMusicVol] = useState<number>(musicVol);
  const [localSfxVol, setLocalSfxVol] = useState<number>(sfxVol);
  const [localUseAiGen, setLocalUseAiGen] = useState<boolean>(useAiGen);

  const [isSaved, setIsSaved] = useState(false);

  const THEME_OPTIONS: { id: ColorTheme; label: string; bg: string; border: string }[] = [
    { id: 'gold', label: 'Warm Gold', bg: 'bg-amber-400', border: 'border-amber-600' },
    { id: 'red', label: 'Crimson Red', bg: 'bg-rose-500', border: 'border-rose-700' },
    { id: 'blue', label: 'Royal Blue', bg: 'bg-sky-500', border: 'border-sky-700' },
    { id: 'green', label: 'Emerald', bg: 'bg-emerald-500', border: 'border-emerald-700' },
    { id: 'orange', label: 'Sunset Orange', bg: 'bg-orange-500', border: 'border-orange-700' },
  ];

  const handleSave = () => {
    soundEngine.playCorrect();
    setIsSaved(true);

    onSaveSettings({
      isMusicMuted: localMusicMuted,
      isSfxMuted: localSfxMuted,
      musicVol: localMusicVol,
      sfxVol: localSfxVol,
      brightness: localBrightness,
      theme: localTheme,
      useAiGen: localUseAiGen,
    });

    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-3xl bg-[#141414] border border-white/10 p-6 sm:p-8 space-y-5 shadow-2xl relative text-[#e5e5e5] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xl">
              ⚙️
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              APP SETTINGS
            </h2>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Theme Chooser */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-amber-400" />
            COLOR THEME PALETTE
          </h3>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {THEME_OPTIONS.map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    soundEngine.playButtonClick();
                    setLocalTheme(th.id);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer transition-all ${
                    localTheme === th.id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 scale-105 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${th.bg} ${th.border} border-2`} />
                  <span className="truncate w-full text-center">{th.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Brightness Adjustment */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-yellow-400" />
            SCREEN BRIGHTNESS
          </h3>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between text-[10px] font-mono font-bold text-white/60">
              <span>Brightness Level</span>
              <span>{Math.round(localBrightness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={localBrightness}
              onChange={(e) => setLocalBrightness(parseFloat(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Audio Controls */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Music className="w-4 h-4 text-blue-400" />
            BACKGROUND MUSIC CONTROLS
          </h3>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Background Music</span>
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  setLocalMusicMuted(!localMusicMuted);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border cursor-pointer transition-all ${
                  !localMusicMuted
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-white/5 text-white/30 border-white/10'
                }`}
              >
                {!localMusicMuted ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-white/50">
                <span>Music Volume</span>
                <span>{Math.round(localMusicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localMusicVol}
                onChange={(e) => setLocalMusicVol(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Sound Effects Controls */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-blue-400" />
            SOUND EFFECTS (SFX) CONTROLS
          </h3>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Sound Effects</span>
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  setLocalSfxMuted(!localSfxMuted);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border cursor-pointer transition-all ${
                  !localSfxMuted
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-white/5 text-white/30 border-white/10'
                }`}
              >
                {!localSfxMuted ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-white/50">
                <span>SFX Volume</span>
                <span>{Math.round(localSfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localSfxVol}
                onChange={(e) => setLocalSfxVol(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AI Generator Toggle */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase">
              <Bot className="w-4 h-4 text-blue-400" /> AI Question Generator
            </div>
            <div className="text-[10px] text-white/50 font-serif italic mt-0.5">
              Generate dynamic questions via Gemini AI
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              setLocalUseAiGen(!localUseAiGen);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border cursor-pointer transition-all ${
              localUseAiGen
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-white/5 text-white/30 border-white/10'
            }`}
          >
            {localUseAiGen ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-mono font-bold text-xs uppercase cursor-pointer transition-all text-center"
          >
            CANCEL
          </button>

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex-2 py-3 px-5 rounded-2xl border-2 font-black text-sm uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
              isSaved
                ? 'bg-emerald-500 border-emerald-400 text-white'
                : 'bg-[#fde047] hover:bg-[#facc15] border-[#78350f] text-[#3b1d0c] active:scale-95'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                SAVED!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 stroke-[2.5]" />
                SAVE SETTINGS
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};


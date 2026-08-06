class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicMuted: boolean = false;
  private isSfxMuted: boolean = false;
  private musicVolume: number = 0.25;
  private sfxVolume: number = 0.7;
  private isMusicPlaying: boolean = false;
  private musicIntervalId: any = null;
  private currentBeatIndex: number = 0;

  constructor() {
    // Lazy AudioContext initialization on first user touch/click
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public getIsMusicMuted() {
    return this.isMusicMuted;
  }

  public setSfxMuted(muted: boolean) {
    this.isSfxMuted = muted;
  }

  public getIsSfxMuted() {
    return this.isSfxMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.isMusicMuted ? 0 : this.musicVolume * 0.2;
    }
  }

  public getMusicVolume() {
    return this.musicVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSfxVolume() {
    return this.sfxVolume;
  }

  // Button Click Sound
  public playButtonClick() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.error(e);
    }
  }

  // Correct Answer Fanfare
  public playCorrectAnswer() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.5, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Wrong Answer Buzzer
  public playWrongAnswer() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.linearRampToValueAtTime(110, now + 0.25);

      osc2.frequency.setValueAtTime(165, now);
      osc2.frequency.linearRampToValueAtTime(115, now + 0.25);

      gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch (e) {
      console.error(e);
    }
  }

  // Timer Tick Sound (for last 10 seconds)
  public playTimerTick() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.error(e);
    }
  }

  // Time Expired Buzzer
  public playTimerExpired() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(130, now + 0.15);

      gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error(e);
    }
  }

  // Gift Tapping Sound (pitch increases with tap number: 1, 2, 3)
  public playGiftTap(tapIndex: number) {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 300 + tapIndex * 200; // 500, 700, 900 Hz

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.error(e);
    }
  }

  // Gift Explosion & Celebration Sound
  public playGiftExplode() {
    if (this.isSfxMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Pop / Noise Burst
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1200;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);

      // 2. Triumphant Victory Chimes
      const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major pentatonic sweep
      chords.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.06);

        gain.gain.setValueAtTime(0, now + 0.1 + idx * 0.06);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, now + 0.1 + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + idx * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + 0.1 + idx * 0.06);
        osc.stop(now + 0.1 + idx * 0.06 + 0.5);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Catchy Upbeat Gen Z Synth Pop Background Music Loop
  public startMusic() {
    if (this.isMusicMuted || this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    this.currentBeatIndex = 0;

    // Gen Z Synth Pop pentatonic melody scale (A Major / F# Minor hook)
    const leadHook = [
      440.00, 554.37, 659.25, 880.00,
      659.25, 554.37, 440.00, 493.88,
      554.37, 659.25, 739.99, 880.00,
      987.77, 880.00, 739.99, 659.25,
    ];

    const chords = [
      [220.00, 277.18, 329.63], // A Major
      [185.00, 220.00, 277.18], // F# Minor
      [146.83, 185.00, 220.00], // D Major
      [164.81, 207.65, 246.94], // E Major
    ];

    const bassline = [110.00, 92.50, 73.42, 82.41]; // A, F#, D, E

    this.musicIntervalId = setInterval(() => {
      if (!this.isMusicPlaying || !this.ctx || this.isMusicMuted) return;

      try {
        const now = this.ctx.currentTime;
        const masterVol = this.musicVolume * 0.15;

        // 1. Lead Melody Note (Synth Lead)
        const leadFreq = leadHook[this.currentBeatIndex % leadHook.length];
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();

        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(leadFreq, now);

        leadGain.gain.setValueAtTime(masterVol * 0.7, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        leadOsc.connect(leadGain);
        leadGain.connect(this.ctx.destination);

        leadOsc.start(now);
        leadOsc.stop(now + 0.18);

        // 2. Synth Chord Stabs every 4 beats
        if (this.currentBeatIndex % 4 === 0) {
          const chordIndex = Math.floor(this.currentBeatIndex / 4) % chords.length;
          const currentChord = chords[chordIndex];

          currentChord.forEach((freq) => {
            const chordOsc = this.ctx!.createOscillator();
            const chordGain = this.ctx!.createGain();

            chordOsc.type = 'sine';
            chordOsc.frequency.setValueAtTime(freq, now);

            chordGain.gain.setValueAtTime(masterVol * 0.4, now);
            chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            chordOsc.connect(chordGain);
            chordGain.connect(this.ctx!.destination);

            chordOsc.start(now);
            chordOsc.stop(now + 0.38);
          });
        }

        // 3. Punchy Synth Bassline every 2 beats
        if (this.currentBeatIndex % 2 === 0) {
          const bassIndex = Math.floor(this.currentBeatIndex / 4) % bassline.length;
          const bassFreq = bassline[bassIndex];

          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();

          bassOsc.type = 'sawtooth';
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(masterVol * 0.5, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          bassOsc.connect(bassGain);
          bassGain.connect(this.ctx.destination);

          bassOsc.start(now);
          bassOsc.stop(now + 0.24);
        }

        this.currentBeatIndex++;
      } catch (e) {
        console.error(e);
      }
    }, 200); // 150 BPM energetic vibe
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  // Trigger Screen Shake animation on window
  public triggerScreenShake() {
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('animate-shake');
      setTimeout(() => {
        root.classList.remove('animate-shake');
      }, 500);
    }
  }
}

export const soundEngine = new SoundEngine();

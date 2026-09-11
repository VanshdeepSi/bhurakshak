// Web Audio API emergency acoustic alert generator
class EmergencyAudioManager {
  constructor() {
    this.audioCtx = null;
    this.activeOscillators = [];
    this.isPlaying = false;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playSiren(durationSeconds = 2.4) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.stop();
      this.isPlaying = true;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      
      // Dual-tone urgent acoustic emergency pulse (800Hz <-> 1200Hz)
      const step = 0.3;
      const totalSteps = Math.floor(durationSeconds / step);
      for (let i = 0; i < totalSteps; i++) {
        const t = now + i * step;
        const targetFreq = (i % 2 === 0) ? 800 : 1250;
        osc.frequency.setValueAtTime(targetFreq, t);
        osc.frequency.exponentialRampToValueAtTime((i % 2 === 0) ? 1250 : 800, t + step * 0.8);
      }

      // Volume envelope (audible but comfortable ~0.14)
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.setValueAtTime(0.14, now + durationSeconds - 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSeconds);

      this.activeOscillators.push(osc);
      osc.onended = () => {
        this.isPlaying = false;
        this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
      };
    } catch (e) {
      console.warn('Emergency audio siren blocked or unpermitted:', e);
    }
  }

  stop() {
    try {
      this.activeOscillators.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      this.activeOscillators = [];
      this.isPlaying = false;
    } catch {}
  }
}

export const emergencyAudio = new EmergencyAudioManager();

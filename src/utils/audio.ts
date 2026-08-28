// Web Audio API Synthesizer for high-fidelity cricket sound effects & Mobile Haptic Vibration

class CricketAudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Mobile Haptic Vibration
  public vibrate(pattern: number | number[] = 30) {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // ignore
    }
  }

  // 1. Bat sweet spot "CRACK!"
  public playBatHit(quality: 'PERFECT' | 'GOOD' | 'MISTIMED' | 'DEFENSE') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(quality === 'PERFECT' ? [30, 40, 60] : 25);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(quality === 'PERFECT' ? 1400 : quality === 'GOOD' ? 1100 : 750, now);
    filter.Q.setValueAtTime(3.5, now);

    osc.type = quality === 'PERFECT' ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(quality === 'PERFECT' ? 320 : 260, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (quality === 'PERFECT' ? 0.14 : 0.08));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Add wooden transient snap noise
    this.playTransientSnap(quality === 'PERFECT' ? 1.0 : 0.6);
  }

  private playTransientSnap(volume: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
  }

  // 2. Crowd Cheer for 4 / 6 / Victory
  public playCrowdCheer(intensity: 'BOUNDARY_FOUR' | 'MAXIMUM_SIX' | 'VICTORY') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(intensity === 'MAXIMUM_SIX' ? [50, 40, 50, 40, 100] : [40, 30, 40]);

    const duration = intensity === 'VICTORY' ? 3.0 : intensity === 'MAXIMUM_SIX' ? 2.2 : 1.5;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 0.6);
    filter.frequency.exponentialRampToValueAtTime(500, now + duration);
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    const maxGain = intensity === 'MAXIMUM_SIX' ? 0.6 : intensity === 'VICTORY' ? 0.7 : 0.45;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(maxGain, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // 3. Stumps Rattling / Wicket!
  public playWicketSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([100, 50, 150]);

    const now = this.ctx.currentTime;

    // Wood crash clatter
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450 - i * 90, now + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(80, now + i * 0.03 + 0.15);

      gain.gain.setValueAtTime(0.5 / (i + 1), now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.22);
    }
  }

  // 4. Appeal / Tension pulse
  public playAppealSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(50);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 5. Button Click UI Haptic
  public playUiClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(12);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 6. Level Up Fanfare / Milestone celebration
  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([40, 40, 40, 40, 120]);
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.3, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.45);
    });
  }

  // 7. Success Chime
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([20, 30, 50]);
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.35);
    });
  }
}

export const cricketAudio = new CricketAudioManager();

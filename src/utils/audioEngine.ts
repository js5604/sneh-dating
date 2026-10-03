/**
 * Procedural Web Audio Engine for Real-Time Weather Ambience and Severe Alert Chimes
 * Generates audio synthesis purely using Web Audio API nodes without external audio files.
 */

class WeatherAudioEngine {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private windNode: AudioNode | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private currentVolume = 0.4;
  private isMuted = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.isInitialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const targetGain = muted ? 0 : this.currentVolume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
  }

  public updateWeatherAmbience(condition: string, rainIntensity: number, windSpeed: number) {
    if (this.isMuted) {
      this.stopAmbience();
      return;
    }
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const hasRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm');
    const hasWind = windSpeed > 15;

    if (hasRain && !this.rainNode) {
      this.startRainSynth(rainIntensity);
    } else if (!hasRain && this.rainNode) {
      this.stopRainSynth();
    }

    if (hasWind && !this.windNode) {
      this.startWindSynth(windSpeed);
    } else if (!hasWind && this.windNode) {
      this.stopWindSynth();
    }
  }

  private startRainSynth(intensity = 0.5) {
    if (!this.ctx || !this.masterGain || this.rainNode) return;
    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000 + intensity * 1500, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(Math.min(0.25, 0.05 + intensity * 0.15), this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      whiteNoise.start(0);
      this.rainNode = gain;
    } catch {
      // Audio synth fallback
    }
  }

  private stopRainSynth() {
    if (this.rainNode) {
      try {
        (this.rainNode as GainNode).gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.2);
      } catch {
        // Safe ignore
      }
      this.rainNode = null;
    }
  }

  private startWindSynth(speed: number) {
    if (!this.ctx || !this.masterGain || this.windNode) return;
    try {
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        output[i] = (b0 + b1 + b2) * 0.3;
      }

      const pinkNoise = this.ctx.createBufferSource();
      pinkNoise.buffer = noiseBuffer;
      pinkNoise.loop = true;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320 + Math.min(speed * 10, 400), this.ctx.currentTime);
      bandpass.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      pinkNoise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.masterGain);

      pinkNoise.start(0);
      this.windNode = gain;
    } catch {
      // Safe fallback
    }
  }

  private stopWindSynth() {
    if (this.windNode) {
      try {
        (this.windNode as GainNode).gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.2);
      } catch {
        // Safe ignore
      }
      this.windNode = null;
    }
  }

  public playThunder() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const duration = 2.5;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + (0.04 * white)) / 1.04;
        data[i] = lastVal * 3;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {
      // Audio synth fallback
    }
  }

  public playSevereAlertBeep() {
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Dual tone EAS alert frequency (853 Hz & 960 Hz) standard emergency tone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(853, now);
      osc2.frequency.setValueAtTime(960, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.setValueAtTime(0.2, now + 0.35);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);

      // Repeat pulse 2
      gain.gain.setValueAtTime(0.2, now + 0.5);
      gain.gain.linearRampToValueAtTime(0, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } catch {
      // Safe fallback
    }
  }

  public stopAmbience() {
    this.stopRainSynth();
    this.stopWindSynth();
  }
}

export const weatherAudio = new WeatherAudioEngine();

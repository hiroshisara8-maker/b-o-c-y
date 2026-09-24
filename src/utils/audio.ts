/**
 * Web Audio API synthesizer for "Cứu Cây"
 * Lightweight, zero external dependencies, 100% reliable in all modern browsers.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundTone = 'bell' | 'water' | 'melody';

export const isSoundEnabled = (): boolean => {
  try {
    const val = localStorage.getItem('cuucay_sound_enabled');
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem('cuucay_sound_enabled', enabled ? 'true' : 'false');
  } catch (e) {
    console.error(e);
  }
};

/**
 * Gentle Zen Garden Bell chime (C5 - E5 - G5 - C6 harmonics)
 */
export function playZenBell(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

    gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + index * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + index * 0.12);
    osc.stop(ctx.currentTime + index * 0.12 + 1.3);
  });
}

/**
 * Realistic water droplet pitch bend sound
 */
export function playWaterDrop(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  // Rapid pitch sweep up and down to emulate a clean water drop
  osc.frequency.setValueAtTime(580, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1480, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.22);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.38);
}

/**
 * Cheerful morning melody (F5 - A5 - C6 - D6 - F6)
 */
export function playMorningMelody(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [698.46, 880.0, 1046.5, 1174.66, 1396.91]; // F5, A5, C6, D6, F6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.09 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.09);
    osc.stop(ctx.currentTime + idx * 0.09 + 0.85);
  });
}

/**
 * Urgent reminder alarm sound (3 repeated double rings)
 */
export function playReminderAlarm(tone: SoundTone = 'bell'): void {
  if (!isSoundEnabled()) return;

  if (tone === 'water') {
    playWaterDrop();
    setTimeout(playWaterDrop, 250);
    setTimeout(playWaterDrop, 500);
    return;
  }

  if (tone === 'melody') {
    playMorningMelody();
    return;
  }

  // Double chime repeated twice
  playZenBell();
  setTimeout(() => {
    playZenBell();
  }, 1200);
}

/**
 * Play sound based on selected tone name
 */
export function playSoundByTone(tone: SoundTone): void {
  switch (tone) {
    case 'water':
      playWaterDrop();
      break;
    case 'melody':
      playMorningMelody();
      break;
    case 'bell':
    default:
      playZenBell();
      break;
  }
}

// Aliases for intuitive Chibi & action sounds
export const playWaterSound = playWaterDrop;
export const playSparkleSound = playMorningMelody;

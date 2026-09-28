// ─── Audio Utility ────────────────────────────────────────────────────────────
// Uses Web Audio API to generate lightweight tones without external audio files.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioCtx && audioCtx.state !== 'closed') return audioCtx;
  try {
    const Ctor =
      (window.AudioContext as typeof AudioContext | undefined) ??
      ((window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return null;
    audioCtx = new Ctor();
    return audioCtx;
  } catch {
    return null;
  }
}

export function playTone(
  frequency: number,
  durationMs: number,
  volume: number,
  type: OscillatorType = 'sine'
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    // Resume AudioContext if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => undefined);
    }
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // Audio may be blocked — ignore gracefully
  }
}

export function playBreakChime(volume: number): void {
  playTone(528, 400, volume, 'sine');
  setTimeout(() => playTone(660, 400, volume, 'sine'), 200);
  setTimeout(() => playTone(784, 600, volume, 'sine'), 400);
}

export function playResumeChime(volume: number): void {
  playTone(784, 200, volume, 'sine');
  setTimeout(() => playTone(660, 400, volume, 'sine'), 150);
}

export function playCompletionChime(volume: number): void {
  [440, 523, 659, 784].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 300, volume, 'sine'), i * 120);
  });
}

export function unlockAudio(): void {
  // Called on first user interaction to unlock AudioContext
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => undefined);
  }
}

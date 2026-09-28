// ─── Timer Engine ─────────────────────────────────────────────────────────────
// Centralized timestamp-based timer that is resilient to:
// - Browser tab throttling
// - Background tab execution
// - setInterval drift
// - Page visibility changes

import type { TimerState, TimerPhase, TimerSettings } from '../types';

export const INITIAL_TIMER_STATE: TimerState = {
  status: 'idle',
  phase: 'focus',
  targetTimestamp: null,
  pausedRemaining: null,
  sessionStartTime: null,
  cycleCount: 0,
  lastNotifiedPhase: null,
};

// ─── Phase Duration Calculator ────────────────────────────────────────────────

export function getPhaseDurationMs(phase: TimerPhase, settings: TimerSettings): number {
  switch (phase) {
    case 'focus':
      return settings.focusDurationMin * 60 * 1000;
    case 'eyeBreak':
      return settings.eyeBreakDurationSec * 1000;
    case 'movementBreak':
      return settings.movementDurationMin * 60 * 1000;
  }
}

// ─── Next Phase Calculator ────────────────────────────────────────────────────

export function getNextPhase(
  currentPhase: TimerPhase,
  cycleCount: number,
  settings: TimerSettings
): TimerPhase {
  if (currentPhase === 'focus') {
    // After focus, determine if we should trigger a movement break
    // Movement interval in cycles: movementIntervalMin / focusDurationMin
    const cyclesPerMovement = Math.max(
      1,
      Math.round(settings.movementIntervalMin / settings.focusDurationMin)
    );
    const nextCycle = cycleCount + 1;
    if (settings.movementBreakEnabled && nextCycle % cyclesPerMovement === 0) {
      return 'movementBreak';
    }
    if (settings.eyeBreakEnabled) {
      return 'eyeBreak';
    }
    return 'focus';
  }
  // After any break, go back to focus
  return 'focus';
}

// ─── Remaining Time Calculator ────────────────────────────────────────────────

export function getRemainingMs(state: TimerState): number {
  if (state.status === 'paused' && state.pausedRemaining !== null) {
    return Math.max(0, state.pausedRemaining);
  }
  if (state.targetTimestamp !== null && state.status === 'running') {
    return Math.max(0, state.targetTimestamp - Date.now());
  }
  return 0;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatShortTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}

// ─── Timer Actions ────────────────────────────────────────────────────────────

export function startSession(
  settings: TimerSettings,
  existingState?: TimerState
): TimerState {
  const phase: TimerPhase = 'focus';
  const durationMs = getPhaseDurationMs(phase, settings);
  const now = Date.now();
  return {
    ...(existingState ?? INITIAL_TIMER_STATE),
    status: 'running',
    phase,
    targetTimestamp: now + durationMs,
    pausedRemaining: null,
    sessionStartTime: existingState?.sessionStartTime ?? now,
    cycleCount: 0,
    lastNotifiedPhase: null,
  };
}

export function pauseTimer(state: TimerState): TimerState {
  if (state.status !== 'running') return state;
  return {
    ...state,
    status: 'paused',
    pausedRemaining: getRemainingMs(state),
    targetTimestamp: null,
  };
}

export function resumeTimer(state: TimerState): TimerState {
  if (state.status !== 'paused' || state.pausedRemaining === null) return state;
  return {
    ...state,
    status: 'running',
    targetTimestamp: Date.now() + state.pausedRemaining,
    pausedRemaining: null,
  };
}

export function resetTimer(): TimerState {
  return { ...INITIAL_TIMER_STATE };
}

export function skipPhase(state: TimerState, settings: TimerSettings): TimerState {
  if (state.status === 'idle') return state;
  const nextPhase = getNextPhase(state.phase, state.cycleCount, settings);
  const newCycleCount =
    state.phase === 'focus' ? state.cycleCount + 1 : state.cycleCount;
  const durationMs = getPhaseDurationMs(nextPhase, settings);
  return {
    ...state,
    status: 'running',
    phase: nextPhase,
    targetTimestamp: Date.now() + durationMs,
    pausedRemaining: null,
    cycleCount: newCycleCount,
    lastNotifiedPhase: null,
  };
}

export function advancePhase(state: TimerState, settings: TimerSettings): TimerState {
  const nextPhase = getNextPhase(state.phase, state.cycleCount, settings);
  const newCycleCount =
    state.phase === 'focus' ? state.cycleCount + 1 : state.cycleCount;
  const durationMs = getPhaseDurationMs(nextPhase, settings);
  return {
    ...state,
    status: 'running',
    phase: nextPhase,
    targetTimestamp: Date.now() + durationMs,
    pausedRemaining: null,
    cycleCount: newCycleCount,
    lastNotifiedPhase: null,
  };
}

export function completeTimer(state: TimerState): TimerState {
  return {
    ...state,
    status: 'completed',
    targetTimestamp: null,
    pausedRemaining: null,
  };
}

// ─── Progress Calculation ─────────────────────────────────────────────────────

export function getPhaseProgress(remainingMs: number, totalMs: number): number {
  if (totalMs <= 0) return 1;
  return Math.max(0, Math.min(1, 1 - remainingMs / totalMs));
}

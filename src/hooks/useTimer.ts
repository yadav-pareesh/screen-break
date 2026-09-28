import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimerState, AppSettings } from '../types';
import {
  INITIAL_TIMER_STATE,
  startSession,
  pauseTimer,
  resumeTimer,
  resetTimer,
  skipPhase,
  advancePhase,
  getRemainingMs,
  getPhaseDurationMs,
  getPhaseProgress,
} from '../utils/timerEngine';
import { sendNotification } from '../utils/browserCapabilities';
import { playBreakChime, playResumeChime } from '../utils/audio';
import { updateTodayStats, recalculateStreak, saveStatistics } from '../utils/storage';
import type { Statistics } from '../types';

// ─── useTimer Hook ────────────────────────────────────────────────────────────

interface UseTimerOptions {
  settings: AppSettings;
  statistics: Statistics;
  onStatisticsUpdate: (stats: Statistics) => void;
}

interface UseTimerReturn {
  timerState: TimerState;
  remainingMs: number;
  progress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
  totalMs: number;
}

export function useTimer({
  settings,
  statistics,
  onStatisticsUpdate,
}: UseTimerOptions): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>(INITIAL_TIMER_STATE);
  const [remainingMs, setRemainingMs] = useState(0);
  const [totalMs, setTotalMs] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef<TimerState>(INITIAL_TIMER_STATE);
  const settingsRef = useRef<AppSettings>(settings);
  const statsRef = useRef<Statistics>(statistics);
  const lastPhaseRef = useRef<string>('');

  // Keep refs current
  stateRef.current = timerState;
  settingsRef.current = settings;
  statsRef.current = statistics;

  // ─── Tick Handler ────────────────────────────────────────────────────────────

  const handlePhaseComplete = useCallback((completedState: TimerState) => {
    const { settings: s, statistics: stats } = {
      settings: settingsRef.current,
      statistics: statsRef.current,
    };

    let newStats = stats;

    if (completedState.phase === 'focus') {
      newStats = updateTodayStats(newStats, { focusMinutes: s.timer.focusDurationMin });
    } else if (completedState.phase === 'eyeBreak') {
      newStats = updateTodayStats(newStats, { eyeBreaksCompleted: 1 });
    } else if (completedState.phase === 'movementBreak') {
      newStats = updateTodayStats(newStats, {
        movementBreaksCompleted: 1,
        movementMinutes: s.timer.movementDurationMin,
      });
    }

    newStats = recalculateStreak(newStats);
    onStatisticsUpdate(newStats);
    saveStatistics(newStats);

    // Send notification based on incoming NEXT phase
    const nextState = advancePhase(completedState, s.timer);
    const notifSettings = s.notifications;

    if (notifSettings.enabled) {
      if (nextState.phase === 'eyeBreak' && notifSettings.eyeBreak) {
        sendNotification(
          '👀 Eye Break Time',
          `Look at something ~20 feet away for ${s.timer.eyeBreakDurationSec} seconds.`,
          'eyebreak'
        );
      } else if (nextState.phase === 'movementBreak' && notifSettings.movementBreak) {
        sendNotification(
          '🧘 Movement Break',
          'Time to stand up and stretch!',
          'movement'
        );
      } else if (nextState.phase === 'focus') {
        // back to focus after break
        if (notifSettings.sessionComplete && completedState.phase !== 'focus') {
          sendNotification('✅ Break Complete', 'Time to get back to focus!', 'focus');
        }
      }
    }

    // Sound
    if (s.sound.enabled) {
      if (nextState.phase === 'focus') {
        playResumeChime(s.sound.volume);
      } else {
        playBreakChime(s.sound.volume);
      }
    }

    if (s.timer.autoStartNextPhase) {
      setTimerState(nextState);
      setTotalMs(getPhaseDurationMs(nextState.phase, s.timer));
      setRemainingMs(getRemainingMs(nextState));
    } else {
      setTimerState({ ...nextState, status: 'paused', pausedRemaining: getPhaseDurationMs(nextState.phase, s.timer) });
      setTotalMs(getPhaseDurationMs(nextState.phase, s.timer));
      setRemainingMs(getPhaseDurationMs(nextState.phase, s.timer));
    }
  }, [onStatisticsUpdate]);

  const tick = useCallback(() => {
    const state = stateRef.current;
    if (state.status !== 'running') return;

    const remaining = getRemainingMs(state);
    setRemainingMs(remaining);

    if (remaining <= 0) {
      handlePhaseComplete(state);
    }
  }, [handlePhaseComplete]);

  // ─── Interval Management ──────────────────────────────────────────────────────

  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(tick, 250); // 4 ticks/sec for accuracy
  }, [tick]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ─── Visibility Change Handler ─────────────────────────────────────────────

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const state = stateRef.current;
        if (state.status === 'running') {
          const remaining = getRemainingMs(state);
          setRemainingMs(remaining);
          // Re-sync immediately if tab was hidden
          if (remaining <= 0) {
            handlePhaseComplete(state);
          }
        } else if (settingsRef.current.timer.pauseWhenHidden) {
          setTimerState(pauseTimer(state));
        }
      } else if (
        document.visibilityState === 'hidden' &&
        settingsRef.current.timer.pauseWhenHidden
      ) {
        setTimerState((prev) => {
          if (prev.status === 'running') return pauseTimer(prev);
          return prev;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [handlePhaseComplete]);

  // ─── Start/Stop interval based on state ───────────────────────────────────

  useEffect(() => {
    if (timerState.status === 'running') {
      startInterval();
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [timerState.status, startInterval, stopInterval]);

  // ─── Phase transition tracking ────────────────────────────────────────────

  useEffect(() => {
    const phaseKey = `${timerState.phase}-${timerState.cycleCount}`;
    if (lastPhaseRef.current !== phaseKey) {
      lastPhaseRef.current = phaseKey;
      setTotalMs(getPhaseDurationMs(timerState.phase, settings.timer));
    }
  }, [timerState.phase, timerState.cycleCount, settings.timer]);

  // ─── Public API ───────────────────────────────────────────────────────────────

  const start = useCallback(() => {
    const newState = startSession(settings.timer);
    setTimerState(newState);
    setTotalMs(getPhaseDurationMs(newState.phase, settings.timer));
    setRemainingMs(getRemainingMs(newState));
  }, [settings.timer]);

  const pause = useCallback(() => {
    setTimerState((prev) => {
      const paused = pauseTimer(prev);
      return paused;
    });
  }, []);

  const resume = useCallback(() => {
    setTimerState((prev) => resumeTimer(prev));
  }, []);

  const reset = useCallback(() => {
    stopInterval();
    setTimerState(resetTimer());
    setRemainingMs(0);
    setTotalMs(0);
  }, [stopInterval]);

  const skip = useCallback(() => {
    setTimerState((prev) => {
      const skipped = skipPhase(prev, settings.timer);
      setTotalMs(getPhaseDurationMs(skipped.phase, settings.timer));
      setRemainingMs(getRemainingMs(skipped));
      return skipped;
    });
  }, [settings.timer]);

  const progress = totalMs > 0 ? getPhaseProgress(remainingMs, totalMs) : 0;

  return {
    timerState,
    remainingMs,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
    isRunning: timerState.status === 'running',
    isPaused: timerState.status === 'paused',
    isIdle: timerState.status === 'idle',
    totalMs,
  };
}

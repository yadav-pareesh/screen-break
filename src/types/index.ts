// ─── Timer Types ────────────────────────────────────────────────────────────

export type TimerPhase = 'focus' | 'eyeBreak' | 'movementBreak';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'break' | 'completed';

export interface TimerState {
  status: TimerStatus;
  phase: TimerPhase;
  targetTimestamp: number | null; // epoch ms when current phase ends
  pausedRemaining: number | null; // ms remaining when paused
  sessionStartTime: number | null; // epoch ms when session started
  cycleCount: number; // number of focus cycles completed
  lastNotifiedPhase: TimerPhase | null; // prevent duplicate notifications
}

// ─── Settings Types ──────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

export interface TimerSettings {
  focusDurationMin: number; // 5–120
  eyeBreakDurationSec: number; // 10–120
  movementIntervalMin: number; // 10–180
  movementDurationMin: number; // 1–10
  eyeBreakEnabled: boolean;
  movementBreakEnabled: boolean;
  autoStartNextPhase: boolean;
  pauseWhenHidden: boolean;
  autoResumeAfterBreak: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  eyeBreak: boolean;
  movementBreak: boolean;
  sessionComplete: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0–1
}

export interface AppearanceSettings {
  theme: ThemeMode;
  reducedMotion: boolean;
  largeTimer: boolean;
  highContrast: boolean;
}

export interface AppSettings {
  timer: TimerSettings;
  notifications: NotificationSettings;
  sound: SoundSettings;
  appearance: AppearanceSettings;
  onboardingCompleted: boolean;
}

// ─── Statistics Types ────────────────────────────────────────────────────────

export interface DayStats {
  date: string; // ISO date string YYYY-MM-DD
  focusMinutes: number;
  eyeBreaksCompleted: number;
  movementBreaksCompleted: number;
  sessionsCompleted: number;
  movementMinutes: number;
}

export interface Statistics {
  days: Record<string, DayStats>;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalSessions: number;
}

// ─── Exercise Types ──────────────────────────────────────────────────────────

export type ExerciseArea = 'neck' | 'wrists' | 'shoulders' | 'back' | 'legs';
export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export interface ExerciseStep {
  instruction: string;
  durationSec: number;
}

export interface Exercise {
  id: string;
  name: string;
  area: ExerciseArea;
  durationSec: number;
  difficulty: ExerciseDifficulty;
  steps: ExerciseStep[];
  safetyNote: string;
  svgKey: string; // references SVG component
}

// ─── Session Types ────────────────────────────────────────────────────────────

export interface ActiveSession {
  startTime: number; // epoch ms
  eyeBreaksCompleted: number;
  movementBreaksCompleted: number;
  focusCyclesCompleted: number;
}

// ─── Browser Capability Types ─────────────────────────────────────────────────

export interface BrowserCapabilities {
  notifications: boolean;
  documentPiP: boolean;
  serviceWorker: boolean;
  broadcastChannel: boolean;
  pageVisibility: boolean;
  audioContext: boolean;
}

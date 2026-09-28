import type { AppSettings, TimerSettings, NotificationSettings, SoundSettings, AppearanceSettings, Statistics, DayStats } from '../types';

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const PREFIX = 'ergobreak:v1';

export const STORAGE_KEYS = {
  settings: `${PREFIX}:settings`,
  statistics: `${PREFIX}:statistics`,
  onboarding: `${PREFIX}:onboarding`,
} as const;

// ─── Default Values ───────────────────────────────────────────────────────────

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusDurationMin: 20,
  eyeBreakDurationSec: 20,
  movementIntervalMin: 60,
  movementDurationMin: 3,
  eyeBreakEnabled: true,
  movementBreakEnabled: true,
  autoStartNextPhase: true,
  pauseWhenHidden: false,
  autoResumeAfterBreak: true,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  eyeBreak: true,
  movementBreak: true,
  sessionComplete: true,
};

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.5,
};

export const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: 'system',
  reducedMotion: false,
  largeTimer: false,
  highContrast: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  timer: DEFAULT_TIMER_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  sound: DEFAULT_SOUND_SETTINGS,
  appearance: DEFAULT_APPEARANCE_SETTINGS,
  onboardingCompleted: false,
};

export const DEFAULT_STATISTICS: Statistics = {
  days: {},
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalSessions: 0,
};

// ─── Safe Storage Helpers ─────────────────────────────────────────────────────

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable or quota exceeded — silently ignore
  }
}

function safeParse<T>(json: string | null, fallback: T): T {
  if (json === null) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// ─── Settings Persistence ─────────────────────────────────────────────────────

export function loadSettings(): AppSettings {
  const raw = safeGetItem(STORAGE_KEYS.settings);
  const parsed = safeParse<Partial<AppSettings>>(raw, {});
  return {
    timer: { ...DEFAULT_SETTINGS.timer, ...(parsed.timer ?? {}) },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications ?? {}) },
    sound: { ...DEFAULT_SETTINGS.sound, ...(parsed.sound ?? {}) },
    appearance: { ...DEFAULT_SETTINGS.appearance, ...(parsed.appearance ?? {}) },
    onboardingCompleted: parsed.onboardingCompleted ?? false,
  };
}

export function saveSettings(settings: AppSettings): void {
  safeSetItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

// ─── Statistics Persistence ───────────────────────────────────────────────────

export function loadStatistics(): Statistics {
  const raw = safeGetItem(STORAGE_KEYS.statistics);
  const parsed = safeParse<Partial<Statistics>>(raw, {});
  return {
    days: parsed.days ?? {},
    streak: parsed.streak ?? 0,
    longestStreak: parsed.longestStreak ?? 0,
    lastActiveDate: parsed.lastActiveDate ?? null,
    totalSessions: parsed.totalSessions ?? 0,
  };
}

export function saveStatistics(stats: Statistics): void {
  safeSetItem(STORAGE_KEYS.statistics, JSON.stringify(stats));
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTodayStats(stats: Statistics): DayStats {
  const key = getTodayKey();
  return stats.days[key] ?? {
    date: key,
    focusMinutes: 0,
    eyeBreaksCompleted: 0,
    movementBreaksCompleted: 0,
    sessionsCompleted: 0,
    movementMinutes: 0,
  };
}

export function updateTodayStats(
  stats: Statistics,
  update: Partial<DayStats>
): Statistics {
  const key = getTodayKey();
  const existing = getTodayStats(stats);
  const updated: DayStats = {
    ...existing,
    date: key,
    focusMinutes: existing.focusMinutes + (update.focusMinutes ?? 0),
    eyeBreaksCompleted: existing.eyeBreaksCompleted + (update.eyeBreaksCompleted ?? 0),
    movementBreaksCompleted: existing.movementBreaksCompleted + (update.movementBreaksCompleted ?? 0),
    sessionsCompleted: existing.sessionsCompleted + (update.sessionsCompleted ?? 0),
    movementMinutes: existing.movementMinutes + (update.movementMinutes ?? 0),
  };
  return {
    ...stats,
    days: { ...stats.days, [key]: updated },
  };
}

export function recalculateStreak(stats: Statistics): Statistics {
  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  const todayStats = stats.days[today];
  const hasTodayActivity = todayStats && (todayStats.eyeBreaksCompleted > 0 || todayStats.movementBreaksCompleted > 0);

  let newStreak = stats.streak;

  if (hasTodayActivity) {
    if (stats.lastActiveDate === null || stats.lastActiveDate === yesterday.toISOString().slice(0, 10)) {
      newStreak = (stats.lastActiveDate === yesterdayKey ? stats.streak : 0) + 1;
    } else if (stats.lastActiveDate !== today) {
      newStreak = 1;
    }
  }

  return {
    ...stats,
    streak: newStreak,
    longestStreak: Math.max(stats.longestStreak, newStreak),
    lastActiveDate: hasTodayActivity ? today : stats.lastActiveDate,
  };
}

import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../types';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const updateSettings = useCallback((update: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...update };
      saveSettings(next);
      return next;
    });
  }, []);

  const updateTimerSettings = useCallback(
    (update: Partial<AppSettings['timer']>) => {
      setSettings((prev) => {
        const next = { ...prev, timer: { ...prev.timer, ...update } };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const updateNotificationSettings = useCallback(
    (update: Partial<AppSettings['notifications']>) => {
      setSettings((prev) => {
        const next = { ...prev, notifications: { ...prev.notifications, ...update } };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const updateSoundSettings = useCallback(
    (update: Partial<AppSettings['sound']>) => {
      setSettings((prev) => {
        const next = { ...prev, sound: { ...prev.sound, ...update } };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const updateAppearanceSettings = useCallback(
    (update: Partial<AppSettings['appearance']>) => {
      setSettings((prev) => {
        const next = { ...prev, appearance: { ...prev.appearance, ...update } };
        saveSettings(next);
        return next;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = settings.appearance.theme;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.appearance.theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (settings.appearance.theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [settings.appearance.theme]);

  return {
    settings,
    updateSettings,
    updateTimerSettings,
    updateNotificationSettings,
    updateSoundSettings,
    updateAppearanceSettings,
    resetSettings,
  };
}

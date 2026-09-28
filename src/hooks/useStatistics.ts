import { useState, useCallback } from 'react';
import type { Statistics } from '../types';
import { loadStatistics, saveStatistics } from '../utils/storage';

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics>(() => loadStatistics());

  const updateStatistics = useCallback((updater: (prev: Statistics) => Statistics) => {
    setStatistics((prev) => {
      const next = updater(prev);
      saveStatistics(next);
      return next;
    });
  }, []);

  const setStatisticsDirectly = useCallback((stats: Statistics) => {
    setStatistics(stats);
    saveStatistics(stats);
  }, []);

  return { statistics, updateStatistics, setStatisticsDirectly };
}

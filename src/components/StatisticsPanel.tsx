import React, { memo } from 'react';
import { X, Eye, Activity, Clock, Flame, Calendar, TrendingUp } from 'lucide-react';
import type { Statistics } from '../types';
import { getTodayStats, getTodayKey } from '../utils/storage';

interface StatisticsPanelProps {
  statistics: Statistics;
  onClose: () => void;
}

export const StatisticsPanel = memo(function StatisticsPanel({
  statistics,
  onClose,
}: StatisticsPanelProps) {
  const today = getTodayStats(statistics);

  // Last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      key,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      stats: statistics.days[key] ?? null,
    };
  });

  const maxFocus = Math.max(1, ...last7Days.map((d) => d.stats?.focusMinutes ?? 0));
  const totalEyeBreaks = Object.values(statistics.days).reduce(
    (sum, d) => sum + d.eyeBreaksCompleted, 0
  );
  const totalMovementBreaks = Object.values(statistics.days).reduce(
    (sum, d) => sum + d.movementBreaksCompleted, 0
  );

  return (
    <div
      className="statistics-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      <div className="settings-header">
        <h2 id="stats-title" className="panel-title">Statistics</h2>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-icon"
          aria-label="Close statistics"
          id="stats-close-btn"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="settings-body">
        {/* Today overview */}
        <section aria-labelledby="today-stats">
          <h3 id="today-stats" className="settings-section-title">
            <Calendar size={16} />
            Today
          </h3>
          <div className="stats-overview-grid">
            <StatCard
              id="today-focus"
              icon={<Clock size={20} />}
              label="Focus Time"
              value={`${today.focusMinutes}m`}
              color="primary"
            />
            <StatCard
              id="today-eye"
              icon={<Eye size={20} />}
              label="Eye Breaks"
              value={today.eyeBreaksCompleted}
              color="eye"
            />
            <StatCard
              id="today-move"
              icon={<Activity size={20} />}
              label="Movement"
              value={today.movementBreaksCompleted}
              color="movement"
            />
            <StatCard
              id="today-streak"
              icon={<Flame size={20} />}
              label="Streak"
              value={`${statistics.streak}d`}
              color="streak"
            />
          </div>
        </section>

        {/* 7-day chart */}
        <section aria-labelledby="week-stats">
          <h3 id="week-stats" className="settings-section-title">
            <TrendingUp size={16} />
            Last 7 Days — Focus Time
          </h3>
          <div className="bar-chart" role="img" aria-label="7-day focus time bar chart">
            {last7Days.map((day) => {
              const focus = day.stats?.focusMinutes ?? 0;
              const height = maxFocus > 0 ? (focus / maxFocus) * 100 : 0;
              const isToday = day.key === getTodayKey();
              return (
                <div key={day.key} className="bar-chart-col">
                  <div
                    className={`bar-chart-bar ${isToday ? 'bar-chart-bar--today' : ''}`}
                    style={{ height: `${Math.max(4, height)}%` }}
                    title={`${day.label}: ${focus}m focus`}
                  />
                  <span className="bar-chart-label">{day.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* All-time stats */}
        <section aria-labelledby="alltime-stats">
          <h3 id="alltime-stats" className="settings-section-title">
            <Flame size={16} />
            All Time
          </h3>
          <div className="stats-list">
            <div className="stats-list-row">
              <span>Total Sessions</span>
              <strong>{statistics.totalSessions}</strong>
            </div>
            <div className="stats-list-row">
              <span>Total Eye Breaks</span>
              <strong>{totalEyeBreaks}</strong>
            </div>
            <div className="stats-list-row">
              <span>Total Movement Breaks</span>
              <strong>{totalMovementBreaks}</strong>
            </div>
            <div className="stats-list-row">
              <span>Longest Streak</span>
              <strong>{statistics.longestStreak} days</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

// ─── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'primary' | 'eye' | 'movement' | 'streak';
}

function StatCard({ id, icon, label, value, color }: StatCardProps) {
  return (
    <div id={id} className={`stat-card stat-card--${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

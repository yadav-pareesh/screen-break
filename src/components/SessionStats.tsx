import { memo } from 'react';
import { Eye, Activity, Clock, Flame, CheckCircle } from 'lucide-react';
import type { Statistics } from '../types';
import { getTodayStats } from '../utils/storage';

interface SessionStatsBarProps {
  statistics: Statistics;
}

export const SessionStatsBar = memo(function SessionStatsBar({ statistics }: SessionStatsBarProps) {
  const today = getTodayStats(statistics);

  const stats = [
    {
      id: 'eye-breaks',
      icon: <Eye size={16} aria-hidden="true" />,
      value: today.eyeBreaksCompleted,
      label: 'Eye breaks',
    },
    {
      id: 'movement-breaks',
      icon: <Activity size={16} aria-hidden="true" />,
      value: today.movementBreaksCompleted,
      label: 'Movement breaks',
    },
    {
      id: 'focus-time',
      icon: <Clock size={16} aria-hidden="true" />,
      value: `${today.focusMinutes}m`,
      label: 'Focus time',
    },
    {
      id: 'streak',
      icon: <Flame size={16} aria-hidden="true" />,
      value: statistics.streak,
      label: 'Day streak',
    },
  ];

  return (
    <div className="stats-bar" role="region" aria-label="Today's session statistics">
      {stats.map((stat) => (
        <div key={stat.id} className="stat-item" id={`stat-${stat.id}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

// ─── Break Phase Overlay Info ──────────────────────────────────────────────────

interface BreakInfoProps {
  phase: 'eyeBreak' | 'movementBreak';
  exerciseName?: string;
  onStartExercise?: () => void;
}

export const BreakInfo = memo(function BreakInfo({
  phase,
  exerciseName,
  onStartExercise,
}: BreakInfoProps) {
  if (phase === 'eyeBreak') {
    return (
      <div className="break-info break-info--eye">
        <div className="break-info-icon" aria-hidden="true">👀</div>
        <h2 className="break-info-title">20-20-20 Eye Rest</h2>
        <p className="break-info-description">
          Look at something approximately <strong>20 feet (6 meters) away</strong>.
          Let your eyes relax and blink naturally.
        </p>
      </div>
    );
  }

  return (
    <div className="break-info break-info--movement">
      <div className="break-info-icon" aria-hidden="true">🧘</div>
      <h2 className="break-info-title">Time to Move!</h2>
      {exerciseName && (
        <p className="break-info-description">
          Recommended: <strong>{exerciseName}</strong>
        </p>
      )}
      {onStartExercise && (
        <button
          id="btn-start-exercise"
          onClick={onStartExercise}
          className="btn btn-secondary"
        >
          <CheckCircle size={16} aria-hidden="true" />
          Start Exercise
        </button>
      )}
    </div>
  );
});

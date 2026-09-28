import { memo } from 'react';
import { formatTime } from '../utils/timerEngine';
import type { TimerPhase, TimerStatus } from '../types';

interface CircularTimerProps {
  remainingMs: number;
  progress: number; // 0–1
  phase: TimerPhase;
  status: TimerStatus;
  large?: boolean;
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  focus: 'var(--color-primary)',
  eyeBreak: 'var(--color-eye-break)',
  movementBreak: 'var(--color-movement-break)',
};

const PHASE_TRACK_COLORS: Record<TimerPhase, string> = {
  focus: 'var(--color-primary-muted)',
  eyeBreak: 'var(--color-eye-break-muted)',
  movementBreak: 'var(--color-movement-break-muted)',
};

const PHASE_LABELS: Record<TimerPhase, string> = {
  focus: 'Focus',
  eyeBreak: 'Eye Break',
  movementBreak: 'Move & Stretch',
};

export const CircularTimer = memo(function CircularTimer({
  remainingMs,
  progress,
  phase,
  status,
  large = false,
}: CircularTimerProps) {
  const size = large ? 280 : 220;
  const strokeWidth = large ? 10 : 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isIdle = status === 'idle';
  const isPaused = status === 'paused';

  return (
    <div
      className="circular-timer-container"
      role="timer"
      aria-label={`${PHASE_LABELS[phase]}: ${formatTime(remainingMs)} remaining`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="circular-timer-svg"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={PHASE_TRACK_COLORS[phase]}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        {!isIdle && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={PHASE_COLORS[phase]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s linear, stroke 0.4s ease' }}
          />
        )}
        {/* Glow effect on progress end */}
        {!isIdle && progress > 0.02 && (
          <circle
            cx={
              size / 2 +
              radius *
                Math.cos(
                  ((-90 + 360 * progress) * Math.PI) / 180
                )
            }
            cy={
              size / 2 +
              radius *
                Math.sin(
                  ((-90 + 360 * progress) * Math.PI) / 180
                )
            }
            r={strokeWidth / 2 + 2}
            fill={PHASE_COLORS[phase]}
            opacity="0.6"
          />
        )}
      </svg>

      {/* Center content */}
      <div className="circular-timer-center">
        <div className={`timer-phase-label ${phase}`}>
          {PHASE_LABELS[phase]}
        </div>
        <div className={`timer-display ${large ? 'timer-display--large' : ''} ${isPaused ? 'timer-display--paused' : ''}`}>
          {isIdle ? '--:--' : formatTime(remainingMs)}
        </div>
        {isPaused && (
          <div className="timer-status-badge">
            Paused
          </div>
        )}
      </div>
    </div>
  );
});

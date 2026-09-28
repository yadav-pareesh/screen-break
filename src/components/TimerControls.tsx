import { memo } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Square } from 'lucide-react';
import type { TimerStatus } from '../types';

interface TimerControlsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls = memo(function TimerControls({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isActive = isRunning || isPaused;

  return (
    <div className="timer-controls" role="group" aria-label="Timer controls">
      {isIdle ? (
        <button
          id="btn-start"
          onClick={onStart}
          className="btn btn-primary btn-lg"
          aria-label="Start focus session"
        >
          <Play size={20} aria-hidden="true" />
          Start Focus Session
        </button>
      ) : (
        <div className="timer-controls-active">
          <button
            id="btn-reset"
            onClick={onReset}
            className="btn btn-ghost btn-icon"
            aria-label="Reset timer"
            title="Reset (R)"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </button>

          {isRunning ? (
            <button
              id="btn-pause"
              onClick={onPause}
              className="btn btn-primary btn-icon-lg"
              aria-label="Pause timer"
              title="Pause (Space)"
            >
              <Pause size={22} aria-hidden="true" />
            </button>
          ) : (
            <button
              id="btn-resume"
              onClick={onResume}
              className="btn btn-primary btn-icon-lg"
              aria-label="Resume timer"
              title="Resume (Space)"
            >
              <Play size={22} aria-hidden="true" />
            </button>
          )}

          <button
            id="btn-skip"
            onClick={onSkip}
            className="btn btn-ghost btn-icon"
            aria-label="Skip to next phase"
            title="Skip (S)"
            disabled={!isActive}
          >
            <SkipForward size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {isActive && (
        <button
          id="btn-stop"
          onClick={onReset}
          className="btn btn-ghost btn-sm stop-btn"
          aria-label="Stop session"
        >
          <Square size={12} aria-hidden="true" />
          Stop Session
        </button>
      )}
    </div>
  );
});

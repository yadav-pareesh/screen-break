import { useState, useEffect, useCallback, memo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Exercise } from '../types';
import { getExerciseSVG } from './ExerciseSVG';

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: () => void;
  onClose: () => void;
  reducedMotion?: boolean;
}

export const ExercisePlayer = memo(function ExercisePlayer({
  exercise,
  onComplete,
  onClose,
  reducedMotion = false,
}: ExercisePlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimeLeft, setStepTimeLeft] = useState(exercise.steps[0]?.durationSec ?? 0);
  const [isPlaying, setIsPlaying] = useState(true);

  const step = exercise.steps[currentStep];
  const totalSteps = exercise.steps.length;

  const advanceStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setStepTimeLeft(exercise.steps[nextStep].durationSec);
    } else {
      onComplete();
    }
  }, [currentStep, totalSteps, exercise.steps, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepTimeLeft <= 0) {
      advanceStep();
      return;
    }
    const timer = setTimeout(() => {
      setStepTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [stepTimeLeft, isPlaying, advanceStep]);

  const goToPrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setStepTimeLeft(exercise.steps[prev].durationSec);
    }
  };

  const SVGComponent = getExerciseSVG(exercise.svgKey);
  const overallProgress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div
      className="exercise-player"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-player-title"
    >
      <div className="exercise-player-header">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-icon"
          aria-label="Close exercise"
          id="exercise-close-btn"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <h2 id="exercise-player-title" className="exercise-player-name">
          {exercise.name}
        </h2>
        <span className="exercise-area-badge">{exercise.area}</span>
      </div>

      {/* Overall progress */}
      <div className="exercise-overall-progress" aria-hidden="true">
        <div
          className="exercise-overall-progress-bar"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      <div className="exercise-player-body">
        {/* SVG Illustration */}
        <div className="exercise-svg-wrapper">
          <SVGComponent
            animated={!reducedMotion}
            className="exercise-illustration"
          />
        </div>

        {/* Step info */}
        <div className="exercise-step-info">
          <div className="exercise-step-counter">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <p className="exercise-step-instruction">{step?.instruction}</p>
        </div>

        {/* Countdown ring */}
        <div className="exercise-countdown" aria-live="polite" aria-atomic="true">
          <CircularCountdown
            timeLeft={stepTimeLeft}
            total={step?.durationSec ?? 1}
          />
        </div>

        {/* Safety note */}
        {currentStep === 0 && (
          <p className="exercise-safety-note">
            ⚠️ {exercise.safetyNote}
          </p>
        )}
      </div>

      <div className="exercise-player-footer">
        <button
          onClick={goToPrev}
          disabled={currentStep === 0}
          className="btn btn-ghost"
          aria-label="Previous step"
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Prev
        </button>

        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="btn btn-secondary"
          aria-label={isPlaying ? 'Pause exercise' : 'Resume exercise'}
        >
          {isPlaying ? 'Pause' : 'Resume'}
        </button>

        <button
          onClick={advanceStep}
          className="btn btn-primary"
          aria-label={currentStep < totalSteps - 1 ? 'Next step' : 'Complete exercise'}
        >
          {currentStep < totalSteps - 1 ? (
            <>Next <ChevronRight size={18} aria-hidden="true" /></>
          ) : (
            'Complete ✓'
          )}
        </button>
      </div>
    </div>
  );
});

// ─── Circular Countdown ───────────────────────────────────────────────────────

interface CircularCountdownProps {
  timeLeft: number;
  total: number;
}

function CircularCountdown({ timeLeft, total }: CircularCountdownProps) {
  const size = 80;
  const strokeWidth = 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? timeLeft / total : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="exercise-mini-timer">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s linear' }}
        />
      </svg>
      <span className="exercise-mini-time">{timeLeft}s</span>
    </div>
  );
}

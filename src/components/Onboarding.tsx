import { memo, useState } from 'react';
import { X } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const STEPS = [
  {
    id: 'step-2020',
    emoji: '👀',
    title: 'The 20-20-20 Rule',
    description:
      'Every 20 minutes, look at something 20 feet away for 20 seconds. This simple habit dramatically reduces digital eye strain.',
  },
  {
    id: 'step-movement',
    emoji: '🧘',
    title: 'Movement Breaks Matter',
    description:
      'Prolonged sitting is hard on your back, posture, and circulation. ErgoBreak reminds you to move with guided micro-exercises.',
  },
  {
    id: 'step-notifications',
    emoji: '🔔',
    title: 'Stay Notified',
    description:
      'Enable browser notifications to receive break reminders even when you\'re working in another tab. We\'ll ask only once.',
  },
  {
    id: 'step-pip',
    emoji: '🖥️',
    title: 'Picture-in-Picture',
    description:
      'Keep a floating mini-timer visible while you work in other tabs. Works in modern Chromium-based browsers.',
  },
];

export const Onboarding = memo(function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div
      className="onboarding-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="onboarding-card">
        <button
          onClick={onSkip}
          className="btn btn-ghost btn-icon onboarding-skip"
          aria-label="Skip onboarding"
          id="onboarding-skip-btn"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Progress dots */}
        <div className="onboarding-dots" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`onboarding-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="onboarding-icon" aria-hidden="true">
          {current.emoji}
        </div>
        <h2 id="onboarding-title" className="onboarding-title">
          {current.title}
        </h2>
        <p className="onboarding-description">{current.description}</p>

        {/* Navigation */}
        <div className="onboarding-actions">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="btn btn-ghost"
              id="onboarding-back"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={onComplete}
              className="btn btn-primary"
              id="onboarding-start"
            >
              Get Started 🚀
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn btn-primary"
              id="onboarding-next"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

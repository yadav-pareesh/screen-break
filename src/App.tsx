import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Settings, BarChart2, BookOpen, Keyboard } from 'lucide-react';
import { CircularTimer } from './components/CircularTimer';
import { TimerControls } from './components/TimerControls';
import { SessionStatsBar, BreakInfo } from './components/SessionStats';
import { PiPButton, openDocumentPiP, updatePiPContent, closePiP, isPiPOpen } from './components/PiP';
import { Onboarding } from './components/Onboarding';
import { useTimer } from './hooks/useTimer';
import { useSettings } from './hooks/useSettings';
import { useStatistics } from './hooks/useStatistics';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getRecommendedExercise } from './data/exercises';
import { unlockAudio } from './utils/audio';
import { getBrowserCapabilities } from './utils/browserCapabilities';
import { loadSettings, saveSettings } from './utils/storage';
import type { Exercise } from './types';

const SettingsPanel = lazy(() =>
  import('./components/SettingsPanel').then((m) => ({ default: m.SettingsPanel }))
);
const StatisticsPanel = lazy(() =>
  import('./components/StatisticsPanel').then((m) => ({ default: m.StatisticsPanel }))
);
const ExerciseLibrary = lazy(() =>
  import('./components/ExerciseLibrary').then((m) => ({ default: m.ExerciseLibrary }))
);
const ExercisePlayer = lazy(() =>
  import('./components/ExercisePlayer').then((m) => ({ default: m.ExercisePlayer }))
);

type ActivePanel = 'settings' | 'statistics' | 'exercises' | null;

export default function App() {
  const { settings, updateTimerSettings, updateNotificationSettings, updateSoundSettings, updateAppearanceSettings, resetSettings } = useSettings();
  const { statistics, setStatisticsDirectly } = useStatistics();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [lastExerciseId, setLastExerciseId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(!settings.onboardingCompleted);

  const {
    timerState,
    remainingMs,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
    isRunning,
    isPaused,
    isIdle,
  } = useTimer({
    settings,
    statistics,
    onStatisticsUpdate: setStatisticsDirectly,
  });

  const caps = getBrowserCapabilities();

  // ─── PiP Update ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isPiPActive) {
      updatePiPContent(timerState.phase, remainingMs, timerState.status);
    }
  }, [isPiPActive, timerState.phase, remainingMs, timerState.status]);

  // ─── Toggle PiP ─────────────────────────────────────────────────────────────

  const handleTogglePiP = useCallback(async () => {
    if (isPiPOpen()) {
      closePiP();
      setIsPiPActive(false);
      return;
    }
    const win = await openDocumentPiP('<div class="pip-phase">Focus</div><div class="pip-time">--:--</div>');
    if (win) {
      setIsPiPActive(true);
      win.addEventListener('pagehide', () => setIsPiPActive(false));
    }
  }, []);

  // ─── Movement break exercise recommendation ─────────────────────────────────

  const recommendedExercise = getRecommendedExercise(
    lastExerciseId,
    settings.timer.movementDurationMin * 60
  );

  // ─── Unlock audio on first interaction ────────────────────────────────────

  const handleFirstInteraction = useCallback(() => {
    unlockAudio();
  }, []);

  // ─── Pause/Resume toggle ─────────────────────────────────────────────────

  const handleSpacePress = useCallback(() => {
    if (isIdle) start();
    else if (isRunning) pause();
    else if (isPaused) resume();
  }, [isIdle, isRunning, isPaused, start, pause, resume]);

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────

  useKeyboardShortcuts({
    onSpacePress: handleSpacePress,
    onRPress: reset,
    onSPress: skip,
    onPPress: caps.documentPiP ? handleTogglePiP : undefined,
    onEPress: () => setActivePanel((p) => (p === 'exercises' ? null : 'exercises')),
    onEscapePress: () => {
      setActivePanel(null);
      setActiveExercise(null);
    },
  });

  // ─── Onboarding completion ────────────────────────────────────────────────

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    const s = loadSettings();
    saveSettings({ ...s, onboardingCompleted: true });
  }, []);

  // ─── Backdrop click ────────────────────────────────────────────────────────

  const handleBackdropClick = useCallback(() => {
    setActivePanel(null);
    setActiveExercise(null);
  }, []);

  const isBreakPhase = timerState.phase === 'eyeBreak' || timerState.phase === 'movementBreak';
  const isActiveBreak = isBreakPhase && (isRunning || isPaused);
  const reducedMotion = settings.appearance.reducedMotion ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className={`app ${settings.appearance.highContrast ? 'high-contrast' : ''}`}
      onClick={handleFirstInteraction}
    >
      {/* Onboarding */}
      {showOnboarding && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      )}

      {/* Main layout */}
      <div className="app-layout">
        {/* Header */}
        <header className="app-header">
          <div className="app-logo">
            <span className="logo-icon" aria-hidden="true">🧘</span>
            <span className="logo-text">ErgoBreak</span>
          </div>
          <nav className="app-nav" aria-label="Main navigation">
            <PiPButton
              remainingMs={remainingMs}
              phase={timerState.phase}
              status={timerState.status}
              onToggle={handleTogglePiP}
              isPiPActive={isPiPActive}
            />
            <button
              id="nav-exercises"
              onClick={() => setActivePanel((p) => (p === 'exercises' ? null : 'exercises'))}
              className={`btn btn-ghost btn-sm ${activePanel === 'exercises' ? 'btn-active' : ''}`}
              aria-label="Exercise library"
              title="Exercises (E)"
            >
              <BookOpen size={16} aria-hidden="true" />
              <span className="nav-label">Exercises</span>
            </button>
            <button
              id="nav-statistics"
              onClick={() => setActivePanel((p) => (p === 'statistics' ? null : 'statistics'))}
              className={`btn btn-ghost btn-sm ${activePanel === 'statistics' ? 'btn-active' : ''}`}
              aria-label="View statistics"
            >
              <BarChart2 size={16} aria-hidden="true" />
              <span className="nav-label">Stats</span>
            </button>
            <button
              id="nav-settings"
              onClick={() => setActivePanel((p) => (p === 'settings' ? null : 'settings'))}
              className={`btn btn-ghost btn-icon ${activePanel === 'settings' ? 'btn-active' : ''}`}
              aria-label="Open settings"
            >
              <Settings size={18} aria-hidden="true" />
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main className="app-main" aria-label="ErgoBreak timer">

          {/* Break phase overlay */}
          {isActiveBreak && (
            <div
              className={`break-overlay break-overlay--${timerState.phase}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <BreakInfo
                phase={timerState.phase as 'eyeBreak' | 'movementBreak'}
                exerciseName={timerState.phase === 'movementBreak' ? recommendedExercise.name : undefined}
                onStartExercise={
                  timerState.phase === 'movementBreak'
                    ? () => {
                        setActiveExercise(recommendedExercise);
                        setLastExerciseId(recommendedExercise.id);
                      }
                    : undefined
                }
              />
            </div>
          )}

          {/* Timer */}
          <div className="timer-section">
            <CircularTimer
              remainingMs={remainingMs}
              progress={progress}
              phase={timerState.phase}
              status={timerState.status}
              large={settings.appearance.largeTimer}
            />
            <TimerControls
              status={timerState.status}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
              onSkip={skip}
            />
          </div>

          {/* Phase info */}
          {!isIdle && !isActiveBreak && (
            <div className="focus-info" aria-live="polite">
              <p className="focus-hint">
                {timerState.phase === 'focus' &&
                  `Eye break in ${Math.ceil(remainingMs / 60000)} min`}
              </p>
            </div>
          )}

          {/* Stats bar */}
          <SessionStatsBar statistics={statistics} />

          {/* Keyboard shortcuts hint */}
          <div className="shortcuts-hint" aria-hidden="true">
            <Keyboard size={12} />
            <span>Space: pause · R: reset · S: skip · E: exercises · P: PiP</span>
          </div>
        </main>
      </div>

      {/* Slide-over panels backdrop */}
      {activePanel && (
        <div
          className="panel-backdrop"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Settings Panel */}
      {activePanel === 'settings' && (
        <div className="panel-container">
          <Suspense fallback={<PanelLoading />}>
            <SettingsPanel
              settings={settings}
              onUpdateTimer={updateTimerSettings}
              onUpdateNotifications={updateNotificationSettings}
              onUpdateSound={updateSoundSettings}
              onUpdateAppearance={updateAppearanceSettings}
              onReset={resetSettings}
              onClose={() => setActivePanel(null)}
            />
          </Suspense>
        </div>
      )}

      {/* Statistics Panel */}
      {activePanel === 'statistics' && (
        <div className="panel-container">
          <Suspense fallback={<PanelLoading />}>
            <StatisticsPanel
              statistics={statistics}
              onClose={() => setActivePanel(null)}
            />
          </Suspense>
        </div>
      )}

      {/* Exercise Library */}
      {activePanel === 'exercises' && (
        <div className="panel-container panel-container--wide">
          <Suspense fallback={<PanelLoading />}>
            <ExerciseLibrary
              reducedMotion={reducedMotion}
              onClose={() => setActivePanel(null)}
            />
          </Suspense>
        </div>
      )}

      {/* Active Exercise Player (from movement break) */}
      {activeExercise && (
        <div className="panel-backdrop exercise-backdrop" onClick={() => setActiveExercise(null)}>
          <div
            className="panel-container panel-container--center"
            onClick={(e) => e.stopPropagation()}
          >
            <Suspense fallback={<PanelLoading />}>
              <ExercisePlayer
                exercise={activeExercise}
                reducedMotion={reducedMotion}
                onComplete={() => setActiveExercise(null)}
                onClose={() => setActiveExercise(null)}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelLoading() {
  return (
    <div className="panel-loading">
      <div className="loading-spinner" aria-label="Loading..." />
    </div>
  );
}

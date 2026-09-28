import { useState, memo, lazy, Suspense } from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { Exercise, ExerciseArea } from '../types';
import { filterExercises } from '../data/exercises';
import { getExerciseSVG } from './ExerciseSVG';

const ExercisePlayer = lazy(() =>
  import('./ExercisePlayer').then((m) => ({ default: m.ExercisePlayer }))
);

interface ExerciseLibraryProps {
  onClose: () => void;
  reducedMotion?: boolean;
}

const AREA_OPTIONS: { value: ExerciseArea | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '💪' },
  { value: 'neck', label: 'Neck', emoji: '🦒' },
  { value: 'wrists', label: 'Wrists', emoji: '🖐️' },
  { value: 'shoulders', label: 'Shoulders', emoji: '🏋️' },
  { value: 'back', label: 'Back', emoji: '🧘' },
  { value: 'legs', label: 'Legs', emoji: '🦵' },
];

export const ExerciseLibrary = memo(function ExerciseLibrary({
  onClose,
  reducedMotion = false,
}: ExerciseLibraryProps) {
  const [selectedArea, setSelectedArea] = useState<ExerciseArea | 'all'>('all');
  const [query, setQuery] = useState('');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const exercises = filterExercises(selectedArea, query);

  if (activeExercise) {
    return (
      <Suspense fallback={<div className="loading-spinner" />}>
        <ExercisePlayer
          exercise={activeExercise}
          reducedMotion={reducedMotion}
          onComplete={() => setActiveExercise(null)}
          onClose={() => setActiveExercise(null)}
        />
      </Suspense>
    );
  }

  return (
    <div
      className="exercise-library"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-library-title"
    >
      <div className="exercise-library-header">
        <div>
          <h2 id="exercise-library-title" className="panel-title">
            Exercise Library
          </h2>
          <p className="panel-subtitle">
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-ghost btn-icon"
          aria-label="Close exercise library"
          id="exercise-library-close"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={16} className="search-icon" aria-hidden="true" />
        <input
          id="exercise-search"
          type="search"
          placeholder="Search exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          aria-label="Search exercises"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="btn btn-ghost btn-icon search-clear"
            aria-label="Clear search"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Area filters */}
      <div className="area-filters" role="group" aria-label="Filter by body area">
        <Filter size={14} className="filter-icon" aria-hidden="true" />
        {AREA_OPTIONS.map((area) => (
          <button
            key={area.value}
            id={`filter-${area.value}`}
            onClick={() => setSelectedArea(area.value)}
            className={`area-filter-btn ${selectedArea === area.value ? 'active' : ''}`}
            aria-pressed={selectedArea === area.value}
          >
            <span aria-hidden="true">{area.emoji}</span>
            {area.label}
          </button>
        ))}
      </div>

      {/* Exercise grid */}
      <div className="exercise-grid" role="list">
        {exercises.length === 0 ? (
          <div className="empty-state">
            <p>No exercises found for your search.</p>
            <button
              onClick={() => { setQuery(''); setSelectedArea('all'); }}
              className="btn btn-ghost btn-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              reducedMotion={reducedMotion}
              onClick={() => setActiveExercise(exercise)}
            />
          ))
        )}
      </div>
    </div>
  );
});

// ─── Exercise Card ─────────────────────────────────────────────────────────────

interface ExerciseCardProps {
  exercise: Exercise;
  reducedMotion: boolean;
  onClick: () => void;
}

function ExerciseCard({ exercise, reducedMotion, onClick }: ExerciseCardProps) {
  const SVGComponent = getExerciseSVG(exercise.svgKey);
  const durationMin = Math.floor(exercise.durationSec / 60);
  const durationSec = exercise.durationSec % 60;
  const durationLabel =
    durationMin > 0
      ? durationSec > 0
        ? `${durationMin}m ${durationSec}s`
        : `${durationMin}m`
      : `${durationSec}s`;

  return (
    <button
      className="exercise-card"
      onClick={onClick}
      aria-label={`${exercise.name}, ${exercise.area}, ${durationLabel}`}
      role="listitem"
    >
      <div className="exercise-card-svg">
        <SVGComponent animated={!reducedMotion} className="exercise-card-illustration" />
      </div>
      <div className="exercise-card-info">
        <h3 className="exercise-card-name">{exercise.name}</h3>
        <div className="exercise-card-meta">
          <span className={`difficulty-badge difficulty-${exercise.difficulty}`}>
            {exercise.difficulty}
          </span>
          <span className="exercise-card-duration">⏱ {durationLabel}</span>
        </div>
        <p className="exercise-card-hint">{exercise.steps[0]?.instruction}</p>
      </div>
    </button>
  );
}

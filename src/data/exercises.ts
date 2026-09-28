import type { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  // ─── Neck ───────────────────────────────────────────────────────────────────
  {
    id: 'neck-rotation',
    name: 'Neck Rotation',
    area: 'neck',
    durationSec: 60,
    difficulty: 'easy',
    svgKey: 'neck-rotation',
    safetyNote: 'Move slowly and gently. Stop if you feel pain or dizziness.',
    steps: [
      { instruction: 'Sit tall with your shoulders relaxed and your chin level.', durationSec: 5 },
      { instruction: 'Slowly turn your head to the right as far as comfortable. Hold for 3 seconds.', durationSec: 10 },
      { instruction: 'Return to center, then slowly turn to the left. Hold for 3 seconds.', durationSec: 10 },
      { instruction: 'Repeat 4 more times on each side, breathing steadily.', durationSec: 35 },
    ],
  },
  {
    id: 'neck-side-stretch',
    name: 'Neck Side Stretch',
    area: 'neck',
    durationSec: 60,
    difficulty: 'easy',
    svgKey: 'neck-side-stretch',
    safetyNote: 'Keep your shoulders down. Do not pull hard on your neck.',
    steps: [
      { instruction: 'Sit upright and drop your right ear toward your right shoulder.', durationSec: 5 },
      { instruction: 'Gently place your right hand on the left side of your head for a light additional stretch. Hold for 15 seconds.', durationSec: 20 },
      { instruction: 'Return to center and repeat on the left side for 15 seconds.', durationSec: 20 },
      { instruction: 'Relax and roll your shoulders back to finish.', durationSec: 15 },
    ],
  },
  {
    id: 'chin-tuck',
    name: 'Chin Tuck',
    area: 'neck',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'chin-tuck',
    safetyNote: 'This corrects forward-head posture. Keep movements small and gentle.',
    steps: [
      { instruction: 'Sit tall and look straight ahead.', durationSec: 5 },
      { instruction: 'Gently pull your chin straight back, creating a "double chin." Hold for 5 seconds.', durationSec: 10 },
      { instruction: 'Release and repeat 5 times, keeping your eyes level throughout.', durationSec: 30 },
    ],
  },
  {
    id: 'upper-trap-stretch',
    name: 'Upper Trapezius Stretch',
    area: 'neck',
    durationSec: 60,
    difficulty: 'easy',
    svgKey: 'neck-side-stretch',
    safetyNote: 'Avoid shrugging your opposite shoulder. Keep it relaxed and down.',
    steps: [
      { instruction: 'Sit tall with your left hand behind your back or at your side.', durationSec: 5 },
      { instruction: 'Tilt your right ear to your right shoulder while looking slightly down-left. Hold for 20 seconds.', durationSec: 25 },
      { instruction: 'Switch sides and hold for 20 seconds. Breathe deeply throughout.', durationSec: 30 },
    ],
  },

  // ─── Wrists & Hands ──────────────────────────────────────────────────────────
  {
    id: 'wrist-flexor-stretch',
    name: 'Wrist Flexor Stretch',
    area: 'wrists',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'wrist-flexor',
    safetyNote: 'Stretch until you feel tension, not pain. Stop if you feel sharp sensations.',
    steps: [
      { instruction: 'Extend your right arm in front with the palm facing up.', durationSec: 5 },
      { instruction: 'With your left hand, gently pull the fingers back toward your body. Hold for 15 seconds.', durationSec: 20 },
      { instruction: 'Switch to the left arm and hold for 15 seconds.', durationSec: 20 },
    ],
  },
  {
    id: 'wrist-extensor-stretch',
    name: 'Wrist Extensor Stretch',
    area: 'wrists',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'wrist-extensor',
    safetyNote: 'This counteracts the constant wrist extension from typing.',
    steps: [
      { instruction: 'Extend your right arm with the palm facing down.', durationSec: 5 },
      { instruction: 'With your left hand, gently push the back of your right hand downward. Hold for 15 seconds.', durationSec: 20 },
      { instruction: 'Switch arms and hold for 15 seconds.', durationSec: 20 },
    ],
  },
  {
    id: 'finger-stretch',
    name: 'Finger Stretch & Spread',
    area: 'wrists',
    durationSec: 30,
    difficulty: 'easy',
    svgKey: 'finger-stretch',
    safetyNote: 'Ideal for relieving tension from extended typing and mouse use.',
    steps: [
      { instruction: 'Hold both hands in front of you with fingers together.', durationSec: 5 },
      { instruction: 'Slowly spread your fingers as wide as possible. Hold for 5 seconds.', durationSec: 10 },
      { instruction: 'Make a gentle fist, then release. Repeat the full sequence 3 times.', durationSec: 15 },
    ],
  },
  {
    id: 'wrist-circles',
    name: 'Wrist Circles',
    area: 'wrists',
    durationSec: 30,
    difficulty: 'easy',
    svgKey: 'wrist-circles',
    safetyNote: 'Go slowly and stop if you feel grinding or pain.',
    steps: [
      { instruction: 'Make loose fists with both hands.', durationSec: 5 },
      { instruction: 'Slowly rotate both wrists clockwise 8 times.', durationSec: 12 },
      { instruction: 'Reverse direction and rotate counter-clockwise 8 times.', durationSec: 13 },
    ],
  },

  // ─── Shoulders ───────────────────────────────────────────────────────────────
  {
    id: 'shoulder-rolls',
    name: 'Shoulder Rolls',
    area: 'shoulders',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'shoulder-rolls',
    safetyNote: 'Perfect for relieving shoulder tension from keyboard and mouse use.',
    steps: [
      { instruction: 'Sit tall with your arms relaxed at your sides.', durationSec: 5 },
      { instruction: 'Roll both shoulders forward in slow circles 8 times.', durationSec: 15 },
      { instruction: 'Reverse and roll backward 8 times.', durationSec: 15 },
      { instruction: 'Finish by holding your shoulders back and down for 5 seconds.', durationSec: 10 },
    ],
  },
  {
    id: 'shoulder-blade-squeeze',
    name: 'Shoulder Blade Squeeze',
    area: 'shoulders',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'shoulder-squeeze',
    safetyNote: 'Great for correcting rounded shoulders from desk work.',
    steps: [
      { instruction: 'Sit tall and place your hands on your thighs.', durationSec: 5 },
      { instruction: 'Pull your shoulder blades toward each other as if squeezing a pencil between them. Hold for 5 seconds.', durationSec: 15 },
      { instruction: 'Release and repeat 5 times, focusing on drawing the shoulder blades back and down.', durationSec: 25 },
    ],
  },

  // ─── Back ─────────────────────────────────────────────────────────────────────
  {
    id: 'seated-spinal-twist',
    name: 'Seated Spinal Twist',
    area: 'back',
    durationSec: 60,
    difficulty: 'easy',
    svgKey: 'spinal-twist',
    safetyNote: 'Rotate from the spine, not just the neck. Keep both feet flat on the floor.',
    steps: [
      { instruction: 'Sit tall with feet flat on the floor.', durationSec: 5 },
      { instruction: 'Place your right hand on your left knee. Inhale to lengthen your spine.', durationSec: 10 },
      { instruction: 'Exhale and gently rotate to the left, looking over your left shoulder. Hold for 20 seconds.', durationSec: 20 },
      { instruction: 'Return to center, then repeat on the right side for 20 seconds.', durationSec: 25 },
    ],
  },
  {
    id: 'seated-side-stretch',
    name: 'Seated Side Stretch',
    area: 'back',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'side-stretch',
    safetyNote: 'Do not lean forward or backward — stay in the same plane.',
    steps: [
      { instruction: 'Sit tall with your feet flat. Raise your right arm overhead.', durationSec: 5 },
      { instruction: 'Lean gently to the left, stretching the right side of your torso. Hold for 15 seconds.', durationSec: 20 },
      { instruction: 'Return to center and switch sides for 15 seconds.', durationSec: 20 },
    ],
  },
  {
    id: 'lower-back-stretch',
    name: 'Seated Lower Back Stretch',
    area: 'back',
    durationSec: 60,
    difficulty: 'easy',
    svgKey: 'lower-back',
    safetyNote: 'Bring the knee gently toward your chest. Do not force the movement.',
    steps: [
      { instruction: 'Sit tall near the edge of your chair.', durationSec: 5 },
      { instruction: 'Lift your right knee and hug it toward your chest. Hold for 20 seconds.', durationSec: 20 },
      { instruction: 'Switch to the left knee and hold for 20 seconds.', durationSec: 20 },
      { instruction: 'Gently lower and sit tall again.', durationSec: 15 },
    ],
  },

  // ─── Legs ─────────────────────────────────────────────────────────────────────
  {
    id: 'ankle-circles',
    name: 'Ankle Circles',
    area: 'legs',
    durationSec: 30,
    difficulty: 'easy',
    svgKey: 'ankle-circles',
    safetyNote: 'Improves circulation in the lower legs during extended sitting.',
    steps: [
      { instruction: 'Lift your right foot slightly off the floor.', durationSec: 5 },
      { instruction: 'Rotate your ankle clockwise 8 times, then counter-clockwise 8 times.', durationSec: 12 },
      { instruction: 'Switch to the left foot and repeat.', durationSec: 13 },
    ],
  },
  {
    id: 'seated-leg-extension',
    name: 'Seated Leg Extension',
    area: 'legs',
    durationSec: 45,
    difficulty: 'easy',
    svgKey: 'leg-extension',
    safetyNote: 'Engage your thigh muscles as you extend. Do not lock your knee forcefully.',
    steps: [
      { instruction: 'Sit tall and hold the sides of your chair for support.', durationSec: 5 },
      { instruction: 'Slowly extend your right leg until it is nearly straight. Hold for 5 seconds.', durationSec: 10 },
      { instruction: 'Lower and repeat on the left leg. Perform 5 repetitions on each side.', durationSec: 30 },
    ],
  },
];

// ─── Exercise Selection Utility ───────────────────────────────────────────────

export function getRecommendedExercise(
  previousExerciseId: string | null,
  availableDurationSec: number
): Exercise {
  const suitable = EXERCISES.filter(
    (ex) =>
      ex.durationSec <= availableDurationSec + 30 && // 30s grace
      ex.id !== previousExerciseId
  );
  const pool = suitable.length > 0 ? suitable : EXERCISES;
  const idx = Math.floor(Date.now() / 1000) % pool.length;
  return pool[idx];
}

export function filterExercises(
  area: string | null,
  query: string
): Exercise[] {
  return EXERCISES.filter((ex) => {
    const matchesArea = !area || area === 'all' || ex.area === area;
    const matchesQuery =
      !query ||
      ex.name.toLowerCase().includes(query.toLowerCase()) ||
      ex.area.toLowerCase().includes(query.toLowerCase());
    return matchesArea && matchesQuery;
  });
}

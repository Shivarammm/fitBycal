// MET-based workout calorie calculator

// MET values by exercise type
const COMPOUND_HEAVY = ['deadlift', 'squat', 'barbell_squat', 'leg_press', 'hip_thrust', 'romanian_deadlift', 'bulgarian_split_squat'];
const COMPOUND_MEDIUM = ['bench_press', 'incline_bench', 'decline_bench', 'overhead_press', 'barbell_row', 'pull_ups', 't_bar_row', 'chest_dips', 'arnold_press', 'lunges'];
const CARDIO = ['running', 'cycling', 'jump_rope', 'burpees', 'rowing', 'stair_climber', 'swimming', 'mountain_climbers'];

function getMET(exerciseId: string): number {
  const id = exerciseId.toLowerCase().replace(/\s+/g, '_');
  if (CARDIO.some(c => id.includes(c))) return 7;
  if (COMPOUND_HEAVY.some(c => id.includes(c))) return 6;
  if (COMPOUND_MEDIUM.some(c => id.includes(c))) return 5;
  return 4; // isolation / light
}

/**
 * MET-based calorie calculation with intensity boost.
 * 
 * baseCalories = (MET × 3.5 × userWeight / 200) × duration
 * duration = sets × 2.5
 * intensityFactor = weightLifted / userWeight
 * finalCalories = baseCalories × (1 + intensityFactor × 0.3)
 */
export function calculateWorkoutCalories(
  exerciseId: string,
  sets: number,
  reps: number,
  weightLifted: number,
  userWeight: number
): number {
  if (sets <= 0 || reps <= 0) return 0;
  
  const bodyWeight = userWeight > 0 ? userWeight : 65; // fallback 65kg
  const met = getMET(exerciseId);
  const duration = sets * 2.5;
  
  // MET formula: (MET × 3.5 × bodyWeight / 200) × duration
  const baseCalories = (met * 3.5 * bodyWeight / 200) * duration;
  
  // Intensity boost based on weight lifted relative to body weight
  const intensityFactor = weightLifted > 0 ? weightLifted / bodyWeight : 0;
  const finalCalories = baseCalories * (1 + intensityFactor * 0.3);
  
  return Math.round(Math.max(finalCalories, sets * 3)); // minimum 3 cal/set
}

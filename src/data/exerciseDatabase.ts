export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Abs' | 'Cardio';
  instructions: string;
}

export const exerciseDatabase: Exercise[] = [
  // Chest (8)
  { id: 'bench_press', name: 'Bench Press', muscle: 'Chest', category: 'Chest', instructions: 'Lie on bench, grip bar shoulder-width, lower to chest, press up.' },
  { id: 'incline_bench', name: 'Incline Bench Press', muscle: 'Upper Chest', category: 'Chest', instructions: 'Set bench to 30-45°, press barbell from upper chest.' },
  { id: 'decline_bench', name: 'Decline Bench Press', muscle: 'Lower Chest', category: 'Chest', instructions: 'Set bench to decline, press barbell from lower chest.' },
  { id: 'dumbbell_fly', name: 'Dumbbell Fly', muscle: 'Chest', category: 'Chest', instructions: 'Lie flat, arms extended, lower dumbbells in arc, squeeze back up.' },
  { id: 'cable_crossover', name: 'Cable Crossover', muscle: 'Chest', category: 'Chest', instructions: 'Stand between cables, bring handles together in front of chest.' },
  { id: 'push_ups', name: 'Push-Ups', muscle: 'Chest', category: 'Chest', instructions: 'Hands shoulder-width, lower body until chest near floor, push up.' },
  { id: 'chest_dips', name: 'Chest Dips', muscle: 'Lower Chest', category: 'Chest', instructions: 'Lean forward on dip bars, lower body, press back up.' },
  { id: 'pec_deck', name: 'Pec Deck Machine', muscle: 'Chest', category: 'Chest', instructions: 'Sit on machine, bring pads together in front of chest.' },

  // Back (8)
  { id: 'deadlift', name: 'Deadlift', muscle: 'Back/Posterior Chain', category: 'Back', instructions: 'Grip bar, hinge at hips, lift by extending hips and knees.' },
  { id: 'pull_ups', name: 'Pull-Ups', muscle: 'Lats', category: 'Back', instructions: 'Hang from bar, pull chin above bar, lower controlled.' },
  { id: 'barbell_row', name: 'Barbell Row', muscle: 'Upper Back', category: 'Back', instructions: 'Bend over, grip bar, pull to lower chest, squeeze back.' },
  { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Lats', category: 'Back', instructions: 'Grip bar wide, pull down to upper chest, control release.' },
  { id: 'seated_row', name: 'Seated Cable Row', muscle: 'Mid Back', category: 'Back', instructions: 'Sit upright, pull handle to torso, squeeze shoulder blades.' },
  { id: 'dumbbell_row', name: 'Single-Arm Dumbbell Row', muscle: 'Lats', category: 'Back', instructions: 'One hand on bench, row dumbbell to hip, squeeze lat.' },
  { id: 't_bar_row', name: 'T-Bar Row', muscle: 'Mid Back', category: 'Back', instructions: 'Straddle bar, grip handle, pull to chest.' },
  { id: 'face_pulls', name: 'Face Pulls', muscle: 'Rear Delts/Upper Back', category: 'Back', instructions: 'Pull rope to face level, externally rotate shoulders.' },

  // Legs (9)
  { id: 'squat', name: 'Barbell Squat', muscle: 'Quads/Glutes', category: 'Legs', instructions: 'Bar on traps, squat until thighs parallel, drive up.' },
  { id: 'leg_press', name: 'Leg Press', muscle: 'Quads', category: 'Legs', instructions: 'Sit on machine, press platform away, control the return.' },
  { id: 'lunges', name: 'Walking Lunges', muscle: 'Quads/Glutes', category: 'Legs', instructions: 'Step forward, lower until both knees at 90°, alternate.' },
  { id: 'leg_curl', name: 'Leg Curl', muscle: 'Hamstrings', category: 'Legs', instructions: 'Lie on machine, curl weight toward glutes.' },
  { id: 'leg_extension', name: 'Leg Extension', muscle: 'Quads', category: 'Legs', instructions: 'Sit on machine, extend legs fully, control the return.' },
  { id: 'calf_raise', name: 'Calf Raises', muscle: 'Calves', category: 'Legs', instructions: 'Stand on edge, rise on toes, lower below platform.' },
  { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'Hamstrings', category: 'Legs', instructions: 'Hold bar, hinge at hips with slight knee bend, feel hamstring stretch.' },
  { id: 'hip_thrust', name: 'Hip Thrust', muscle: 'Glutes', category: 'Legs', instructions: 'Back against bench, thrust hips up with bar on lap.' },
  { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', muscle: 'Quads/Glutes', category: 'Legs', instructions: 'Rear foot elevated, squat on front leg.' },

  // Shoulders (7)
  { id: 'overhead_press', name: 'Overhead Press', muscle: 'Shoulders', category: 'Shoulders', instructions: 'Press barbell from shoulders to overhead lockout.' },
  { id: 'lateral_raise', name: 'Lateral Raise', muscle: 'Side Delts', category: 'Shoulders', instructions: 'Raise dumbbells to sides until arms parallel to floor.' },
  { id: 'front_raise', name: 'Front Raise', muscle: 'Front Delts', category: 'Shoulders', instructions: 'Raise dumbbells in front to shoulder height.' },
  { id: 'rear_delt_fly', name: 'Rear Delt Fly', muscle: 'Rear Delts', category: 'Shoulders', instructions: 'Bend forward, raise dumbbells to sides.' },
  { id: 'arnold_press', name: 'Arnold Press', muscle: 'Shoulders', category: 'Shoulders', instructions: 'Start palms facing you, rotate and press overhead.' },
  { id: 'upright_row', name: 'Upright Row', muscle: 'Traps/Delts', category: 'Shoulders', instructions: 'Pull bar up to chin, elbows leading.' },
  { id: 'shrugs', name: 'Barbell Shrugs', muscle: 'Traps', category: 'Shoulders', instructions: 'Hold bar, shrug shoulders toward ears, hold at top.' },

  // Arms (8)
  { id: 'bicep_curl', name: 'Barbell Bicep Curl', muscle: 'Biceps', category: 'Arms', instructions: 'Curl bar from thighs to shoulders, control the descent.' },
  { id: 'hammer_curl', name: 'Hammer Curl', muscle: 'Biceps/Brachialis', category: 'Arms', instructions: 'Curl dumbbells with neutral grip (palms facing each other).' },
  { id: 'tricep_pushdown', name: 'Tricep Pushdown', muscle: 'Triceps', category: 'Arms', instructions: 'Push cable handle down until arms fully extended.' },
  { id: 'skull_crusher', name: 'Skull Crushers', muscle: 'Triceps', category: 'Arms', instructions: 'Lie on bench, lower EZ bar to forehead, extend arms.' },
  { id: 'preacher_curl', name: 'Preacher Curl', muscle: 'Biceps', category: 'Arms', instructions: 'Arms on preacher pad, curl bar upward.' },
  { id: 'concentration_curl', name: 'Concentration Curl', muscle: 'Biceps', category: 'Arms', instructions: 'Sit, elbow on inner thigh, curl dumbbell.' },
  { id: 'overhead_tricep', name: 'Overhead Tricep Extension', muscle: 'Triceps', category: 'Arms', instructions: 'Hold dumbbell overhead, lower behind head, extend.' },
  { id: 'diamond_pushups', name: 'Diamond Push-Ups', muscle: 'Triceps', category: 'Arms', instructions: 'Hands together forming diamond, lower and push up.' },

  // Abs (7)
  { id: 'crunches', name: 'Crunches', muscle: 'Upper Abs', category: 'Abs', instructions: 'Lie on back, curl shoulders off floor, squeeze abs.' },
  { id: 'plank', name: 'Plank', muscle: 'Core', category: 'Abs', instructions: 'Hold push-up position on forearms, keep body straight.' },
  { id: 'leg_raises', name: 'Hanging Leg Raises', muscle: 'Lower Abs', category: 'Abs', instructions: 'Hang from bar, raise legs to 90°, lower controlled.' },
  { id: 'russian_twist', name: 'Russian Twist', muscle: 'Obliques', category: 'Abs', instructions: 'Sit, lean back, rotate torso side to side.' },
  { id: 'mountain_climbers', name: 'Mountain Climbers', muscle: 'Core', category: 'Abs', instructions: 'Plank position, drive knees to chest alternately, fast.' },
  { id: 'bicycle_crunch', name: 'Bicycle Crunches', muscle: 'Obliques', category: 'Abs', instructions: 'Lie on back, alternate elbow to opposite knee.' },
  { id: 'ab_wheel', name: 'Ab Wheel Rollout', muscle: 'Core', category: 'Abs', instructions: 'Kneel, roll wheel forward, pull back with abs.' },

  // Cardio (8)
  { id: 'walking', name: 'Walking', muscle: 'Full Body', category: 'Cardio', instructions: 'Walk at a steady pace, outdoors or on treadmill.' },
  { id: 'running', name: 'Running/Jogging', muscle: 'Full Body', category: 'Cardio', instructions: 'Steady-state or interval running on treadmill or outdoors.' },
  { id: 'cycling', name: 'Cycling', muscle: 'Legs/Cardio', category: 'Cardio', instructions: 'Stationary or outdoor cycling at moderate-high intensity.' },
  { id: 'jump_rope', name: 'Jump Rope', muscle: 'Full Body', category: 'Cardio', instructions: 'Jump rope with both feet, maintain rhythm.' },
  { id: 'burpees', name: 'Burpees', muscle: 'Full Body', category: 'Cardio', instructions: 'Squat, jump back to plank, push-up, jump forward, jump up.' },
  { id: 'rowing', name: 'Rowing Machine', muscle: 'Full Body', category: 'Cardio', instructions: 'Drive with legs, pull handle to chest, control return.' },
  { id: 'stair_climber', name: 'Stair Climber', muscle: 'Legs/Cardio', category: 'Cardio', instructions: 'Climb stairs at steady pace on machine.' },
  { id: 'swimming', name: 'Swimming', muscle: 'Full Body', category: 'Cardio', instructions: 'Swim laps at moderate to high intensity.' },
];

export const workoutCategories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'] as const;
export type WorkoutCategory = typeof workoutCategories[number];

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  waist: number;  // cm
  gender: 'male' | 'female';
  activityLevel: 'none' | 'light' | 'moderate' | 'hard';
  goal: 'bulking' | 'cutting' | 'maintenance';
  preference: 'gym' | 'home';
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const activityFactors = { none: 1.2, light: 1.375, moderate: 1.55, hard: 1.725 };

export function calculateNutrition(user: UserProfile): NutritionTargets {
  const { weight, height, waist, gender, activityLevel, goal } = user;

  // Step 1: RFM Body Fat %
  const bodyFat = gender === 'male'
    ? 64 - 20 * (height / waist)
    : 76 - 20 * (height / waist);
  const clampedBF = Math.max(5, Math.min(bodyFat, 60));

  // Step 2: LBM
  const lbm = weight * (1 - clampedBF / 100);

  // Step 3: BMR (Katch-McArdle)
  const bmr = 370 + 21.6 * lbm;

  // Step 4: TDEE
  const tdee = bmr * activityFactors[activityLevel];

  // Step 5: Goal-based macros
  let calories: number, protein: number, fat: number, fiber: number, carbs: number;

  if (goal === 'bulking') {
    calories = Math.round(tdee + 400);
    protein = Math.round(weight * 1.8);
    fat = Math.round(weight * 0.9);
    fiber = Math.round((calories / 1000) * 14);
    carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  } else if (goal === 'cutting') {
    calories = Math.round(tdee - 500);
    protein = Math.round(weight * 2.2);
    fat = Math.round(weight * 0.7);
    fiber = Math.round((calories / 1000) * 14);
    carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  } else {
    calories = Math.round(tdee);
    protein = Math.round(weight * 1.1);
    fat = Math.round(weight * 0.8);
    fiber = gender === 'male' ? 30 : 25;
    carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  }

  return { calories: Math.max(calories, 1200), protein, carbs: Math.max(carbs, 50), fat, fiber };
}

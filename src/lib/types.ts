import type { MealCategory } from '@/data/foodDatabase';

export interface FoodLogEntry {
  id: string;
  foodId: string;
  name: string;
  grams: number;
  meal: MealCategory;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  date: string; // YYYY-MM-DD
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
  duration: number; // minutes
  caloriesBurned: number;
  type?: 'strength' | 'cardio'; // defaults to 'strength' for legacy
}

export interface CardioActivity {
  id: string;
  name: string;
  met: number;
}

export const CARDIO_ACTIVITIES: CardioActivity[] = [
  { id: 'walking', name: 'Walking', met: 3.5 },
  { id: 'fast_walking', name: 'Fast Walking', met: 4.3 },
  { id: 'jogging', name: 'Jogging', met: 7 },
  { id: 'running', name: 'Running', met: 9 },
  { id: 'cycling', name: 'Cycling', met: 6 },
  { id: 'skipping', name: 'Skipping', met: 10 },
  { id: 'stair_climbing', name: 'Stair Climbing', met: 8 },
];

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface WaterLog {
  date: string;
  glasses: number;
}

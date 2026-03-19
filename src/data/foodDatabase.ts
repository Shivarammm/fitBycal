export interface FoodItem {
  id: string;
  name: string;
  cal: number;    // per 100g or per unit
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: 'fruit' | 'vegetable' | 'grain' | 'protein' | 'dairy' | 'nuts' | 'legume' | 'prepared' | 'oil';
  unit?: 'g' | 'ml' | 'piece'; // default 'g'
  unitLabel?: string; // e.g. "1 egg"
  baseAmount?: number; // default 100
}

export const foodDatabase: FoodItem[] = [
  // Fruits
  { id: 'banana', name: 'Banana', cal: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, category: 'fruit' },
  { id: 'apple', name: 'Apple', cal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, category: 'fruit' },
  { id: 'orange', name: 'Orange', cal: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, category: 'fruit' },
  { id: 'mango', name: 'Mango', cal: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, category: 'fruit' },
  { id: 'papaya', name: 'Papaya', cal: 43, protein: 0.5, carbs: 11, fat: 0.3, fiber: 1.7, category: 'fruit' },
  { id: 'pineapple', name: 'Pineapple', cal: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4, category: 'fruit' },
  { id: 'watermelon', name: 'Watermelon', cal: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, category: 'fruit' },
  { id: 'guava', name: 'Guava', cal: 68, protein: 2.6, carbs: 14, fat: 1.0, fiber: 5.4, category: 'fruit' },
  { id: 'grapes', name: 'Grapes', cal: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, category: 'fruit' },
  { id: 'pomegranate', name: 'Pomegranate', cal: 83, protein: 1.7, carbs: 19, fat: 1.2, fiber: 4.0, category: 'fruit' },
  { id: 'kiwi', name: 'Kiwi', cal: 61, protein: 1.1, carbs: 15, fat: 0.5, fiber: 3.0, category: 'fruit' },
  { id: 'strawberry', name: 'Strawberry', cal: 32, protein: 0.7, carbs: 8, fat: 0.3, fiber: 2.0, category: 'fruit' },

  // Vegetables
  { id: 'potato', name: 'Potato', cal: 77, protein: 2.0, carbs: 17, fat: 0.1, fiber: 2.2, category: 'vegetable' },
  { id: 'sweet_potato', name: 'Sweet Potato', cal: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3.0, category: 'vegetable' },
  { id: 'carrot', name: 'Carrot', cal: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, category: 'vegetable' },
  { id: 'tomato', name: 'Tomato', cal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, category: 'vegetable' },
  { id: 'cucumber', name: 'Cucumber', cal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, category: 'vegetable' },
  { id: 'onion', name: 'Onion', cal: 40, protein: 1.1, carbs: 9, fat: 0.1, fiber: 1.7, category: 'vegetable' },
  { id: 'spinach', name: 'Spinach', cal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: 'vegetable' },
  { id: 'broccoli', name: 'Broccoli', cal: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, category: 'vegetable' },
  { id: 'cauliflower', name: 'Cauliflower', cal: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2.0, category: 'vegetable' },
  { id: 'cabbage', name: 'Cabbage', cal: 25, protein: 1.3, carbs: 6, fat: 0.1, fiber: 2.5, category: 'vegetable' },
  { id: 'green_beans', name: 'Green Beans', cal: 31, protein: 1.8, carbs: 7, fat: 0.1, fiber: 3.4, category: 'vegetable' },
  { id: 'bell_pepper', name: 'Bell Pepper', cal: 31, protein: 1.0, carbs: 6, fat: 0.3, fiber: 2.1, category: 'vegetable' },
  { id: 'mushroom', name: 'Mushroom', cal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1.0, category: 'vegetable' },
  { id: 'beetroot', name: 'Beetroot', cal: 43, protein: 1.6, carbs: 10, fat: 0.2, fiber: 2.8, category: 'vegetable' },
  { id: 'peas', name: 'Green Peas', cal: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1, category: 'vegetable' },

  // Grains
  { id: 'white_rice', name: 'White Rice', cal: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'grain' },
  { id: 'brown_rice', name: 'Brown Rice', cal: 123, protein: 2.7, carbs: 26, fat: 1.0, fiber: 1.8, category: 'grain' },
  { id: 'roti', name: 'Roti', cal: 297, protein: 9.0, carbs: 50, fat: 7.5, fiber: 3.5, category: 'grain' },
  { id: 'oats', name: 'Oats', cal: 389, protein: 16.9, carbs: 66, fat: 6.9, fiber: 10.6, category: 'grain' },
  { id: 'quinoa', name: 'Quinoa', cal: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, category: 'grain' },
  { id: 'pasta', name: 'Pasta', cal: 131, protein: 5.0, carbs: 25, fat: 1.1, fiber: 1.8, category: 'grain' },
  { id: 'bread', name: 'Bread', cal: 265, protein: 9.0, carbs: 49, fat: 3.2, fiber: 2.7, category: 'grain' },
  { id: 'corn', name: 'Corn', cal: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2.7, category: 'grain' },
  { id: 'millet', name: 'Millet', cal: 378, protein: 11, carbs: 73, fat: 4.2, fiber: 8.5, category: 'grain' },

  // Protein
  { id: 'egg', name: 'Egg (Whole)', cal: 70, protein: 6, carbs: 0.6, fat: 5, fiber: 0, category: 'protein', unit: 'piece', unitLabel: '1 egg', baseAmount: 1 },
  { id: 'egg_white', name: 'Egg White', cal: 52, protein: 11, carbs: 0.7, fat: 0.2, fiber: 0, category: 'protein' },
  { id: 'chicken_breast', name: 'Chicken Breast', cal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, category: 'protein' },
  { id: 'chicken_general', name: 'Chicken (General Cooked)', cal: 190, protein: 25, carbs: 0, fat: 8.5, fiber: 0, category: 'protein' },
  { id: 'fish', name: 'Fish (Rohu)', cal: 97, protein: 17, carbs: 0, fat: 3.0, fiber: 0, category: 'protein' },
  { id: 'paneer', name: 'Paneer', cal: 265, protein: 18, carbs: 1.2, fat: 21, fiber: 0, category: 'protein' },
  { id: 'tofu', name: 'Tofu', cal: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, category: 'protein' },
  { id: 'shrimp', name: 'Shrimp', cal: 99, protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, category: 'protein' },
  { id: 'mutton', name: 'Mutton', cal: 294, protein: 25, carbs: 0, fat: 21, fiber: 0, category: 'protein' },
  { id: 'turkey', name: 'Turkey Breast', cal: 135, protein: 30, carbs: 0, fat: 1.0, fiber: 0, category: 'protein' },
  { id: 'whey_protein', name: 'Whey Protein', cal: 400, protein: 80, carbs: 10, fat: 5, fiber: 0, category: 'protein' },

  // Dairy
  { id: 'milk', name: 'Milk (Whole)', cal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, category: 'dairy', unit: 'ml' },
  { id: 'greek_yogurt', name: 'Greek Yogurt', cal: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, category: 'dairy' },
  { id: 'butter', name: 'Butter', cal: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, category: 'dairy' },
  { id: 'cheese', name: 'Cheese', cal: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, category: 'dairy' },
  { id: 'curd', name: 'Curd/Yogurt', cal: 61, protein: 3.5, carbs: 4.7, fat: 3.3, fiber: 0, category: 'dairy' },
  { id: 'cottage_cheese', name: 'Cottage Cheese', cal: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, category: 'dairy' },
  { id: 'skimmed_milk', name: 'Skimmed Milk', cal: 34, protein: 3.4, carbs: 5.0, fat: 0.1, fiber: 0, category: 'dairy' },

  // Nuts & Seeds
  { id: 'almonds', name: 'Almonds', cal: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, category: 'nuts' },
  { id: 'peanuts', name: 'Peanuts', cal: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, category: 'nuts' },
  { id: 'cashews', name: 'Cashews', cal: 553, protein: 18, carbs: 30, fat: 44, fiber: 3.3, category: 'nuts' },
  { id: 'pistachios', name: 'Pistachios', cal: 560, protein: 20, carbs: 28, fat: 45, fiber: 10, category: 'nuts' },
  { id: 'chia_seeds', name: 'Chia Seeds', cal: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, category: 'nuts' },
  { id: 'flax_seeds', name: 'Flax Seeds', cal: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, category: 'nuts' },
  { id: 'walnuts', name: 'Walnuts', cal: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, category: 'nuts' },
  { id: 'peanut_butter', name: 'Peanut Butter', cal: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, category: 'nuts' },
  { id: 'sunflower_seeds', name: 'Sunflower Seeds', cal: 584, protein: 21, carbs: 20, fat: 51, fiber: 8.6, category: 'nuts' },
  { id: 'pumpkin_seeds', name: 'Pumpkin Seeds', cal: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, category: 'nuts' },

  // Legumes
  { id: 'dal', name: 'Dal (Lentils)', cal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, category: 'legume' },
  { id: 'rajma', name: 'Rajma (Kidney Beans)', cal: 127, protein: 8.7, carbs: 22, fat: 0.5, fiber: 6.4, category: 'legume' },
  { id: 'chickpeas', name: 'Chickpeas', cal: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, category: 'legume' },
  { id: 'soybeans', name: 'Soybeans', cal: 173, protein: 17, carbs: 9.9, fat: 9, fiber: 6, category: 'legume' },
  { id: 'moong_dal', name: 'Moong Dal', cal: 105, protein: 7.0, carbs: 19, fat: 0.4, fiber: 5.0, category: 'legume' },
  { id: 'black_beans', name: 'Black Beans', cal: 132, protein: 8.9, carbs: 24, fat: 0.5, fiber: 8.7, category: 'legume' },

  // Prepared
  { id: 'idli', name: 'Idli', cal: 39, protein: 2.0, carbs: 8, fat: 0.1, fiber: 0.5, category: 'prepared' },
  { id: 'dosa', name: 'Dosa', cal: 168, protein: 4.0, carbs: 27, fat: 4.8, fiber: 1.0, category: 'prepared' },
  { id: 'upma', name: 'Upma', cal: 95, protein: 2.5, carbs: 14, fat: 3.5, fiber: 1.0, category: 'prepared' },
  { id: 'poha', name: 'Poha', cal: 130, protein: 2.5, carbs: 23, fat: 3.5, fiber: 0.8, category: 'prepared' },
  { id: 'sambar', name: 'Sambar', cal: 65, protein: 3.5, carbs: 9, fat: 1.5, fiber: 2.0, category: 'prepared' },
  { id: 'paratha', name: 'Paratha', cal: 260, protein: 5.5, carbs: 36, fat: 10, fiber: 2.0, category: 'prepared' },

  // Oil/Fat
  { id: 'coconut', name: 'Coconut (Fresh)', cal: 354, protein: 3.3, carbs: 15, fat: 33, fiber: 9.0, category: 'oil' },
  { id: 'ghee', name: 'Ghee', cal: 900, protein: 0, carbs: 0, fat: 100, fiber: 0, category: 'oil' },
  { id: 'olive_oil', name: 'Olive Oil', cal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, category: 'oil' },
  { id: 'coconut_oil', name: 'Coconut Oil', cal: 862, protein: 0, carbs: 0, fat: 100, fiber: 0, category: 'oil' },
  { id: 'honey', name: 'Honey', cal: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2, category: 'oil' },

  // More items to reach 100
  { id: 'avocado', name: 'Avocado', cal: 160, protein: 2.0, carbs: 9, fat: 15, fiber: 6.7, category: 'fruit' },
  { id: 'dates', name: 'Dates', cal: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7, category: 'fruit' },
  { id: 'raisins', name: 'Raisins', cal: 299, protein: 3.1, carbs: 79, fat: 0.5, fiber: 3.7, category: 'fruit' },
  { id: 'lemon', name: 'Lemon', cal: 29, protein: 1.1, carbs: 9, fat: 0.3, fiber: 2.8, category: 'fruit' },
  { id: 'coconut_water', name: 'Coconut Water', cal: 19, protein: 0.7, carbs: 3.7, fat: 0.2, fiber: 1.1, category: 'fruit' },
  { id: 'soy_milk', name: 'Soy Milk', cal: 33, protein: 2.9, carbs: 1.8, fat: 1.6, fiber: 0.4, category: 'dairy' },
  { id: 'basmati_rice', name: 'Basmati Rice', cal: 121, protein: 3.5, carbs: 25, fat: 0.4, fiber: 0.4, category: 'grain' },
  { id: 'vermicelli', name: 'Vermicelli', cal: 348, protein: 11, carbs: 72, fat: 1.5, fiber: 2.0, category: 'grain' },
  { id: 'sprouts', name: 'Sprouts (Moong)', cal: 30, protein: 3.0, carbs: 6, fat: 0.2, fiber: 1.8, category: 'legume' },
];

export const quickAddFoods = ['banana', 'egg', 'milk', 'chicken_breast', 'white_rice', 'roti', 'oats'];

export function getFoodDisplayUnit(food: FoodItem): string {
  if (food.unit === 'piece') return food.unitLabel || '1 piece';
  if (food.unit === 'ml') return '100 ml';
  return '100g';
}

export function isCountBased(food: FoodItem): boolean {
  return food.unit === 'piece';
}

export const mealCategories = ['Breakfast', 'Lunch', 'Snacks', 'Pre-Workout', 'Post-Workout', 'Dinner'] as const;
export type MealCategory = typeof mealCategories[number];

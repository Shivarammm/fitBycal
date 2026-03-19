import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Droplets, Dumbbell, UtensilsCrossed, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CalorieRing } from '@/components/CalorieRing';
import { MacroBar } from '@/components/MacroBar';
import { FoodSearch } from '@/components/FoodSearch';
import { calculateNutrition, type UserProfile } from '@/lib/nutrition';
import type { FoodLogEntry, WaterLog, WeightEntry } from '@/lib/types';
import { quickAddFoods, foodDatabase, mealCategories, getFoodDisplayUnit, isCountBased } from '@/data/foodDatabase';
import type { MealCategory } from '@/data/foodDatabase';

const defaultProfile: UserProfile = {
  name: '', age: 0, height: 0, weight: 0, waist: 0,
  gender: 'male', activityLevel: 'moderate', goal: 'maintenance', preference: 'gym',
};

const quotes = [
  "Fuel the Machine.",
  "No shortcuts. Only reps.",
  "Your body keeps a log. So should you.",
  "Discipline is choosing between what you want now and what you want most.",
  "The iron never lies.",
];

const today = () => new Date().toISOString().split('T')[0];

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile] = useLocalStorage<UserProfile>('gym_profile', defaultProfile);
  const [foodLogs, setFoodLogs] = useLocalStorage<FoodLogEntry[]>('gym_food_logs', []);
  const [waterLog, setWaterLog] = useLocalStorage<WaterLog[]>('gym_water', []);
  const [weights] = useLocalStorage<WeightEntry[]>('gym_weights', []);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealCategory>('Snacks');
  const [lastQuickMeal, setLastQuickMeal] = useLocalStorage<MealCategory>('gym_last_quick_meal', 'Snacks');

  // Quick add meal popup
  const [quickAddPopup, setQuickAddPopup] = useState<{ foodId: string; x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setQuickAddPopup(null);
      }
    };
    if (quickAddPopup) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [quickAddPopup]);

  const targets = useMemo(() => calculateNutrition(profile), [profile]);
  const todayStr = today();

  const todayLogs = useMemo(() => foodLogs.filter(l => l.date === todayStr), [foodLogs, todayStr]);
  const totals = useMemo(() => todayLogs.reduce((acc, l) => ({
    cal: acc.cal + l.cal, protein: acc.protein + l.protein,
    carbs: acc.carbs + l.carbs, fat: acc.fat + l.fat, fiber: acc.fiber + l.fiber,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }), [todayLogs]);

  const todayWater = waterLog.find(w => w.date === todayStr)?.glasses || 0;
  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : profile.weight;
  const prevWeight = weights.length > 1 ? weights[weights.length - 2].weight : null;

  const addWater = () => {
    setWaterLog(prev => {
      const existing = prev.find(w => w.date === todayStr);
      if (existing) return prev.map(w => w.date === todayStr ? { ...w, glasses: w.glasses + 1 } : w);
      return [...prev, { date: todayStr, glasses: 1 }];
    });
  };

  const handleQuickAddClick = (foodId: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setQuickAddPopup({ foodId, x: rect.left, y: rect.bottom + 4 });
  };

  const confirmQuickAdd = (foodId: string, meal: MealCategory) => {
    const food = foodDatabase.find(f => f.id === foodId);
    if (!food) return;
    const isCounted = isCountBased(food);
    const entry: FoodLogEntry = {
      id: Date.now().toString(), foodId: food.id, name: food.name,
      grams: isCounted ? 1 : 100, meal, 
      cal: food.cal, protein: food.protein,
      carbs: food.carbs, fat: food.fat, fiber: food.fiber, date: todayStr,
    };
    setFoodLogs(prev => [...prev, entry]);
    setLastQuickMeal(meal);
    setQuickAddPopup(null);
  };

  const quote = quotes[Math.floor(new Date().getDate() % quotes.length)];

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        <h1 className="text-2xl font-bold tracking-tight mt-1">Hey, {profile.name || 'Champ'} 👊</h1>
        <p className="text-xs text-muted-foreground italic mt-1">"{quote}"</p>
      </div>

      {/* Calories + Macros */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-6">
          <CalorieRing current={totals.cal} target={targets.calories} />
          <div className="flex-1 space-y-3">
            <MacroBar label="Protein" current={totals.protein} target={targets.protein} color="hsl(var(--primary))" />
            <MacroBar label="Carbs" current={totals.carbs} target={targets.carbs} color="hsl(var(--accent))" />
            <MacroBar label="Fat" current={totals.fat} target={targets.fat} color="hsl(var(--steel))" />
            <MacroBar label="Fiber" current={totals.fiber} target={targets.fiber} color="hsl(var(--success))" />
          </div>
        </div>
      </motion.div>

      {/* Quick Add */}
      <div className="relative">
        <h3 className="text-sm font-semibold mb-2">Quick Add</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickAddFoods.map(id => {
            const food = foodDatabase.find(f => f.id === id);
            if (!food) return null;
            return (
              <button key={id} onClick={(e) => handleQuickAddClick(id, e)} className="flex-shrink-0 bg-secondary rounded-lg px-3 py-2 tap-scale">
                <div className="text-xs font-medium whitespace-nowrap">{food.name}</div>
                <div className="font-mono-data text-[10px] text-muted-foreground">{getFoodDisplayUnit(food)}</div>
                <div className="font-mono-data text-[10px] text-primary">{food.cal} kcal</div>
              </button>
            );
          })}
        </div>

        {/* Meal Selection Popup */}
        <AnimatePresence>
          {quickAddPopup && (
            <motion.div
              ref={popupRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="fixed z-50 bg-card border border-border rounded-xl shadow-lg p-2 min-w-[160px]"
              style={{ left: Math.min(quickAddPopup.x, window.innerWidth - 180), top: quickAddPopup.y }}
            >
              <p className="text-[10px] text-muted-foreground px-2 py-1 font-medium">Add to meal</p>
              {mealCategories.map(meal => (
                <button
                  key={meal}
                  onClick={() => confirmQuickAdd(quickAddPopup.foodId, meal)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg tap-scale transition-colors ${meal === lastQuickMeal ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'}`}
                >
                  {meal}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Water Tracker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Droplets className="w-5 h-5 text-water" />
          <div>
            <p className="text-sm font-semibold">Water</p>
            <p className="font-mono-data text-xs text-muted-foreground">{todayWater} / 8 glasses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`w-2 h-5 rounded-sm ${i < todayWater ? 'bg-water' : 'bg-secondary'}`} />
            ))}
          </div>
          <button onClick={addWater} className="ml-2 p-2 rounded-lg bg-secondary tap-scale">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Weight */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Weight</p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-data text-lg font-bold">{currentWeight}</span>
              <span className="text-xs text-muted-foreground">kg</span>
              {prevWeight && (
                <span className={`text-xs font-mono-data ${currentWeight > prevWeight ? 'text-accent' : 'text-success'}`}>
                  {currentWeight > prevWeight ? '+' : ''}{(currentWeight - prevWeight).toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/profile')} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground tap-scale">Update</button>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => navigate('/workouts')} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 tap-scale">
          <Dumbbell className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Workout</span>
        </button>
        <button onClick={() => { setSelectedMeal('Lunch'); setShowFoodSearch(true); }} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 tap-scale">
          <UtensilsCrossed className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Add Meal</span>
        </button>
        <button onClick={() => navigate('/progress')} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 tap-scale">
          <Scale className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Log Weight</span>
        </button>
      </div>

      <FoodSearch
        isOpen={showFoodSearch}
        onClose={() => setShowFoodSearch(false)}
        meal={selectedMeal}
        date={todayStr}
        onAddFood={(entry) => setFoodLogs(prev => [...prev, entry])}
      />
    </div>
  );
}

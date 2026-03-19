import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FoodSearch } from '@/components/FoodSearch';
import type { FoodLogEntry } from '@/lib/types';
import { mealCategories, type MealCategory, foodDatabase, isCountBased } from '@/data/foodDatabase';
import { calculateNutrition, type UserProfile } from '@/lib/nutrition';
import { MacroBar } from '@/components/MacroBar';
import { CalorieRing } from '@/components/CalorieRing';
import { Plus, Trash2 } from 'lucide-react';

const defaultProfile: UserProfile = {
  name: 'Athlete', age: 25, height: 175, weight: 75, waist: 82,
  gender: 'male', activityLevel: 'moderate', goal: 'maintenance', preference: 'gym',
};

const today = () => new Date().toISOString().split('T')[0];

export default function FoodLog() {
  const [profile] = useLocalStorage<UserProfile>('gym_profile', defaultProfile);
  const [foodLogs, setFoodLogs] = useLocalStorage<FoodLogEntry[]>('gym_food_logs', []);
  const [showSearch, setShowSearch] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealCategory>('Breakfast');
  const todayStr = today();

  const targets = useMemo(() => calculateNutrition(profile), [profile]);
  const todayLogs = useMemo(() => foodLogs.filter(l => l.date === todayStr), [foodLogs, todayStr]);
  const totals = useMemo(() => todayLogs.reduce((acc, l) => ({
    cal: acc.cal + l.cal, protein: acc.protein + l.protein,
    carbs: acc.carbs + l.carbs, fat: acc.fat + l.fat, fiber: acc.fiber + l.fiber,
  }), { cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }), [todayLogs]);

  const mealLogs = (meal: MealCategory) => todayLogs.filter(l => l.meal === meal);
  const mealCals = (meal: MealCategory) => mealLogs(meal).reduce((s, l) => s + l.cal, 0);

  const removeLog = (id: string) => setFoodLogs(prev => prev.filter(l => l.id !== id));

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Food Log</h1>

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-5">
          <CalorieRing current={totals.cal} target={targets.calories} size={100} />
          <div className="flex-1 space-y-2">
            <MacroBar label="Protein" current={totals.protein} target={targets.protein} color="hsl(var(--primary))" />
            <MacroBar label="Carbs" current={totals.carbs} target={targets.carbs} color="hsl(var(--accent))" />
            <MacroBar label="Fat" current={totals.fat} target={targets.fat} color="hsl(var(--steel))" />
            <MacroBar label="Fiber" current={totals.fiber} target={targets.fiber} color="hsl(var(--success))" />
          </div>
        </div>
      </div>

      {/* Meals */}
      {mealCategories.map(meal => (
        <div key={meal} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold">{meal}</h3>
              <span className="font-mono-data text-xs text-muted-foreground">{mealCals(meal)} kcal</span>
            </div>
            <button onClick={() => { setActiveMeal(meal); setShowSearch(true); }} className="p-2 rounded-lg bg-secondary tap-scale">
              <Plus className="w-4 h-4 text-primary" />
            </button>
          </div>
          {mealLogs(meal).length > 0 && (
            <div className="divide-y divide-border">
              {mealLogs(meal).map(log => (
                <div key={log.id} className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm">{log.name}</p>
                    <p className="text-xs text-muted-foreground font-mono-data">
                      {(() => {
                        const food = foodDatabase.find(f => f.id === log.foodId);
                        const isCounted = food ? isCountBased(food) : false;
                        return isCounted ? `${log.grams} pc` : `${log.grams}g`;
                      })()} · {log.cal} kcal · P:{log.protein}g
                    </p>
                  </div>
                  <button onClick={() => removeLog(log.id)} className="p-1 text-muted-foreground tap-scale">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <FoodSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        meal={activeMeal}
        date={todayStr}
        onAddFood={(entry) => setFoodLogs(prev => [...prev, entry])}
      />
    </div>
  );
}

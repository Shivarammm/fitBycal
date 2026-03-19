import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { foodDatabase, type FoodItem, isCountBased, getFoodDisplayUnit } from '@/data/foodDatabase';
import type { MealCategory } from '@/data/foodDatabase';
import type { FoodLogEntry } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodSearchProps {
  isOpen: boolean;
  onClose: () => void;
  meal: MealCategory;
  onAddFood: (entry: FoodLogEntry) => void;
  date: string;
}

const weightPresets = [50, 100, 150, 200, 250];
const countPresets = [1, 2, 3, 4, 5];

export function FoodSearch({ isOpen, onClose, meal, onAddFood, date }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState(100);
  const [count, setCount] = useState(1);
  const [isCustom, setIsCustom] = useState(false);
  const [customFood, setCustomFood] = useState({ name: '', cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const filtered = foodDatabase.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const isCounted = selectedFood ? isCountBased(selectedFood) : false;

  const calcNutrition = (food: FoodItem, amount: number) => {
    if (isCountBased(food)) {
      return {
        cal: Math.round(food.cal * amount),
        protein: Math.round(food.protein * amount * 10) / 10,
        carbs: Math.round(food.carbs * amount * 10) / 10,
        fat: Math.round(food.fat * amount * 10) / 10,
        fiber: Math.round(food.fiber * amount * 10) / 10,
      };
    }
    const ratio = amount / 100;
    return {
      cal: Math.round(food.cal * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
      fiber: Math.round(food.fiber * ratio * 10) / 10,
    };
  };

  const addSelected = () => {
    if (!selectedFood) return;
    const amount = isCounted ? count : grams;
    const n = calcNutrition(selectedFood, amount);
    const entry: FoodLogEntry = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      grams: amount,
      meal,
      ...n,
      date,
    };
    onAddFood(entry);
    setSelectedFood(null);
    setGrams(100);
    setCount(1);
    setQuery('');
    onClose();
  };

  const addCustom = () => {
    const ratio = grams / 100;
    const entry: FoodLogEntry = {
      id: Date.now().toString(),
      foodId: 'custom_' + Date.now(),
      name: customFood.name,
      grams,
      meal,
      cal: Math.round(customFood.cal * ratio),
      protein: Math.round(customFood.protein * ratio * 10) / 10,
      carbs: Math.round(customFood.carbs * ratio * 10) / 10,
      fat: Math.round(customFood.fat * ratio * 10) / 10,
      fiber: Math.round(customFood.fiber * ratio * 10) / 10,
      date,
    };
    onAddFood(entry);
    setCustomFood({ name: '', cal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    setGrams(100);
    setIsCustom(false);
    onClose();
  };

  if (!isOpen) return null;

  const amount = isCounted ? count : grams;
  const computed = selectedFood ? calcNutrition(selectedFood, amount) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 bg-background flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button onClick={onClose} className="p-2 tap-scale text-muted-foreground"><X className="w-5 h-5" /></button>
          <h2 className="text-lg font-semibold flex-1">Add to {meal}</h2>
          <button onClick={() => setIsCustom(!isCustom)} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground tap-scale">
            {isCustom ? 'Search' : 'Custom'}
          </button>
        </div>

        {isCustom ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <input placeholder="Food name" value={customFood.name} onChange={e => setCustomFood({...customFood, name: e.target.value})} className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            <div className="grid grid-cols-2 gap-3">
              {(['cal', 'protein', 'carbs', 'fat', 'fiber'] as const).map(key => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground capitalize">{key} (per 100g)</label>
                  <input type="text" inputMode="numeric" value={customFood[key] === 0 ? '' : customFood[key]} onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1'); setCustomFood({...customFood, [key]: v === '' ? 0 : parseFloat(v) || 0}); }} className="w-full bg-secondary rounded-lg px-3 py-2 text-sm font-mono-data text-foreground outline-none mt-1" />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Grams eaten</label>
              <div className="flex gap-2 mt-1">
                {weightPresets.map(w => (
                  <button key={w} onClick={() => setGrams(w)} className={`px-3 py-2 rounded-lg text-xs font-medium tap-scale ${grams === w ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{w}g</button>
                ))}
              </div>
              <input type="text" inputMode="numeric" value={grams === 0 ? '' : grams} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(\d)/, '$1'); setGrams(v === '' ? 0 : parseInt(v)); }} className="w-full bg-secondary rounded-lg px-3 py-2 text-sm font-mono-data text-foreground outline-none mt-2" />
            </div>
            <button onClick={addCustom} disabled={!customFood.name} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold tap-scale disabled:opacity-40">Add Food</button>
          </div>
        ) : selectedFood ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <h3 className="font-semibold text-lg">{selectedFood.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Per {getFoodDisplayUnit(selectedFood)}</p>
              <div className="grid grid-cols-5 gap-2 mt-3">
                {[
                  { l: 'Cal', v: selectedFood.cal },
                  { l: 'Protein', v: selectedFood.protein },
                  { l: 'Carbs', v: selectedFood.carbs },
                  { l: 'Fat', v: selectedFood.fat },
                  { l: 'Fiber', v: selectedFood.fiber },
                ].map(m => (
                  <div key={m.l} className="text-center">
                    <div className="font-mono-data text-sm font-bold">{m.v}</div>
                    <div className="text-[10px] text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {isCounted ? (
                <>
                  <label className="text-xs text-muted-foreground font-medium">How many?</label>
                  <div className="flex gap-2 mt-2">
                    {countPresets.map(c => (
                      <button key={c} onClick={() => setCount(c)} className={`flex-1 py-2 rounded-lg text-xs font-medium tap-scale ${count === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{c}</button>
                    ))}
                  </div>
                  <input type="text" inputMode="numeric" value={count === 0 ? '' : count} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(\d)/, '$1'); setCount(v === '' ? 0 : parseInt(v)); }} placeholder="Enter count" className="w-full bg-secondary rounded-lg px-3 py-3 text-sm font-mono-data text-foreground outline-none mt-2" />
                </>
              ) : (
                <>
                  <label className="text-xs text-muted-foreground font-medium">How much? ({selectedFood.unit === 'ml' ? 'ml' : 'grams'})</label>
                  <div className="flex gap-2 mt-2">
                    {weightPresets.map(w => (
                      <button key={w} onClick={() => setGrams(w)} className={`flex-1 py-2 rounded-lg text-xs font-medium tap-scale ${grams === w ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{w}{selectedFood.unit === 'ml' ? 'ml' : 'g'}</button>
                    ))}
                  </div>
                  <input type="text" inputMode="numeric" value={grams === 0 ? '' : grams} onChange={e => { const v = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(\d)/, '$1'); setGrams(v === '' ? 0 : parseInt(v)); }} className="w-full bg-secondary rounded-lg px-3 py-3 text-sm font-mono-data text-foreground outline-none mt-2" />
                </>
              )}
            </div>

            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Nutrition for {isCounted ? `${count} ${count === 1 ? 'piece' : 'pieces'}` : `${grams}${selectedFood.unit === 'ml' ? 'ml' : 'g'}`}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {computed && [
                  { l: 'Cal', v: computed.cal },
                  { l: 'Protein', v: computed.protein },
                  { l: 'Carbs', v: computed.carbs },
                  { l: 'Fat', v: computed.fat },
                  { l: 'Fiber', v: computed.fiber },
                ].map(m => (
                  <div key={m.l} className="text-center">
                    <div className="font-mono-data text-sm font-bold text-primary">{m.v}</div>
                    <div className="text-[10px] text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium tap-scale">Back</button>
              <button onClick={addSelected} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold tap-scale">Add Food</button>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search foods..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {filtered.map(food => (
                <button
                  key={food.id}
                  onClick={() => { setSelectedFood(food); setGrams(100); setCount(1); }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 tap-scale transition-colors"
                >
                  <div className="text-left">
                    <div className="text-sm font-medium">{food.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{food.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-data text-sm text-primary">{food.cal}</div>
                    <div className="text-[10px] text-muted-foreground">kcal/{getFoodDisplayUnit(food)}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

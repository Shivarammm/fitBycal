import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Timer, Plus, Dumbbell, Activity } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exerciseDatabase, workoutCategories, type WorkoutCategory } from '@/data/exerciseDatabase';
import { RestTimer } from '@/components/RestTimer';
import { calculateWorkoutCalories } from '@/lib/calories';
import type { WorkoutLog } from '@/lib/types';
import { CARDIO_ACTIVITIES } from '@/lib/types';
import type { UserProfile } from '@/lib/nutrition';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const today = () => new Date().toISOString().split('T')[0];

const cleanNumStr = (val: string): string => {
  if (val === '') return '';
  return val.replace(/[^0-9]/g, '').replace(/^0+(\d)/, '$1');
};
const parseNum = (val: string): number => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};
const numDisplay = (v: number) => v === 0 ? '' : String(v);

const defaultProfile = {
  name: '', age: 0, height: 0, weight: 0, waist: 0,
  gender: 'male' as const, activityLevel: 'moderate' as const, goal: 'maintenance' as const, preference: 'gym' as const,
};

export default function Workouts() {
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useLocalStorage<string[]>('gym_favorites', []);
  const [workoutLogs, setWorkoutLogs] = useLocalStorage<WorkoutLog[]>('gym_workout_logs', []);
  const [profile] = useLocalStorage<UserProfile>('gym_profile', defaultProfile);
  const [showTimer, setShowTimer] = useState(false);

  // Strength modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalExId, setModalExId] = useState('');
  const [modalExName, setModalExName] = useState('');
  const [modalSets, setModalSets] = useState(0);
  const [modalReps, setModalReps] = useState(0);
  const [modalWeight, setModalWeight] = useState(0);

  // Cardio modal state
  const [showCardioModal, setShowCardioModal] = useState(false);
  const [cardioActivityId, setCardioActivityId] = useState(CARDIO_ACTIVITIES[0].id);
  const [cardioMinutes, setCardioMinutes] = useState(0);

  const todayStr = today();
  const todayWorkouts = useMemo(() => workoutLogs.filter(w => w.date === todayStr), [workoutLogs, todayStr]);
  const todayStats = useMemo(() => ({
    count: todayWorkouts.reduce((s, w) => s + w.exercises.length, 0),
    calories: todayWorkouts.reduce((s, w) => s + w.caloriesBurned, 0),
    cardioMin: todayWorkouts.filter(w => w.type === 'cardio').reduce((s, w) => s + w.duration, 0),
  }), [todayWorkouts]);

  const estimatedCalories = useMemo(() => {
    return calculateWorkoutCalories(modalExId || modalExName, modalSets, modalReps, modalWeight, profile.weight);
  }, [modalExId, modalExName, modalSets, modalReps, modalWeight, profile.weight]);

  const cardioCalories = useMemo(() => {
    const activity = CARDIO_ACTIVITIES.find(a => a.id === cardioActivityId);
    if (!activity || cardioMinutes <= 0) return 0;
    const bodyWeight = profile.weight > 0 ? profile.weight : 65;
    return Math.round(activity.met * 3.5 * bodyWeight / 200 * cardioMinutes);
  }, [cardioActivityId, cardioMinutes, profile.weight]);

  const isCardioCategory = selectedCategory === 'Cardio';

  const filtered = useMemo(() => {
    let list = exerciseDatabase;
    if (selectedCategory !== 'All') list = list.filter(e => e.category === selectedCategory);
    if (searchQuery) list = list.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return list;
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const openAddModal = (id: string, name: string) => {
    // Check if exercise is cardio
    const exercise = exerciseDatabase.find(e => e.id === id);
    if (exercise?.category === 'Cardio') {
      // Map exercise to cardio activity or use first
      const mapped = CARDIO_ACTIVITIES.find(a => exercise.name.toLowerCase().includes(a.name.toLowerCase()));
      setCardioActivityId(mapped?.id || CARDIO_ACTIVITIES[0].id);
      setCardioMinutes(0);
      setShowCardioModal(true);
      return;
    }

    setModalExId(id);
    setModalExName(name);
    setModalSets(3);
    setModalReps(10);
    setModalWeight(0);
    setShowAddModal(true);
  };

  const addWorkout = () => {
    if (!modalExName || modalSets <= 0 || modalReps <= 0) return;
    const calories = estimatedCalories;
    const duration = Math.round(modalSets * 2.5);
    const sets = Array.from({ length: modalSets }, () => ({
      reps: modalReps, weight: modalWeight, completed: true,
    }));
    const log: WorkoutLog = {
      id: Date.now().toString(), date: todayStr, type: 'strength',
      exercises: [{ exerciseId: modalExId || modalExName.toLowerCase().replace(/\s+/g, '-'), name: modalExName, sets }],
      duration, caloriesBurned: calories,
    };
    setWorkoutLogs(prev => [...prev, log]);
    setShowAddModal(false);
  };

  const addCardio = () => {
    const activity = CARDIO_ACTIVITIES.find(a => a.id === cardioActivityId);
    if (!activity || cardioMinutes <= 0) return;
    const log: WorkoutLog = {
      id: Date.now().toString(), date: todayStr, type: 'cardio',
      exercises: [{ exerciseId: activity.id, name: activity.name, sets: [] }],
      duration: cardioMinutes, caloriesBurned: cardioCalories,
    };
    setWorkoutLogs(prev => [...prev, log]);
    setShowCardioModal(false);
    setCardioMinutes(0);
  };

  const recentExercises = useMemo(() => {
    const all: { date: string; name: string; cal: number; type: string; duration: number }[] = [];
    for (const log of [...workoutLogs].reverse()) {
      for (const ex of log.exercises) {
        all.push({ date: log.date, name: ex.name, cal: log.caloriesBurned, type: log.type || 'strength', duration: log.duration });
      }
      if (all.length >= 10) break;
    }
    return all.slice(0, 10);
  }, [workoutLogs]);

  const handleTopPlusClick = () => {
    if (isCardioCategory) {
      setCardioActivityId(CARDIO_ACTIVITIES[0].id);
      setCardioMinutes(0);
      setShowCardioModal(true);
    } else {
      openAddModal('', '');
    }
  };

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Workouts</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowTimer(true)} className="p-2 rounded-lg bg-secondary tap-scale">
            <Timer className="w-5 h-5 text-primary" />
          </button>
          <button onClick={handleTopPlusClick} className="p-2 rounded-lg bg-primary tap-scale">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Today's Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-primary/30 p-4">
        <h3 className="text-xs font-semibold text-primary mb-2">🔥 Today's Summary</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="font-mono-data text-lg font-bold">{todayStats.count}</div>
            <div className="text-[10px] text-muted-foreground">Exercises</div>
          </div>
          <div>
            <div className="font-mono-data text-lg font-bold text-accent">{todayStats.calories}</div>
            <div className="text-[10px] text-muted-foreground">Cal Burned</div>
          </div>
          <div>
            <div className="font-mono-data text-lg font-bold text-success">{todayStats.cardioMin}</div>
            <div className="text-[10px] text-muted-foreground">Cardio Min</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Workouts */}
      {recentExercises.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Recent Workouts</h3>
          <div className="space-y-1">
            {recentExercises.slice(0, 5).map((ex, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {ex.type === 'cardio' ? <Activity className="w-3.5 h-3.5 text-success" /> : <Dumbbell className="w-3.5 h-3.5 text-primary" />}
                  <div>
                    <div className="text-sm font-medium">{ex.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono-data">{ex.date}</div>
                  </div>
                </div>
                <div className="text-xs font-mono-data text-right">
                  {ex.type === 'cardio' && <div className="text-muted-foreground">{ex.duration} min</div>}
                  <div className="text-accent">{ex.cal} cal</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Categories - includes Cardio */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium tap-scale ${selectedCategory === 'All' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >All</button>
        {workoutCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium tap-scale ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
          >{cat}</button>
        ))}
      </div>

      {/* Favorites */}
      {favorites.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-primary">⭐ Favorites</h3>
          {exerciseDatabase.filter(e => favorites.includes(e.id)).map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} isFavorite onToggleFav={() => toggleFavorite(ex.id)} onAdd={() => openAddModal(ex.id, ex.name)} />
          ))}
        </div>
      )}

      {/* Exercise List */}
      <div className="space-y-1">
        {filtered.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} isFavorite={favorites.includes(ex.id)} onToggleFav={() => toggleFavorite(ex.id)} onAdd={() => openAddModal(ex.id, ex.name)} />
        ))}
      </div>

      <RestTimer isOpen={showTimer} onClose={() => setShowTimer(false)} />

      {/* Strength Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" /> Add Workout
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Exercise Name</label>
              <input value={modalExName} onChange={e => setModalExName(e.target.value)} placeholder="e.g. Bench Press"
                className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Sets', val: modalSets, set: setModalSets, ph: '3' },
                { label: 'Reps', val: modalReps, set: setModalReps, ph: '10' },
                { label: 'Weight (kg)', val: modalWeight, set: setModalWeight, ph: '0' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-muted-foreground font-medium mb-1 block">{f.label}</label>
                  <input type="text" inputMode="numeric" value={numDisplay(f.val)}
                    onChange={e => { const v = cleanNumStr(e.target.value); f.set(v === '' ? 0 : parseNum(v)); }}
                    placeholder={f.ph}
                    className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-mono-data text-foreground outline-none" />
                </div>
              ))}
            </div>
            {modalSets > 0 && modalReps > 0 && (
              <div className="text-xs text-muted-foreground text-center">
                Est. calories: <span className="text-accent font-mono-data font-bold">{estimatedCalories}</span> kcal
              </div>
            )}
            <button onClick={addWorkout} disabled={!modalExName || modalSets <= 0 || modalReps <= 0}
              className="w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground tap-scale disabled:opacity-50">
              Add Workout
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cardio Modal */}
      <Dialog open={showCardioModal} onOpenChange={setShowCardioModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-success" /> Add Cardio
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Activity</label>
              <select
                value={cardioActivityId}
                onChange={e => setCardioActivityId(e.target.value)}
                className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none"
              >
                {CARDIO_ACTIVITIES.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-medium mb-1 block">Duration (minutes)</label>
              <input type="text" inputMode="numeric" value={numDisplay(cardioMinutes)}
                onChange={e => { const v = cleanNumStr(e.target.value); setCardioMinutes(v === '' ? 0 : parseNum(v)); }}
                placeholder="Enter minutes"
                className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-mono-data text-foreground outline-none" />
            </div>
            {cardioMinutes > 0 && (
              <div className="text-xs text-muted-foreground text-center">
                Est. calories: <span className="text-accent font-mono-data font-bold">{cardioCalories}</span> kcal
              </div>
            )}
            <button onClick={addCardio} disabled={cardioMinutes <= 0}
              className="w-full py-3 rounded-xl font-semibold bg-primary text-primary-foreground tap-scale disabled:opacity-50">
              Add Cardio
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExerciseCard({ exercise, isFavorite, onToggleFav, onAdd }: {
  exercise: { id: string; name: string; muscle: string; category: string; instructions: string };
  isFavorite: boolean; onToggleFav: () => void; onAdd: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center p-3 gap-3">
        <button onClick={onToggleFav} className="tap-scale">
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left">
          <div className="text-sm font-medium">{exercise.name}</div>
          <div className="text-xs text-muted-foreground">{exercise.muscle}</div>
        </button>
        <button onClick={onAdd} className="p-2 rounded-lg bg-secondary tap-scale">
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <p className="px-3 pb-3 text-xs text-muted-foreground">{exercise.instructions}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

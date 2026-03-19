import { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { WorkoutLog, WeightEntry } from '@/lib/types';
import { TrendingUp, Clock, Flame, Dumbbell, Plus, Trophy, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface PREntry {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
}

const PR_EXERCISES = ['Barbell Squat', 'Flat Barbell Bench Press', 'Conventional Deadlift', 'Squat', 'Bench Press', 'Deadlift'];
const PR_DISPLAY: { key: string; label: string; matches: string[] }[] = [
  { key: 'bench', label: 'Bench Press', matches: ['Flat Barbell Bench Press', 'Bench Press'] },
  { key: 'squat', label: 'Squat', matches: ['Barbell Squat', 'Squat'] },
  { key: 'deadlift', label: 'Deadlift', matches: ['Conventional Deadlift', 'Deadlift'] },
];

export default function Progress() {
  const [workoutLogs] = useLocalStorage<WorkoutLog[]>('gym_workout_logs', []);
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('gym_weights', []);
  const [newWeight, setNewWeight] = useState('');

  const stats = useMemo(() => {
    const totalExercises = workoutLogs.reduce((s, w) => s + w.exercises.length, 0);
    const totalMinutes = workoutLogs.reduce((s, w) => s + w.duration, 0);
    const totalCalories = workoutLogs.reduce((s, w) => s + w.caloriesBurned, 0);
    const cardioMinutes = workoutLogs.filter(w => w.type === 'cardio').reduce((s, w) => s + w.duration, 0);
    const cardioCalories = workoutLogs.filter(w => w.type === 'cardio').reduce((s, w) => s + w.caloriesBurned, 0);
    return {
      totalWorkouts: totalExercises,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      totalCalories,
      cardioMinutes,
      cardioCalories,
    };
  }, [workoutLogs]);

  const addWeight = () => {
    const w = parseFloat(newWeight);
    if (!w) return;
    setWeights(prev => [...prev, { date: new Date().toISOString().split('T')[0], weight: w }]);
    setNewWeight('');
  };

  const prs = useMemo(() => {
    const prMap: Record<string, PREntry> = {};
    for (const log of workoutLogs) {
      for (const ex of log.exercises) {
        const normalName = ex.name.trim();
        if (!PR_EXERCISES.some(p => p.toLowerCase() === normalName.toLowerCase())) continue;
        for (const set of ex.sets) {
          if (set.completed && set.weight > 0) {
            const current = prMap[normalName];
            if (!current || set.weight > current.weight || (set.weight === current.weight && set.reps > current.reps)) {
              prMap[normalName] = { exercise: normalName, weight: set.weight, reps: set.reps, date: log.date };
            }
          }
        }
      }
    }
    return prMap;
  }, [workoutLogs]);

  const getPR = (matches: string[]) => {
    let best: PREntry | null = null;
    for (const m of matches) {
      for (const [key, val] of Object.entries(prs)) {
        if (key.toLowerCase() === m.toLowerCase()) {
          if (!best || val.weight > best.weight) best = val;
        }
      }
    }
    return best;
  };

  const recentWorkouts = useMemo(() => {
    const all: { id: string; date: string; name: string; calories: number; duration: number; type: string }[] = [];
    for (const log of [...workoutLogs].reverse()) {
      for (const ex of log.exercises) {
        all.push({ id: log.id + ex.exerciseId, date: log.date, name: ex.name, calories: log.caloriesBurned, duration: log.duration, type: log.type || 'strength' });
      }
      if (all.length >= 10) break;
    }
    return all.slice(0, 10);
  }, [workoutLogs]);

  const last10Weights = weights.slice(-10);
  const maxW = last10Weights.length ? Math.max(...last10Weights.map(w => w.weight)) : 100;
  const minW = last10Weights.length ? Math.min(...last10Weights.map(w => w.weight)) : 0;
  const chartPadding = 5; // kg padding above/below
  const chartMin = Math.max(0, minW - chartPadding);
  const chartMax = maxW + chartPadding;
  const chartRange = chartMax - chartMin || 10;

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">Progress</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Dumbbell, label: 'Workouts', value: stats.totalWorkouts },
          { icon: Clock, label: 'Hours', value: stats.totalHours },
          { icon: Flame, label: 'Burned', value: stats.totalCalories },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 text-center">
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="font-mono-data text-lg font-bold">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Cardio Stats */}
      {stats.cardioMinutes > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-success/30 p-4 text-center">
            <Activity className="w-5 h-5 text-success mx-auto mb-2" />
            <div className="font-mono-data text-lg font-bold text-success">{stats.cardioMinutes}</div>
            <div className="text-[10px] text-muted-foreground">Cardio Minutes</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-success/30 p-4 text-center">
            <Flame className="w-5 h-5 text-success mx-auto mb-2" />
            <div className="font-mono-data text-lg font-bold text-success">{stats.cardioCalories}</div>
            <div className="text-[10px] text-muted-foreground">Cardio Calories</div>
          </motion.div>
        </div>
      )}

      {/* Personal Records */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" /> Personal Records
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {PR_DISPLAY.map(({ key, label, matches }) => {
            const pr = getPR(matches);
            return (
              <div key={key} className="text-center">
                <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
                {pr ? (
                  <>
                    <div className="font-mono-data text-lg font-bold text-primary">{pr.weight}<span className="text-xs text-muted-foreground">kg</span></div>
                    <div className="text-[10px] text-muted-foreground">×{pr.reps} reps</div>
                  </>
                ) : (
                  <div className="font-mono-data text-sm text-muted-foreground">—</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weight Chart - High contrast bar chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Weight Tracker
        </h3>
        {last10Weights.length > 0 ? (
          <div className="relative bg-muted/30 rounded-lg p-3">
            {/* Y-axis labels */}
            <div className="flex">
              <div className="flex flex-col justify-between pr-2 text-[9px] text-muted-foreground font-mono-data h-40">
                <span>{Math.round(chartMax)}</span>
                <span>{Math.round((chartMax + chartMin) / 2)}</span>
                <span>{Math.round(chartMin)}</span>
              </div>
              {/* Bars */}
              <div className="flex-1 flex items-end gap-1.5 h-40">
                {last10Weights.map((w, i) => {
                  const h = ((w.weight - chartMin) / chartRange) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(h, 8)}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="w-full rounded-t-md relative group"
                        style={{ background: 'hsl(var(--success))' }}
                      >
                        {/* Value label on top */}
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono-data text-[10px] font-bold text-success whitespace-nowrap">
                          {w.weight}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* X-axis dates */}
            <div className="flex ml-8 mt-1.5">
              {last10Weights.map((w, i) => (
                <div key={i} className="flex-1 text-center text-[8px] text-muted-foreground font-mono-data">
                  {w.date.slice(5)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-8">Log your first weight to start tracking.</p>
        )}

        <div className="flex gap-2 mt-3">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Weight (kg)"
            value={newWeight}
            onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, '').replace(/^0+(\d)/, '$1'); setNewWeight(v); }}
            className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm font-mono-data text-foreground outline-none"
          />
          <button onClick={addWeight} className="p-2 rounded-lg bg-primary text-primary-foreground tap-scale">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Workout History */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Recent Workouts</h3>
        {recentWorkouts.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">No workouts logged yet. Hit the gym!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentWorkouts.map((w, i) => (
              <div key={w.id + i} className="bg-card rounded-xl border border-border p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {w.type === 'cardio' ? <Activity className="w-3.5 h-3.5 text-success" /> : <Dumbbell className="w-3.5 h-3.5 text-primary" />}
                  <div>
                    <div className="text-sm font-medium">
                      {w.type === 'cardio' ? `${w.name} - ${w.duration} min` : w.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono-data">{w.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {w.type !== 'cardio' && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{w.duration}m</span>}
                  <span className="flex items-center gap-1 text-accent"><Flame className="w-3 h-3" />{w.calories}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

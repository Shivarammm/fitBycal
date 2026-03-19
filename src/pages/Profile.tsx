import { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { calculateNutrition, type UserProfile } from '@/lib/nutrition';
import { User, Target, Activity, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const emptyProfile: UserProfile = {
  name: '', age: 0, height: 0, weight: 0, waist: 0,
  gender: 'male', activityLevel: 'moderate', goal: 'maintenance', preference: 'gym',
};

// Parse numeric input: remove leading zeros, allow empty
const cleanNumStr = (val: string): string => {
  if (val === '') return '';
  const cleaned = val.replace(/[^0-9]/g, '').replace(/^0+(\d)/, '$1');
  return cleaned;
};
const parseNum = (val: string): number => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

export default function Profile() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('gym_profile', emptyProfile);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const targets = useMemo(() => calculateNutrition(form), [form]);

  const save = () => {
    setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: keyof UserProfile, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNumChange = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = cleanNumStr(e.target.value);
    update(field, raw === '' ? 0 : parseNum(raw));
  };

  // Show empty string for 0 values so placeholder shows
  const numVal = (v: number) => v === 0 ? '' : v;

  const inputCls = "w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none font-mono-data";
  const labelCls = "text-xs text-muted-foreground font-medium mb-1 block";
  const selectCls = "w-full bg-secondary rounded-lg px-3 py-2.5 text-sm text-foreground outline-none appearance-none";

  return (
    <div className="pb-20 px-4 pt-6 max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" />Personal Info</h3>
        <div>
          <label className={labelCls}>Name</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} className={inputCls} placeholder="Your name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Age</label>
            <input type="number" value={numVal(form.age)} onChange={handleNumChange('age')} className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>Gender</label>
            <select value={form.gender} onChange={e => update('gender', e.target.value)} className={selectCls}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Height (cm)</label>
            <input type="number" value={numVal(form.height)} onChange={handleNumChange('height')} className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>Weight (kg)</label>
            <input type="number" value={numVal(form.weight)} onChange={handleNumChange('weight')} className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>Waist (cm)</label>
            <input type="number" value={numVal(form.waist)} onChange={handleNumChange('waist')} className={inputCls} placeholder="0" />
          </div>
        </div>
      </motion.div>

      {/* Fitness Goals */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Fitness Goal</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['bulking', 'cutting', 'maintenance'] as const).map(g => (
            <button key={g} onClick={() => update('goal', g)} className={`py-2.5 rounded-lg text-xs font-semibold tap-scale capitalize ${form.goal === g ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {g}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-semibold flex items-center gap-2 pt-2"><Activity className="w-4 h-4 text-primary" />Activity Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {([
            { v: 'none', l: 'Sedentary' },
            { v: 'light', l: 'Light' },
            { v: 'moderate', l: 'Moderate' },
            { v: 'hard', l: 'Intense' },
          ] as const).map(a => (
            <button key={a.v} onClick={() => update('activityLevel', a.v)} className={`py-2.5 rounded-lg text-xs font-semibold tap-scale ${form.activityLevel === a.v ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {a.l}
            </button>
          ))}
        </div>

        <div>
          <label className={labelCls}>Workout Preference</label>
          <div className="grid grid-cols-2 gap-2">
            {(['gym', 'home'] as const).map(p => (
              <button key={p} onClick={() => update('preference', p)} className={`py-2.5 rounded-lg text-xs font-semibold tap-scale capitalize ${form.preference === p ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Calculated Targets */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-primary/20 p-4">
        <h3 className="text-sm font-semibold text-primary mb-3">📊 Daily Nutrition Targets</h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { l: 'Calories', v: targets.calories, u: 'kcal' },
            { l: 'Protein', v: targets.protein, u: 'g' },
            { l: 'Carbs', v: targets.carbs, u: 'g' },
            { l: 'Fat', v: targets.fat, u: 'g' },
            { l: 'Fiber', v: targets.fiber, u: 'g' },
          ].map(t => (
            <div key={t.l}>
              <div className="font-mono-data text-lg font-bold text-primary">{t.v}</div>
              <div className="text-[10px] text-muted-foreground">{t.l}</div>
              <div className="text-[10px] text-muted-foreground">{t.u}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save */}
      <button onClick={save} className={`w-full py-3 rounded-xl font-semibold tap-scale flex items-center justify-center gap-2 ${saved ? 'bg-success text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Save Profile'}
      </button>
    </div>
  );
}

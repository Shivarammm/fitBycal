import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeconds?: number;
}

export function RestTimer({ isOpen, onClose, initialSeconds = 90 }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout>();

  const presets = [30, 60, 90, 120, 180];

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      if (seconds === 0) setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, seconds]);

  const reset = useCallback(() => {
    setSeconds(selectedTime);
    setIsRunning(false);
  }, [selectedTime]);

  const selectPreset = (t: number) => {
    setSelectedTime(t);
    setSeconds(t);
    setIsRunning(false);
  };

  const pct = seconds / selectedTime;
  const r = 60;
  const circ = 2 * Math.PI * r;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="flex items-center justify-between w-full max-w-xs">
            <h3 className="text-lg font-semibold">Rest Timer</h3>
            <button onClick={onClose} className="p-2 text-muted-foreground tap-scale">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg width={160} height={160} className="-rotate-90">
              <circle cx={80} cy={80} r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth={6} />
              <circle
                cx={80} cy={80} r={r} fill="none"
                stroke={seconds === 0 ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                className="transition-all duration-1000"
              />
            </svg>
            <span className={`absolute font-mono-data text-4xl font-bold ${seconds === 0 ? 'text-accent' : 'text-foreground'}`}>
              {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setIsRunning(!isRunning)} className="p-4 rounded-full bg-primary text-primary-foreground tap-scale">
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button onClick={reset} className="p-4 rounded-full bg-secondary text-secondary-foreground tap-scale">
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2">
            {presets.map(t => (
              <button
                key={t}
                onClick={() => selectPreset(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tap-scale transition-colors ${
                  selectedTime === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

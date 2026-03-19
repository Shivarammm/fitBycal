interface CalorieRingProps {
  current: number;
  target: number;
  size?: number;
}

export function CalorieRing({ current, target, size = 140 }: CalorieRingProps) {
  const pct = Math.min(current / Math.max(target, 1), 1);
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct);
  const remaining = Math.max(target - current, 0);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth={8} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-data text-2xl font-bold text-foreground">{Math.round(current)}</span>
        <span className="text-[10px] text-muted-foreground font-medium">{Math.round(remaining)} left</span>
      </div>
    </div>
  );
}

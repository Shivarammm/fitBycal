interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroBar({ label, current, target, color, unit = 'g' }: MacroBarProps) {
  const pct = Math.min((current / Math.max(target, 1)) * 100, 100);
  const remaining = Math.max(target - current, 0);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className="font-mono-data text-xs">
          <span className="text-foreground">{Math.round(current)}</span>
          <span className="text-muted-foreground">/{target}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{Math.round(remaining)}{unit} remaining</span>
    </div>
  );
}

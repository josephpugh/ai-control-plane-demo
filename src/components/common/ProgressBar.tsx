import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md';
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'auto';
}

export function ProgressBar({ value, max = 100, label, showValue = true, size = 'sm', color = 'auto' }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const resolvedColor = color === 'auto'
    ? pct >= 90 ? 'emerald' : pct >= 70 ? 'blue' : pct >= 50 ? 'amber' : 'red'
    : color;

  const barColors: Record<string, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-surface-400">{label}</span>}
          {showValue && <span className="text-xs font-medium text-surface-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={clsx(
        'rounded-full bg-surface-800 overflow-hidden',
        size === 'sm' ? 'h-1.5' : 'h-2.5',
      )}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', barColors[resolvedColor])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

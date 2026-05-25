import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function MetricCard({ label, value, subtitle, trend, trendValue, icon, accentColor = 'blue' }: MetricCardProps) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/10 to-transparent border-blue-500/20',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20',
    amber: 'from-amber-500/10 to-transparent border-amber-500/20',
    red: 'from-red-500/10 to-transparent border-red-500/20',
    purple: 'from-purple-500/10 to-transparent border-purple-500/20',
    cyan: 'from-cyan-500/10 to-transparent border-cyan-500/20',
  };

  return (
    <div className={clsx(
      'metric-card rounded-xl border bg-gradient-to-br p-5 transition-all',
      colorMap[accentColor] || colorMap.blue,
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-surface-500">{icon}</span>}
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-semibold text-surface-100">{value}</span>
        {trend && (
          <span className={clsx(
            'flex items-center gap-1 text-xs font-medium mb-1',
            trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-surface-400',
          )}>
            {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
            {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-surface-500 mt-1">{subtitle}</p>}
    </div>
  );
}

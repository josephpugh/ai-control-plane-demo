import { clsx } from 'clsx';

const statusStyles: Record<string, string> = {
  passed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  pass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  deployed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  connected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
  fail: 'bg-red-500/15 text-red-400 border-red-500/30',
  blocked: 'bg-red-500/15 text-red-400 border-red-500/30',
  disconnected: 'bg-red-500/15 text-red-400 border-red-500/30',
  tampered: 'bg-red-500/15 text-red-400 border-red-500/30',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  degraded: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  testing: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  running: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  building: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  intake: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  monitoring: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  gating: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  retired: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  inactive: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  'not-started': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

const riskStyles: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'xs' | 'sm' | 'md' }) {
  const style = statusStyles[status] || riskStyles[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full border font-medium capitalize',
      style,
      size === 'xs' && 'px-1.5 py-0.5 text-[10px]',
      size === 'sm' && 'px-2 py-0.5 text-xs',
      size === 'md' && 'px-3 py-1 text-sm',
    )}>
      <span className={clsx(
        'rounded-full mr-1.5',
        size === 'xs' && 'w-1 h-1',
        size === 'sm' && 'w-1.5 h-1.5',
        size === 'md' && 'w-2 h-2',
        status === 'running' || status === 'building' ? 'animate-pulse' : '',
        statusStyles[status]?.includes('emerald') || riskStyles[status]?.includes('emerald') ? 'bg-emerald-400' :
        statusStyles[status]?.includes('red') || riskStyles[status]?.includes('red') ? 'bg-red-400' :
        statusStyles[status]?.includes('yellow') || riskStyles[status]?.includes('yellow') ? 'bg-yellow-400' :
        statusStyles[status]?.includes('blue') ? 'bg-blue-400' :
        statusStyles[status]?.includes('purple') ? 'bg-purple-400' :
        statusStyles[status]?.includes('cyan') ? 'bg-cyan-400' :
        statusStyles[status]?.includes('orange') || riskStyles[status]?.includes('orange') ? 'bg-orange-400' :
        'bg-gray-400',
      )} />
      {status.replace(/-/g, ' ')}
    </span>
  );
}

export function RiskBadge({ risk, size = 'sm' }: { risk: string; size?: 'xs' | 'sm' | 'md' }) {
  return <StatusBadge status={risk} size={size} />;
}

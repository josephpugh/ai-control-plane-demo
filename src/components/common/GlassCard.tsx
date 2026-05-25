import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

export function GlassCard({ children, className, hover = false, onClick, gradient = false }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl bg-surface-900/60 backdrop-blur-sm border border-surface-700/50',
        hover && 'cursor-pointer transition-all hover:border-brand-500/30 hover:bg-surface-800/60 hover:shadow-lg hover:shadow-brand-500/5',
        gradient && 'gradient-border',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('px-5 py-4 border-b border-surface-700/50', className)}>
      {children}
    </div>
  );
}

export function GlassCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('p-5', className)}>
      {children}
    </div>
  );
}

import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-gradient-to-br from-primary to-primary/80',
  success: 'bg-gradient-to-br from-success to-success/80',
  warning: 'bg-gradient-to-br from-warning to-warning/80',
  destructive: 'bg-gradient-to-br from-destructive to-destructive/80',
};

const iconStyles = {
  default: 'bg-primary/10 text-primary',
  primary: 'bg-white/20 text-white',
  success: 'bg-white/20 text-white',
  warning: 'bg-white/20 text-white',
  destructive: 'bg-white/20 text-white',
};

const textStyles = {
  default: 'text-foreground',
  primary: 'text-white',
  success: 'text-white',
  warning: 'text-white',
  destructive: 'text-white',
};

export function KPICard({ title, value, change, icon: Icon, variant = 'default', onClick }: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl p-5 shadow-card transition-all duration-200 hover:shadow-card-hover',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:scale-[1.02]'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn('text-sm font-medium opacity-80', textStyles[variant])}>{title}</p>
          <p className={cn('text-2xl font-bold', textStyles[variant])}>{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs font-medium',
                variant === 'default'
                  ? change.isPositive
                    ? 'text-success'
                    : 'text-destructive'
                  : 'opacity-80',
                textStyles[variant]
              )}
            >
              {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}% vs yesterday
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

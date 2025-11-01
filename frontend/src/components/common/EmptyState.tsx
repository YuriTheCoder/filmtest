import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-text-secondary mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

import { Badge } from './ui/badge';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const variants = {
    'low': { label: 'Low', className: 'bg-muted text-muted-foreground hover:bg-muted' },
    'medium': { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
    'high': { label: 'High', className: 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
  };

  const { label, className } = variants[priority];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

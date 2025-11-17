import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'todo' | 'in-progress' | 'done';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    'todo': { label: 'To Do', className: 'bg-muted text-muted-foreground hover:bg-muted' },
    'in-progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' },
    'done': { label: 'Done', className: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' },
  };

  const { label, className } = variants[status];

  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

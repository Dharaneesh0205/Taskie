import { ElementType } from 'react';

interface DetailItemProps {
  icon: ElementType;
  label: string;
  value: string;
  href?: string;
}

export function DetailItem({ icon: Icon, label, value, href }: DetailItemProps) {
  const content = href ? (
    <a href={href} className="hover:underline truncate">
      {value}
    </a>
  ) : (
    <span className="truncate">{value}</span>
  );

  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <div className="text-sm text-muted-foreground">{content}</div>
      </div>
    </div>
  );
}

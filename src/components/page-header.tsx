import React from 'react';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';
import { cn } from './ui/utils';

interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  type?: 'button' | 'submit' | 'reset';
}

interface PageHeaderProps {
  title: string | React.ReactNode;
  description?: string;
  onBack?: () => void;
  actions?: PageHeaderAction[];
}

export function PageHeader({
  title,
  description,
  onBack,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1>{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, i) => {
            const { label, icon: ActionIcon, variant, onClick, type } = action;
            return (
              <Button
                key={i}
                type={type || 'button'}
                variant={variant}
                size="sm"
                onClick={onClick}
              >
                {ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />}
                {label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

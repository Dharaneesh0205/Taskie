import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { Task } from '../lib/data';
import { EmployeeAvatar } from './employee-avatar';
import { StatusBadge } from './status-badge';
import { PriorityBadge } from './priority-badge';
import { format } from 'date-fns';

interface RecentTaskListProps {
  tasks: Task[];
}

export function RecentTaskList({ tasks }: RecentTaskListProps) {
  const navigate = useNavigate();
  const { getEmployeeById } = useApp();

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No upcoming tasks
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const employee = getEmployeeById(task.assigned_to);
        return (
          <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/tasks/${task.id}`)}>
            {employee && (
              <EmployeeAvatar
                firstName={employee.first_name}
                lastName={employee.last_name}
                size="sm"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate">{task.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-muted-foreground">
                  Due {format(new Date(task.due_date), 'MMM d')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

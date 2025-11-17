import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../lib/data';
import { EmployeeAvatar } from './employee-avatar';
import { Badge } from './ui/badge';
import { format } from 'date-fns';

interface RecentEmployeeListProps {
  employees: Employee[];
}

export function RecentEmployeeList({ employees }: RecentEmployeeListProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/employees/${employee.id}`)}>
          <EmployeeAvatar
            firstName={employee.first_name}
            lastName={employee.last_name}
          />
          <div className="flex-1 min-w-0">
            <p className="truncate">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {employee.role}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {format(new Date(employee.joined_at), 'MMM d')}
          </Badge>
        </div>
      ))}
    </div>
  );
}

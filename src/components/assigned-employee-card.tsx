import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../lib/data';
import { EmployeeAvatar } from './employee-avatar';

interface AssignedEmployeeCardProps {
  employee: Employee;
}

export function AssignedEmployeeCard({ employee }: AssignedEmployeeCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/employees/${employee.id}`)}
    >
      <EmployeeAvatar
        firstName={employee.first_name}
        lastName={employee.last_name}
      />
      <div>
        <p>{employee.first_name} {employee.last_name}</p>
        <p className="text-sm text-muted-foreground">{employee.role}</p>
      </div>
    </div>
  );
}

import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useApp } from '../lib/context';
import { format } from 'date-fns';

export function ExportMenu() {
  const { tasks, employees } = useApp();

  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTasks = () => {
    const taskData = tasks.map(task => {
      const employee = employees.find(e => e.id === task.assigned_to);
      return {
        Title: task.title,
        Description: task.description || '',
        Status: task.status,
        Priority: task.priority,
        'Due Date': task.due_date,
        'Assigned To': employee ? `${employee.first_name} ${employee.last_name}` : 'Unassigned',
        'Created At': task.created_at || ''
      };
    });
    exportToCSV(taskData, 'tasks');
  };

  const exportEmployees = () => {
    const employeeData = employees.map(emp => ({
      'First Name': emp.first_name,
      'Last Name': emp.last_name,
      Email: emp.email,
      Role: emp.role,
      Phone: emp.phone,
      'Joined At': emp.joined_at
    }));
    exportToCSV(employeeData, 'employees');
  };

  const exportReport = () => {
    const reportData = employees.map(emp => {
      const empTasks = tasks.filter(t => t.assigned_to === emp.id);
      const completed = empTasks.filter(t => t.status === 'done').length;
      const inProgress = empTasks.filter(t => t.status === 'in-progress').length;
      const todo = empTasks.filter(t => t.status === 'todo').length;
      
      return {
        Employee: `${emp.first_name} ${emp.last_name}`,
        Role: emp.role,
        'Total Tasks': empTasks.length,
        Completed: completed,
        'In Progress': inProgress,
        'To Do': todo,
        'Completion Rate': empTasks.length > 0 ? `${Math.round((completed / empTasks.length) * 100)}%` : '0%'
      };
    });
    exportToCSV(reportData, 'productivity-report');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportTasks}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Tasks (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportEmployees}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Employees (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportReport}>
          <FileText className="h-4 w-4 mr-2" />
          Export Report (CSV)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
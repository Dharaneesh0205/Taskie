import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Task } from '../lib/data';

interface QuickStatusChangeProps {
  task: Task;
  onStatusChange: (newStatus: 'todo' | 'in-progress' | 'done') => void;
}

export function QuickStatusChange({ task, onStatusChange }: QuickStatusChangeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-sm font-medium">Change Status</label>
          <Select
            value={task.status}
            onValueChange={(value) => onStatusChange(value as 'todo' | 'in-progress' | 'done')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

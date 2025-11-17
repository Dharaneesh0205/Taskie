import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Subtask } from '../lib/data';

interface SubtasksProps {
  taskId: number;
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (subtaskId: number, completed: boolean) => void;
  onDeleteSubtask: (subtaskId: number) => void;
}

export function Subtasks({ taskId, subtasks, onAddSubtask, onToggleSubtask, onDeleteSubtask }: SubtasksProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const progressPercentage = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Subtasks ({completedCount}/{subtasks.length})
          </div>
          {subtasks.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {subtasks.length > 0 && (
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Subtasks List */}
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
              <Checkbox
                checked={subtask.completed}
                onCheckedChange={(checked) => onToggleSubtask(subtask.id, checked as boolean)}
              />
              <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                {subtask.title}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteSubtask(subtask.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Subtask Form */}
        <form onSubmit={handleAddSubtask} className="flex gap-2">
          <Input
            placeholder="Add a subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newSubtaskTitle.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
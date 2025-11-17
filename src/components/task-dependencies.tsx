import React, { useState } from 'react';
import { GitBranch, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Task } from '../lib/data';

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onAddDependency: (dependsOnId: number) => void;
  onRemoveDependency: (dependsOnId: number) => void;
}

export function TaskDependencies({ task, allTasks, onAddDependency, onRemoveDependency }: TaskDependenciesProps) {
  const [selectedDependency, setSelectedDependency] = useState<string>('');

  const availableTasks = allTasks.filter(t => 
    t.id !== task.id && 
    !task.depends_on?.includes(t.id) &&
    !t.depends_on?.includes(task.id) // Prevent circular dependencies
  );

  const dependentTasks = allTasks.filter(t => task.depends_on?.includes(t.id));

  const handleAddDependency = () => {
    if (selectedDependency) {
      onAddDependency(parseInt(selectedDependency));
      setSelectedDependency('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Dependencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Dependencies */}
        <div>
          <h4 className="font-medium mb-2">This task depends on:</h4>
          {dependentTasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No dependencies</p>
          ) : (
            <div className="space-y-2">
              {dependentTasks.map((depTask) => (
                <div key={depTask.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="text-sm font-medium">{depTask.title}</p>
                    <p className="text-xs text-muted-foreground">Status: {depTask.status}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveDependency(depTask.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Dependency */}
        {availableTasks.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Add Dependency</h4>
            <div className="flex gap-2">
              <Select value={selectedDependency} onValueChange={setSelectedDependency}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {availableTasks.map((availableTask) => (
                    <SelectItem key={availableTask.id} value={availableTask.id.toString()}>
                      {availableTask.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddDependency} size="sm" disabled={!selectedDependency}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Blocking Tasks */}
        {allTasks.some(t => t.depends_on?.includes(task.id)) && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Tasks waiting for this:</h4>
            <div className="space-y-2">
              {allTasks
                .filter(t => t.depends_on?.includes(task.id))
                .map((blockedTask) => (
                  <div key={blockedTask.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium">{blockedTask.title}</p>
                    <p className="text-xs text-muted-foreground">Blocked by this task</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
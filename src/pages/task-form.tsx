import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useApp } from '../lib/context';
import { useForm, Controller } from 'react-hook-form';
import { Task } from '../lib/data';

type TaskFormData = Omit<Task, 'id' | 'created_at'>;

export function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, addTask, updateTask, employees } = useApp();

  const isEditing = !!id;
  const task = isEditing ? getTaskById(Number(id)) : null;

  const { register, handleSubmit, control, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      assigned_to: task.assigned_to,
    } : {
      status: 'todo',
      priority: 'medium',
      due_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing && task) {
        await updateTask(task.id, data);
      } else {
        await addTask(data);
      }
      navigate('/tasks');
    } catch (error) {
      // Error toast is already shown in context
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/tasks')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1>{isEditing ? 'Edit Task' : 'Add Task'}</h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? 'Update task information' : 'Create a new task'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="Enter task title"
            aria-invalid={errors.title ? 'true' : 'false'}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter task description (optional)"
            rows={4}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" aria-invalid={errors.status ? 'true' : 'false'}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: 'Priority is required' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="priority" aria-invalid={errors.priority ? 'true' : 'false'}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p className="text-sm text-destructive">{errors.priority.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date', { required: 'Due date is required' })}
              aria-invalid={errors.due_date ? 'true' : 'false'}
            />
            {errors.due_date && (
              <p className="text-sm text-destructive">{errors.due_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_to">
              Assign To <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="assigned_to"
              control={control}
              rules={{ required: 'Assignee is required' }}
              render={({ field }) => (
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="assigned_to" aria-invalid={errors.assigned_to ? 'true' : 'false'}>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.first_name} {emp.last_name} - {emp.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.assigned_to && (
              <p className="text-sm text-destructive">{errors.assigned_to.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1 sm:flex-initial">
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/tasks')}
            className="flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

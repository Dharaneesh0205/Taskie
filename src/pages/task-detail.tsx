import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Calendar, User, CheckSquare as CheckSquareIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../lib/data';
import { useApp } from '../lib/context';

import { PageHeader } from '../components/page-header';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/empty-state';
import { DetailItem } from '../components/detail-item';
import { QuickStatusChange } from '../components/quick-status-change';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, getEmployeeById, deleteTask, updateTask, tasks, user } = useApp();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const task = getTaskById(Number(id));
  const employee = task ? getEmployeeById(task.assigned_to) : null;

  if (!task) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/tasks')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tasks
        </Button>
        <EmptyState
          icon={CheckSquareIcon}
          title="Task not found"
          description="The task you're looking for doesn't exist."
          actionLabel="Go to Tasks"
          onAction={() => navigate('/tasks')}
        />
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      navigate('/tasks');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'todo' | 'in-progress' | 'done') => {
    try {
      await updateTask(task.id, { status: newStatus });

    } catch (error) {
      console.error('Status update error:', error);
    }
  };



  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        onBack={() => navigate('/tasks')}
        actions={[
          {
            label: 'Edit',
            icon: Pencil,
            onClick: () => navigate(`/tasks/${task.id}/edit`),
          },
          {
            label: 'Delete',
            icon: Trash2,
            variant: 'destructive',
            onClick: () => setDeleteDialogOpen(true),
          },
        ]}
        description={task.description}
      />

      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Task Details</h3>
          <div className="space-y-4">
            <DetailItem icon={Calendar} label="Due Date" value={format(new Date(task.due_date), 'MMMM d, yyyy')} />
            {task.created_at && (
              <DetailItem icon={Calendar} label="Created" value={format(new Date(task.created_at), 'MMMM d, yyyy')} />
            )}
            <DetailItem icon={User} label="Assigned To" value={employee ? `${employee.first_name} ${employee.last_name}` : 'Unassigned'} />
          </div>
        </div>

        <QuickStatusChange task={task} onStatusChange={handleStatusChange} />
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Delete "${task.title}"?`}
        description="This action cannot be undone."
      />
    </div>
  );
}

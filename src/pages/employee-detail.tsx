import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Calendar, Briefcase, CheckSquare } from 'lucide-react';
import { PageHeader } from '../components/page-header';
import { Button } from '../components/ui/button';

import { EmployeeAvatar } from '../components/employee-avatar';
import { EmptyState } from '../components/empty-state';
import { useApp } from '../lib/context';
import { format } from 'date-fns';
import { AssignedTaskList } from '../components/assigned-task-list';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { DetailItem } from '../components/detail-item';

export function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEmployeeById, getTasksByEmployee, deleteEmployee } = useApp();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const employee = getEmployeeById(Number(id));
  const tasks = employee ? getTasksByEmployee(employee.id) : [];

  if (!employee) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        <EmptyState
          icon={Briefcase}
          title="Employee not found"
          description="The employee you're looking for doesn't exist."
          actionLabel="Go to Employees"
          onAction={() => navigate('/employees')}
        />
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteEmployee(employee.id);
      navigate('/employees');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${employee.first_name} ${employee.last_name}`}
        description={employee.role}
        onBack={() => navigate('/employees')}
        actions={[
          {
            label: 'Edit',
            icon: Pencil,
            onClick: () => navigate(`/employees/${employee.id}/edit`),
          },
          {
            label: 'Delete',
            icon: Trash2,
            variant: 'destructive',
            onClick: () => setDeleteDialogOpen(true),
          },
        ]}
      />

      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center gap-4 mb-6">
            <EmployeeAvatar
              firstName={employee.first_name}
              lastName={employee.last_name}
              size="lg"
            />
            <div>
              <h3 className="text-lg font-semibold">{employee.first_name} {employee.last_name}</h3>
              <p className="text-muted-foreground">{employee.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <DetailItem icon={Mail} label="Email" value={employee.email} href={`mailto:${employee.email}`} />
            <DetailItem icon={Phone} label="Phone" value={employee.phone} href={`tel:${employee.phone}`} />
            <DetailItem icon={Calendar} label="Joined" value={format(new Date(employee.joined_at), 'MMMM d, yyyy')} />
            <DetailItem icon={CheckSquare} label="Tasks" value={`${tasks.length} assigned`} />
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Assigned Tasks</h3>
          <AssignedTaskList tasks={tasks} />
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title={`Delete ${employee.first_name} ${employee.last_name}`}
        description={
          tasks.length > 0 ? (
            <span className="block mt-2 text-destructive">
              This will also delete {tasks.length} associated task(s).
            </span>
          ) : undefined
        }
      />
    </div>
  );
}

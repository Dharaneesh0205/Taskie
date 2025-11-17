import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { PageHeader } from '../components/page-header';
import { SearchBar } from '../components/search-bar';
import { DataList, Column } from '../components/data-list';
import { ActionMenu } from '../components/action-menu';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { EmployeeAvatar } from '../components/employee-avatar';
import { EmptyState } from '../components/empty-state';
import { useApp } from '../lib/context';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Employee } from '../lib/data';

export function Employees() {
  const navigate = useNavigate();
  const { employees, deleteEmployee, getTasksByEmployee } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(emp =>
    `${emp.first_name} ${emp.last_name} ${emp.email} ${emp.role}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (selectedEmployee) {
      const taskCount = getTasksByEmployee(selectedEmployee.id).length;
      deleteEmployee(selectedEmployee.id);
      toast.success(
        `${selectedEmployee.first_name} ${selectedEmployee.last_name} deleted successfully${taskCount > 0 ? ` (${taskCount} associated tasks removed)` : ''}`
      );
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    }
  };

  const confirmDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const columns: Column[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'joined', label: 'Joined' },
    { key: 'actions', label: '', className: 'w-[40px]' },
  ];

  const renderCell = (employee: Employee, column: Column) => {
    switch (column.key) {
      case 'employee':
        return (
          <div className="flex items-center gap-3">
            <EmployeeAvatar
              firstName={employee.first_name}
              lastName={employee.last_name}
            />
            <div>
              <div>{employee.first_name} {employee.last_name}</div>
            </div>
          </div>
        );
      case 'role':
        return employee.role;
      case 'email':
        return employee.email;
      case 'phone':
        return employee.phone;
      case 'joined':
        return format(new Date(employee.joined_at), 'MMM d, yyyy');
      case 'actions':
        return (
          <ActionMenu
            onView={() => navigate(`/employees/${employee.id}`)}
            onEdit={() => navigate(`/employees/${employee.id}/edit`)}
            onDelete={() => confirmDelete(employee)}
          />
        );
      default:
        return null;
    }
  };

  const renderMobileCard = (employee: Employee) => (
    <div className="flex items-start gap-3">
      <EmployeeAvatar
        firstName={employee.first_name}
        lastName={employee.last_name}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="truncate">
              {employee.first_name} {employee.last_name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {employee.role}
            </p>
          </div>
          <ActionMenu
            stopPropagation
            onView={() => navigate(`/employees/${employee.id}`)}
            onEdit={() => navigate(`/employees/${employee.id}/edit`)}
            onDelete={() => confirmDelete(employee)}
          />
        </div>
        <div className="mt-2 space-y-1 text-sm">
          <p className="text-muted-foreground truncate">{employee.email}</p>
          <p className="text-muted-foreground">{employee.phone}</p>
          <p className="text-muted-foreground">
            Joined {format(new Date(employee.joined_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage your team members and their information"
        actions={[{
          label: "Add Employee",
          icon: Plus,
          onClick: () => navigate('/employees/new'),
        }]}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by name, email, or role..."
      />

      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={searchQuery ? 'No employees found' : 'No employees yet'}
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : "Click 'Add Employee' to create one."
          }
          actionLabel={searchQuery ? undefined : 'Add Employee'}
          onAction={searchQuery ? undefined : () => navigate('/employees/new')}
        />
      ) : (
        <DataList
          data={filteredEmployees}
          columns={columns}
          renderCell={renderCell}
          renderMobileCard={renderMobileCard}
          onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
          getRowKey={(employee) => employee.id}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        description={
          selectedEmployee && (
            <>
              Are you sure you want to delete{' '}
              <strong>{selectedEmployee.first_name} {selectedEmployee.last_name}</strong>?
              This action cannot be undone.
              {getTasksByEmployee(selectedEmployee.id).length > 0 && (
                <span className="block mt-2 text-destructive">
                  This will also delete {getTasksByEmployee(selectedEmployee.id).length} associated task(s).
                </span>
              )}
            </>
          )
        }
      />
    </div>
  );
}

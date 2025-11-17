// Example: Refactored Tasks page using reusable components
// This demonstrates how to use the new reusable components with filters

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckSquare as CheckSquareIcon } from 'lucide-react';
import { PageHeader } from '../components/page-header';
import { SearchBar } from '../components/search-bar';
import { FilterBar, Filter } from '../components/filter-bar';
import { DataList, Column } from '../components/data-list';
import { ActionMenu } from '../components/action-menu';
import { DeleteConfirmDialog } from '../components/delete-confirm-dialog';
import { EmployeeAvatar } from '../components/employee-avatar';
import { StatusBadge } from '../components/status-badge';
import { PriorityBadge } from '../components/priority-badge';
import { EmptyState } from '../components/empty-state';
import { useApp } from '../lib/context';
import { Task } from '../lib/data';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function TasksRefactored() {
  const navigate = useNavigate();
  const { tasks, employees, deleteTask, getEmployeeById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigned_to === Number(assigneeFilter);
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const handleDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      toast.success('Task deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const confirmDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const filters: Filter[] = [
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Status', value: 'all' },
        { label: 'To Do', value: 'todo' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Done', value: 'done' },
      ],
    },
    {
      id: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { label: 'All Priority', value: 'all' },
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      id: 'assignee',
      label: 'Assignee',
      value: assigneeFilter,
      onChange: setAssigneeFilter,
      options: [
        { label: 'All Assignees', value: 'all' },
        ...employees.map(emp => ({
          label: `${emp.first_name} ${emp.last_name}`,
          value: emp.id.toString(),
        })),
      ],
    },
  ];

  const columns: Column[] = [
    { key: 'task', label: 'Task' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'actions', label: '', className: 'w-[60px]' },
  ];

  const renderCell = (task: Task, column: Column) => {
    const employee = getEmployeeById(task.assigned_to);

    switch (column.key) {
      case 'task':
        return (
          <div>
            <div>{task.title}</div>
            {task.description && (
              <div className="text-sm text-muted-foreground truncate max-w-md">
                {task.description}
              </div>
            )}
          </div>
        );
      case 'assignedTo':
        return employee ? (
          <div className="flex items-center gap-2">
            <EmployeeAvatar
              firstName={employee.first_name}
              lastName={employee.last_name}
              size="sm"
            />
            <span className="text-sm">
              {employee.first_name} {employee.last_name}
            </span>
          </div>
        ) : null;
      case 'status':
        return <StatusBadge status={task.status} />;
      case 'priority':
        return <PriorityBadge priority={task.priority} />;
      case 'dueDate':
        return format(new Date(task.due_date), 'MMM d, yyyy');
      case 'actions':
        return (
          <ActionMenu
            onView={() => navigate(`/tasks/${task.id}`)}
            onEdit={() => navigate(`/tasks/${task.id}/edit`)}
            onDelete={() => confirmDelete(task)}
          />
        );
      default:
        return null;
    }
  };

  const renderMobileCard = (task: Task) => {
    const employee = getEmployeeById(task.assigned_to);
    
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="mb-1">{task.title}</p>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <ActionMenu
            stopPropagation
            onView={() => navigate(`/tasks/${task.id}`)}
            onEdit={() => navigate(`/tasks/${task.id}/edit`)}
            onDelete={() => confirmDelete(task)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center justify-between text-sm">
          {employee && (
            <div className="flex items-center gap-2">
              <EmployeeAvatar
                firstName={employee.first_name}
                lastName={employee.last_name}
                size="sm"
              />
              <span className="text-muted-foreground">
                {employee.first_name} {employee.last_name}
              </span>
            </div>
          )}
          <span className="text-muted-foreground">
            Due {format(new Date(task.due_date), 'MMM d')}
          </span>
        </div>
      </div>
    );
  };

  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all';
  const isFiltering = searchQuery || hasActiveFilters;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage and track all tasks across your team"
        actionLabel="Add Task"
        actionIcon={Plus}
        onAction={() => navigate('/tasks/new')}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search tasks..."
      />

      <FilterBar filters={filters} />

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquareIcon}
          title={isFiltering ? 'No tasks found' : 'No tasks yet'}
          description={
            isFiltering
              ? 'Try adjusting your filters or search query'
              : "Click 'Add Task' to create one."
          }
          actionLabel={isFiltering ? undefined : 'Add Task'}
          onAction={isFiltering ? undefined : () => navigate('/tasks/new')}
        />
      ) : (
        <DataList
          data={filteredTasks}
          columns={columns}
          renderCell={renderCell}
          renderMobileCard={renderMobileCard}
          onRowClick={(task) => navigate(`/tasks/${task.id}`)}
          getRowKey={(task) => task.id}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        description={
          selectedTask && (
            <>
              Are you sure you want to delete <strong>{selectedTask.title}</strong>?
              This action cannot be undone.
            </>
          )
        }
      />
    </div>
  );
}

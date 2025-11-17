import { useMemo } from 'react';
import { Users, CheckSquare, Clock, CheckCircle } from 'lucide-react';
import { PageHeader } from '../components/page-header';
import { MetricCard } from '../components/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ExportMenu } from '../components/export-menu';
import { useApp } from '../lib/context';
import { TasksByStatusChart } from '../components/tasks-by-status-chart';
import { TasksByPriorityChart } from '../components/tasks-by-priority-chart';
import { RecentTaskList } from '../components/recent-task-list';
import { RecentEmployeeList } from '../components/recent-employee-list';

export function Dashboard() {
  const { employees, tasks } = useApp();

  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  const upcomingTasks = useMemo(() => tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5), [tasks]);

  const recentEmployees = useMemo(() => employees.slice().sort((a, b) =>
    new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
  ).slice(0, 5), [employees]);

  return (
    <div className="space-y-6 p-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-2xl p-8 text-primary-foreground shadow-xl">
        <div className="flex justify-between items-start">
          <PageHeader
            title={<span className="text-white">Dashboard</span>}
            description="Welcome back! Here's what's happening today."
          />
          <ExportMenu />
        </div>
      </div>

      {/* Metrics Grid - Modern Cards with Shadows */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-secondary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <MetricCard
            title="Total Employees"
            value={employees.length}
            icon={Users}
            description={`${recentEmployees.length} joined recently`}
          />
        </Card>
        <Card className="bg-gradient-to-br from-card to-secondary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <MetricCard
            title="Total Tasks"
            value={tasks.length}
            icon={CheckSquare}
            description={`${tasksByStatus.done} completed`}
          />
        </Card>
        <Card className="bg-gradient-to-br from-card to-secondary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <MetricCard
            title="In Progress"
            value={tasksByStatus.inProgress}
            icon={Clock}
            description="Active tasks"
          />
        </Card>
        <Card className="bg-gradient-to-br from-card to-secondary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <MetricCard
            title="Completed"
            value={tasksByStatus.done}
            icon={CheckCircle}
            description="This month"
          />
        </Card>
      </div>

      {/* Charts - Enhanced Containers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <TasksByStatusChart tasks={tasks} />
        </Card>
        <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <TasksByPriorityChart tasks={tasks} />
        </Card>
      </div>

      {/* Upcoming Tasks & Recent Employees - Modern Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-card to-secondary border-b border-border">
            <CardTitle className="text-xl font-semibold text-card-foreground">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RecentTaskList tasks={upcomingTasks} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all">
          <CardHeader className="bg-gradient-to-r from-card to-secondary border-b border-border">
            <CardTitle className="text-xl font-semibold text-card-foreground">Recent Employees</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RecentEmployeeList employees={recentEmployees} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

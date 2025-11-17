import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Task } from '../lib/data';

interface TasksByStatusChartProps {
  tasks: Task[];
}

export function TasksByStatusChart({ tasks }: TasksByStatusChartProps) {
  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  const chartData = [
    { name: 'To Do', value: tasksByStatus.todo, fill: '#1f2937' },
    { name: 'In Progress', value: tasksByStatus.inProgress, fill: '#059669' },
    { name: 'Done', value: tasksByStatus.done, fill: '#10b981' },
  ];

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Tasks by Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium text-popover-foreground">{label}</p>
                      <p className="text-lg font-bold text-primary">{payload[0].value} tasks</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]} 
              className="drop-shadow-sm"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
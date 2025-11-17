import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Task } from '../lib/data';

interface TasksByPriorityChartProps {
  tasks: Task[];
}

export function TasksByPriorityChart({ tasks }: TasksByPriorityChartProps) {
  const tasksByPriority = useMemo(() => [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#374151' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#059669' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#10b981' },
  ], [tasks]);

  const total = tasksByPriority.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          Tasks by Priority
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <ResponsiveContainer width="60%" height={200}>
            <PieChart>
              <Pie
                data={tasksByPriority}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {tasksByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-sm" />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium text-popover-foreground">{data.name} Priority</p>
                        <p className="text-lg font-bold text-primary">{data.value} tasks ({percentage}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3 w-40%">
            {tasksByPriority.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
              return (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.value} tasks</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from 'react';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useApp } from '../lib/context';
import { format, isToday, isTomorrow } from 'date-fns';

interface Notification {
  id: number;
  type: 'deadline' | 'status' | 'assignment';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationDropdown() {
  const { tasks } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications from tasks
  const taskNotifications = tasks
    .filter(task => {
      const dueDate = new Date(task.due_date);
      return isToday(dueDate) || isTomorrow(dueDate);
    })
    .map(task => ({
      id: task.id,
      type: 'deadline' as const,
      title: 'Task Due Soon',
      message: `"${task.title}" is due ${isToday(new Date(task.due_date)) ? 'today' : 'tomorrow'}`,
      time: format(new Date(task.due_date), 'MMM d'),
      read: false
    }));

  const allNotifications = [...notifications, ...taskNotifications];
  const unreadCount = allNotifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'status': return <Check className="h-4 w-4 text-green-500" />;
      case 'assignment': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {allNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            allNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                  !notification.read ? 'bg-muted/30' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
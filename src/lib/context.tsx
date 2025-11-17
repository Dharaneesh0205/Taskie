import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, Task } from './data';
import * as api from './api';
import * as auth from './auth';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface AppContextType {
  employees: Employee[];
  tasks: Task[];
  loading: boolean;
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: number, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  getEmployeeById: (id: number) => Employee | undefined;
  getTaskById: (id: number) => Task | undefined;
  getTasksByEmployee: (employeeId: number) => Task[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    // Listen to auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load data from Supabase when authenticated
  const loadData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [employeesData, tasksData] = await Promise.all([
        api.getEmployees(),
        api.getTasks()
      ]);
      setEmployees(employeesData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const refreshData = async () => {
    await loadData();
  };

  // Auth functions
  const signIn = async (email: string, password: string) => {
    try {
      await auth.signIn({ email, password });
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await auth.signUp({ email, password, firstName, lastName });
      toast.success('Account created! Please check your email to verify.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setEmployees([]);
      setTasks([]);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      console.log('Attempting to add employee:', employee);
      const newEmployee = await api.createEmployee(employee);
      console.log('Employee added successfully:', newEmployee);
      setEmployees([...employees, newEmployee]);
      toast.success('Employee added successfully');
    } catch (error: any) {
      console.error('Error adding employee:', error);

      // More detailed error messages
      let errorMessage = 'Failed to add employee';
      if (error?.message) {
        errorMessage = error.message;
      }
      if (error?.code === 'PGRST116') {
        errorMessage = 'Permission denied. Check Row Level Security policies.';
      }
      if (error?.code === '23505') {
        errorMessage = 'An employee with this email already exists.';
      }
      if (error?.message?.includes('violates row-level security')) {
        errorMessage = 'Authentication error. Please sign out and sign in again.';
      }

      toast.error(errorMessage);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const updateEmployee = async (id: number, updatedEmployee: Partial<Employee>) => {
    try {
      const updated = await api.updateEmployee(id, updatedEmployee);
      setEmployees(employees.map(emp =>
        emp.id === id ? updated : emp
      ));
      toast.success('Employee updated successfully');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
      throw error;
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await api.deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      // Tasks will be deleted by database CASCADE
      setTasks(tasks.filter(task => task.assigned_to !== id));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
    try {
      const newTask = await api.createTask(task);
      setTasks([...tasks, newTask]);
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      throw error;
    }
  };

  const updateTask = async (id: number, updatedTask: Partial<Task>) => {
    try {
      const updated = await api.updateTask(id, updatedTask);
      setTasks(tasks.map(task =>
        task.id === id ? updated : task
      ));
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  const getEmployeeById = (id: number) => {
    return employees.find(emp => emp.id === id);
  };

  const getTaskById = (id: number) => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByEmployee = (employeeId: number) => {
    return tasks.filter(task => task.assigned_to === employeeId);
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        tasks,
        loading,
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut: handleSignOut,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addTask,
        updateTask,
        deleteTask,
        getEmployeeById,
        getTaskById,
        getTasksByEmployee,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

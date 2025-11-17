import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './lib/context';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/error-boundary';

import { MainLayout } from './components/layout/main-layout';
import { Dashboard } from './pages/dashboard';
import { Employees } from './pages/employees';
import { EmployeeDetail } from './pages/employee-detail';
import { EmployeeForm } from './pages/employee-form';
import { Tasks } from './pages/tasks';
import { TaskDetail } from './pages/task-detail';
import { TaskForm } from './pages/task-form';
import { Profile } from './pages/profile';
import { Login } from './pages/login';
import { LoadingSpinner } from './components/loading-spinner';

function AppRoutes() {
  const { loading, isAuthenticated } = useApp();



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          {/* Employee Routes */}
          <Route path="employees" element={<Employees />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="employees/:id/edit" element={<EmployeeForm />} />

          {/* Task Routes */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<TaskForm />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="tasks/:id/edit" element={<TaskForm />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

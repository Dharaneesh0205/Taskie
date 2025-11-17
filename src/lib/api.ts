import { supabase } from './supabase';
import type { Employee, Task } from './data';

// Helper to get current user ID
async function getCurrentUserId(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    return user.id;
}

// Employee operations
export async function getEmployees() {
    // RLS policy automatically filters by user_id
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Employee[];
}

export async function getEmployeeById(id: number) {
    // RLS policy automatically filters by user_id
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data as Employee;
}

export async function createEmployee(employee: Omit<Employee, 'id'>) {
    const userId = await getCurrentUserId();
    console.log('Creating employee with user_id:', userId);
    console.log('Employee data:', employee);
    
    const { data, error } = await supabase
        .from('employees')
        .insert({ ...employee, user_id: userId })
        .select()
        .single();

    if (error) {
        console.error('Supabase error creating employee:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        throw error;
    }
    
    console.log('Employee created successfully:', data);
    return data as Employee;
}

export async function updateEmployee(id: number, updates: Partial<Employee>) {
    // RLS policy ensures user can only update their own employees
    const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Employee;
}

export async function deleteEmployee(id: number) {
    // RLS policy ensures user can only delete their own employees
    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Task operations
export async function getTasks() {
    // RLS policy automatically filters by user_id
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Merge extended_data into task objects
    return (data as Task[]).map(task => {
        if (task.extended_data) {
            return { ...task, ...task.extended_data };
        }
        return task;
    });
}

export async function getTaskById(id: number) {
    // RLS policy automatically filters by user_id
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    
    // Merge extended_data into task object
    const task = data as Task;
    if (task.extended_data) {
        return { ...task, ...task.extended_data };
    }
    return task;
}

export async function getTasksByEmployee(employeeId: number) {
    // RLS policy automatically filters by user_id
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', employeeId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>) {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: userId })
        .select()
        .single();

    if (error) throw error;
    return data as Task;
}

export async function updateTask(id: number, updates: Partial<Task>) {
    // Separate core fields from extended fields
    const { comments, attachments, subtasks, depends_on, template_id, ...coreUpdates } = updates;
    
    // Prepare extended data as JSON
    const extendedData: any = {};
    if (comments !== undefined) extendedData.comments = comments;
    if (attachments !== undefined) extendedData.attachments = attachments;
    if (subtasks !== undefined) extendedData.subtasks = subtasks;
    if (depends_on !== undefined) extendedData.depends_on = depends_on;
    if (template_id !== undefined) extendedData.template_id = template_id;
    
    // Combine core updates with extended data
    const finalUpdates = {
        ...coreUpdates,
        ...(Object.keys(extendedData).length > 0 && { extended_data: extendedData })
    };
    
    const { data, error } = await supabase
        .from('tasks')
        .update(finalUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    
    // Merge extended data back into the task object
    const task = data as Task;
    if (task.extended_data) {
        Object.assign(task, task.extended_data);
    }
    
    return task;
}

export async function deleteTask(id: number) {
    // RLS policy ensures user can only delete their own tasks
    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

// Dashboard stats
export async function getDashboardStats() {
    // All queries automatically filtered by user_id via RLS
    const [employeesResult, tasksResult] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true })
    ]);

    const todoTasks = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'todo');

    const inProgressTasks = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in-progress');

    const completedTasks = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'done');

    return {
        totalEmployees: employeesResult.count || 0,
        totalTasks: tasksResult.count || 0,
        todoTasks: todoTasks.count || 0,
        inProgressTasks: inProgressTasks.count || 0,
        completedTasks: completedTasks.count || 0
    };
}

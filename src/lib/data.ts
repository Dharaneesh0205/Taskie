export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone: string;
  joined_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string;
  assigned_to: number;
  created_at?: string;
  parent_task_id?: number;
  depends_on?: number[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];

  template_id?: number;
  subtasks?: Subtask[];
  extended_data?: any;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: string;
  content: string;
  created_at: string;
  author_name: string;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  filename: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}



export interface TaskTemplate {
  id: number;
  name: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  estimated_hours?: number;
  created_by: string;
  created_at: string;
}

export interface Subtask {
  id: number;
  parent_task_id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export const initialEmployees: Employee[] = [
  {
    id: 1,
    first_name: "Priya",
    last_name: "Kumar",
    email: "priya@example.com",
    role: "Frontend Developer",
    phone: "+91-9999999999",
    joined_at: "2024-11-01T10:00:00Z"
  },
  {
    id: 2,
    first_name: "Arjun",
    last_name: "Das",
    email: "arjun@example.com",
    role: "Backend Developer",
    phone: "+91-8888888888",
    joined_at: "2023-08-15T09:30:00Z"
  },
  {
    id: 3,
    first_name: "Meera",
    last_name: "Singh",
    email: "meera@example.com",
    role: "UI/UX Designer",
    phone: "+91-7777777777",
    joined_at: "2024-01-20T08:00:00Z"
  },
  {
    id: 4,
    first_name: "Rahul",
    last_name: "Sharma",
    email: "rahul@example.com",
    role: "Product Manager",
    phone: "+91-6666666666",
    joined_at: "2023-05-10T09:00:00Z"
  },
  {
    id: 5,
    first_name: "Ananya",
    last_name: "Patel",
    email: "ananya@example.com",
    role: "QA Engineer",
    phone: "+91-5555555555",
    joined_at: "2024-03-15T10:30:00Z"
  }
];

export const initialTasks: Task[] = [
  {
    id: 10,
    title: "Implement login",
    description: "Create authentication flow with JWT tokens",
    status: "in-progress",
    priority: "high",
    due_date: "2025-11-20",
    assigned_to: 1,
    created_at: "2025-11-10T09:00:00Z"
  },
  {
    id: 11,
    title: "Build dashboard charts",
    description: "Add interactive charts for metrics visualization",
    status: "todo",
    priority: "medium",
    due_date: "2025-11-25",
    assigned_to: 2,
    created_at: "2025-11-11T10:00:00Z"
  },
  {
    id: 12,
    title: "Design employee profile page",
    description: "Create high-fidelity mockups for employee detail view",
    status: "done",
    priority: "high",
    due_date: "2025-11-18",
    assigned_to: 3,
    created_at: "2025-11-08T11:00:00Z"
  },
  {
    id: 13,
    title: "Review API documentation",
    description: "Update and review REST API documentation",
    status: "in-progress",
    priority: "medium",
    due_date: "2025-11-22",
    assigned_to: 4,
    created_at: "2025-11-12T14:00:00Z"
  },
  {
    id: 14,
    title: "Test mobile responsiveness",
    description: "Ensure all pages work correctly on mobile devices",
    status: "todo",
    priority: "high",
    due_date: "2025-11-21",
    assigned_to: 5,
    created_at: "2025-11-13T09:30:00Z"
  },
  {
    id: 15,
    title: "Setup CI/CD pipeline",
    description: "Configure automated deployment pipeline",
    status: "todo",
    priority: "low",
    due_date: "2025-11-28",
    assigned_to: 2,
    created_at: "2025-11-14T15:00:00Z"
  },
  {
    id: 16,
    title: "User testing session",
    description: "Conduct user testing with 5 participants",
    status: "done",
    priority: "medium",
    due_date: "2025-11-17",
    assigned_to: 3,
    created_at: "2025-11-07T10:00:00Z"
  },
  {
    id: 17,
    title: "Optimize database queries",
    description: "Improve query performance for large datasets",
    status: "in-progress",
    priority: "high",
    due_date: "2025-11-19",
    assigned_to: 2,
    created_at: "2025-11-09T13:00:00Z"
  }
];

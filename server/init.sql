CREATE TYPE priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE status AS ENUM ('todo', 'in-progress', 'done');

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    joined_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status status DEFAULT 'todo',
    priority priority DEFAULT 'low',
    due_date DATE,
    assigned_to INTEGER REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (id, first_name, last_name, email, role, phone, joined_at) VALUES
(1, 'Priya', 'Kumar', 'priya@example.com', 'Frontend Developer', '+91-9999999999', '2024-11-01T10:00:00Z'),
(2, 'Arjun', 'Das', 'arjun@example.com', 'Backend Developer', '+91-8888888888', '2023-08-15T09:30:00Z'),
(3, 'Meera', 'Singh', 'meera@example.com', 'UI/UX Designer', '+91-7777777777', '2024-01-20T08:00:00Z'),
(4, 'Rahul', 'Sharma', 'rahul@example.com', 'Product Manager', '+91-6666666666', '2023-05-10T09:00:00Z'),
(5, 'Ananya', 'Patel', 'ananya@example.com', 'QA Engineer', '+91-5555555555', '2024-03-15T10:30:00Z');

INSERT INTO tasks (id, title, description, status, priority, due_date, assigned_to, created_at) VALUES
(10, 'Implement login', 'Create authentication flow with JWT tokens', 'in-progress', 'high', '2025-11-20', 1, '2025-11-10T09:00:00Z'),
(11, 'Build dashboard charts', 'Add interactive charts for metrics visualization', 'todo', 'medium', '2025-11-25', 2, '2025-11-11T10:00:00Z'),
(12, 'Design employee profile page', 'Create high-fidelity mockups for employee detail view', 'done', 'high', '2025-11-18', 3, '2025-11-08T11:00:00Z'),
(13, 'Review API documentation', 'Update and review REST API documentation', 'in-progress', 'medium', '2025-11-22', 4, '2025-11-12T14:00:00Z'),
(14, 'Test mobile responsiveness', 'Ensure all pages work correctly on mobile devices', 'todo', 'high', '2025-11-21', 5, '2025-11-13T09:30:00Z'),
(15, 'Setup CI/CD pipeline', 'Configure automated deployment pipeline', 'todo', 'low', '2025-11-28', 2, '2025-11-14T15:00:00Z'),
(16, 'User testing session', 'Conduct user testing with 5 participants', 'done', 'medium', '2025-11-17', 3, '2025-11-07T10:00:00Z'),
(17, 'Optimize database queries', 'Improve query performance for large datasets', 'in-progress', 'high', '2025-11-19', 2, '2025-11-09T13:00:00Z');


-- ==========================================
-- INITIAL DATABASE SETUP WITH USER ISOLATION
-- ==========================================
-- For NEW Supabase projects - run this FIRST
-- If you already have data, use database.sql (migration script) instead

-- STEP 0: Clean up existing tables and types (if any)
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TYPE IF EXISTS status CASCADE;
DROP TYPE IF EXISTS priority CASCADE;

-- STEP 1: Create ENUM types
CREATE TYPE priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE status AS ENUM ('todo', 'in-progress', 'done');

-- STEP 2: Create employees table with user isolation
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Each user can have employees with same email
    UNIQUE(email, user_id)
);

-- STEP 3: Create tasks table with user isolation
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status status DEFAULT 'todo',
    priority priority DEFAULT 'low',
    due_date DATE,
    assigned_to INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    extended_data JSONB DEFAULT '{}'::jsonb
);

-- STEP 4: Create indexes for performance
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_extended_data ON tasks USING gin(extended_data);

-- STEP 5: Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create RLS policies for EMPLOYEES
-- EMPLOYEES POLICIES
CREATE POLICY "Users can read own employees"
ON employees FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own employees"
ON employees FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employees"
ON employees FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own employees"
ON employees FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- STEP 7: Create RLS policies for TASKS
-- TASKS POLICIES
CREATE POLICY "Users can read own tasks"
ON tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- STEP 8: Create auto-update timestamp trigger
-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- NOTE: Do NOT insert sample data with hard-coded user_id
-- Users will create their own data through the application
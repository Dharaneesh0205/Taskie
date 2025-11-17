-- ==========================================
-- CLEANUP AND MIGRATION SCRIPT
-- ==========================================
-- Run this to clean up and set up user isolation properly

-- Step 1: Delete old data (optional but recommended)
DELETE FROM tasks;
DELETE FROM employees;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can read own employees" ON employees;
DROP POLICY IF EXISTS "Users can insert own employees" ON employees;
DROP POLICY IF EXISTS "Users can update own employees" ON employees;
DROP POLICY IF EXISTS "Users can delete own employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to read employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to insert employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
DROP POLICY IF EXISTS "Allow authenticated users to delete employees" ON employees;

DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to read tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to insert tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to update tasks" ON tasks;
DROP POLICY IF EXISTS "Allow authenticated users to delete tasks" ON tasks;

-- Step 3: Add user_id columns if they don't exist
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Step 5: Create NEW user isolation policies
-- EMPLOYEES
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

-- TASKS
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

-- Step 6: Verify
SELECT 'Columns added:' as status;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('employees', 'tasks')
AND column_name = 'user_id';

SELECT 'Policies created:' as status;
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('employees', 'tasks')
ORDER BY tablename, policyname;

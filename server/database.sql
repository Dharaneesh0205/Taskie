-- ==========================================
-- CLEANUP AND MIGRATION SCRIPT - SIMPLIFIED
-- ==========================================
-- Run this to clean up and set up user isolation properly

-- Step 1: Drop ALL existing policies (safe to run multiple times)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on employees table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'employees'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON employees', pol.policyname);
    END LOOP;
    
    -- Drop all policies on tasks table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tasks'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON tasks', pol.policyname);
    END LOOP;
    
    RAISE NOTICE '✅ Step 1: All old policies dropped';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Step 1 Warning: %', SQLERRM;
END $$;

-- Step 2: Fix UNIQUE constraints
DO $$ 
BEGIN
    -- Drop unique constraint on employees.email if it exists
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'employees_email_key' 
        AND conrelid = 'employees'::regclass
    ) THEN
        ALTER TABLE employees DROP CONSTRAINT employees_email_key;
        RAISE NOTICE '✅ Step 2: Dropped old email unique constraint';
    ELSE
        RAISE NOTICE '✅ Step 2: No old constraint to drop (already fixed)';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 2 Error: %', SQLERRM;
END $$;

-- Step 3: Add user_id columns
DO $$
BEGIN
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE '✅ Step 3a: Added user_id to employees';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 3a Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE '✅ Step 3b: Added user_id to tasks';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 3b Error: %', SQLERRM;
END $$;

-- Step 4: Add new unique constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'employees_email_user_id_key'
    ) THEN
        ALTER TABLE employees ADD CONSTRAINT employees_email_user_id_key UNIQUE (email, user_id);
        RAISE NOTICE '✅ Step 4: Added new unique constraint (email, user_id)';
    ELSE
        RAISE NOTICE '✅ Step 4: Unique constraint already exists (skip)';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 4 Error: %', SQLERRM;
END $$;

-- Step 5: Create indexes
DO $$
BEGIN
    DROP INDEX IF EXISTS idx_employees_user_id;
    CREATE INDEX idx_employees_user_id ON employees(user_id);
    RAISE NOTICE '✅ Step 5a: Created index on employees.user_id';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 5a Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    DROP INDEX IF EXISTS idx_tasks_user_id;
    CREATE INDEX idx_tasks_user_id ON tasks(user_id);
    RAISE NOTICE '✅ Step 5b: Created index on tasks.user_id';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 5b Error: %', SQLERRM;
END $$;

-- Step 6: Enable RLS
DO $$
BEGIN
    ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ Step 6a: RLS enabled on employees';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Step 6a: %', SQLERRM;
END $$;

DO $$
BEGIN
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✅ Step 6b: RLS enabled on tasks';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Step 6b: %', SQLERRM;
END $$;

-- Step 7: Create RLS Policies for EMPLOYEES
DO $$
BEGIN
    CREATE POLICY "Users can read own employees"
    ON employees FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 7a: Created SELECT policy for employees';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 7a: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 7a Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can insert own employees"
    ON employees FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 7b: Created INSERT policy for employees';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 7b: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 7b Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can update own employees"
    ON employees FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 7c: Created UPDATE policy for employees';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 7c: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 7c Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can delete own employees"
    ON employees FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 7d: Created DELETE policy for employees';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 7d: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 7d Error: %', SQLERRM;
END $$;

-- Step 8: Create RLS Policies for TASKS
DO $$
BEGIN
    CREATE POLICY "Users can read own tasks"
    ON tasks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 8a: Created SELECT policy for tasks';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 8a: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 8a Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can insert own tasks"
    ON tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 8b: Created INSERT policy for tasks';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 8b: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 8b Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can update own tasks"
    ON tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 8c: Created UPDATE policy for tasks';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 8c: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 8c Error: %', SQLERRM;
END $$;

DO $$
BEGIN
    CREATE POLICY "Users can delete own tasks"
    ON tasks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
    RAISE NOTICE '✅ Step 8d: Created DELETE policy for tasks';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '✅ Step 8d: Policy already exists (skip)';
WHEN OTHERS THEN
    RAISE NOTICE '❌ Step 8d Error: %', SQLERRM;
END $$;

-- Step 10: Verify setup
SELECT '' as separator;
SELECT '=== VERIFICATION ===' as info;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('employees', 'tasks');

SELECT '' as separator;
SELECT 'Columns:' as check_name;
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('employees', 'tasks')
AND column_name = 'user_id'
ORDER BY table_name;

SELECT '' as separator;
SELECT 'Policies:' as check_name;
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename IN ('employees', 'tasks')
ORDER BY tablename, policyname;

-- ==========================================
-- TESTING SECTION
-- ==========================================
-- Run these tests after the migration to verify everything works

SELECT '' as separator;
SELECT '=== PRE-FLIGHT CHECKS ===' as info;

-- Check 0: Verify tables exist
SELECT '' as separator;
SELECT 'Check 0: Tables Exist' as test;
SELECT 
    table_name,
    CASE WHEN table_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') 
        THEN '✅ EXISTS' 
        ELSE '❌ MISSING' 
    END as status
FROM (VALUES ('employees'), ('tasks')) AS t(table_name);

-- Check constraints on employees table
SELECT '' as separator;
SELECT 'Check: Unique Constraints on Employees' as test;
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'employees'::regclass
AND contype = 'u';

SELECT '' as separator;
SELECT '=== TESTING SECTION ===' as info;

-- Test 1: Check if you're authenticated
SELECT '' as separator;
SELECT 'Test 1: Authentication Check' as test;
SELECT 
    CASE 
        WHEN auth.uid() IS NOT NULL THEN '✅ Authenticated as: ' || auth.uid()::text
        ELSE '❌ NOT AUTHENTICATED - You must be logged in to Supabase Dashboard'
    END as result;

-- Test 2: Try inserting a test employee
SELECT '' as separator;
SELECT 'Test 2: Insert Test Employee' as test;
DO $$ 
BEGIN
    IF auth.uid() IS NOT NULL THEN
        -- Try inserting a test employee
        INSERT INTO employees (first_name, last_name, email, role, phone, user_id)
        VALUES ('Test', 'Employee', 'test@example.com', 'Tester', '1234567890', auth.uid())
        ON CONFLICT (email, user_id) DO NOTHING;
        
        RAISE NOTICE '✅ Test employee inserted successfully!';
    ELSE
        RAISE NOTICE '❌ Cannot test - not authenticated. Log in to Supabase Dashboard first.';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Insert failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
    RAISE NOTICE 'Common causes:';
    RAISE NOTICE '  - UNIQUE constraint: Email already exists for this user';
    RAISE NOTICE '  - RLS policy: user_id does not match authenticated user';
    RAISE NOTICE '  - Missing column: Check if user_id column exists';
END $$;

-- Test 3: Check if you can read your own data
SELECT '' as separator;
SELECT 'Test 3: Read Your Data' as test;
SELECT 
    COUNT(*) as your_employee_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Can read own data - RLS working correctly!'
        ELSE '⚠️ No employees yet (empty for new user) or RLS may be blocking'
    END as result
FROM employees
WHERE user_id = auth.uid();

-- Test 4: List your employees
SELECT '' as separator;
SELECT 'Test 4: Your Employees' as test;
SELECT id, first_name, last_name, email, role
FROM employees
WHERE user_id = auth.uid()
LIMIT 5;

-- Clean up test data (uncomment if you want to remove test employee)
-- DELETE FROM employees WHERE email = 'test@example.com' AND user_id = auth.uid();

SELECT '' as separator;
SELECT '=== MIGRATION COMPLETE ===' as status;
SELECT 'If all tests passed with ✅, your database is ready!' as message;
SELECT 'If you see ❌, check the error messages above.' as tip;

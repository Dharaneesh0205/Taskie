# Database Setup Guide

## Quick Start

### For NEW Projects (Fresh Supabase Setup)
Run `init.sql` in Supabase SQL Editor
- Creates tables with user isolation from scratch
- Sets up Row Level Security (RLS)
- No sample data included

### For EXISTING Projects (Already Have Data)
Run `database.sql` in Supabase SQL Editor
- Migrates existing tables to include user isolation
- Adds `user_id` columns
- Updates RLS policies
- Includes testing section

## Why Your Database Wasn't Adding Records

**Root Cause**: Row Level Security (RLS) was enabled but records didn't have `user_id` values matching authenticated users.

**The Fix**: Run `database.sql` which:
1. ✅ Adds `user_id` columns to both tables
2. ✅ Creates proper RLS policies
3. ✅ Tests if everything works
4. ✅ Shows you what went wrong

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard
- Login at https://app.supabase.com
- Select your project: `gvljmvhzlvtxurlypasm`

### 2. Open SQL Editor
- Click "SQL Editor" in left sidebar
- Click "New Query"

### 3. Run Migration
- Copy entire contents of `database.sql`
- Paste into SQL Editor
- Click "Run" (accept the warning about destructive operations - it's safe)

### 4. Check Results
The script will show you:
- ✅ RLS status (should be ENABLED)
- ✅ Policy count (should be 4 per table)
- ✅ Column check (user_id should exist)
- ✅ Authentication test
- ✅ Insert test (creates test employee)
- ✅ Read test (verifies you can see your data)

### 5. Test in Your App
- Go to your app: https://taskie-xi.vercel.app
- Sign in
- Try creating an employee (like in the screenshot)
- Should work without errors now!

## Common Issues

### "Not authenticated" error in test
**Solution**: Make sure you're logged into Supabase Dashboard before running the script

### "Policy violation" when creating employee
**Solution**: Run `database.sql` again - policies might not be set correctly

### Can't see any data after migration
**Solution**: Old data doesn't have `user_id`. Either:
- Delete old data (uncomment lines in database.sql)
- Or add your user_id manually

### Still getting errors?
Check browser console (F12) for detailed error messages from Supabase.

## Files Explained

- `init.sql` - For brand new Supabase projects
- `database.sql` - For migrating existing projects (USE THIS ONE)
- `index.js` - Node.js server (not used with Supabase)

## Your API Code is Already Fixed

Your frontend (`src/lib/api.ts`) already correctly adds `user_id`:

```typescript
export async function createEmployee(employee: Omit<Employee, 'id'>) {
    const userId = await getCurrentUserId();  // ✅
    const { data, error } = await supabase
        .from('employees')
        .insert({ ...employee, user_id: userId })  // ✅
        .select()
        .single();
    // ...
}
```

The issue was only in the database setup, not your code!

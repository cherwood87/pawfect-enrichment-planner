-- Fix critical security vulnerability in Activities Library table
-- Current issue: Anyone can read and insert data without authentication

-- Drop the insecure policies that allow unrestricted access
DROP POLICY IF EXISTS "Allow insert to activities library" ON "Activities Library";
DROP POLICY IF EXISTS "Allow read access to activities library" ON "Activities Library";

-- Create secure RLS policies that require authentication

-- 1. Allow authenticated users to read the activities library
CREATE POLICY "Authenticated users can read activities library" 
ON "Activities Library" 
FOR SELECT 
TO authenticated
USING (true);

-- 2. Restrict insertions to service role only (for admin/system operations)
-- This prevents unauthorized content injection while allowing system operations
CREATE POLICY "Service role can insert activities" 
ON "Activities Library" 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 3. Optional: Allow authenticated users with admin role to insert
-- (Uncomment if you have an admin system in place)
-- CREATE POLICY "Admin users can insert activities" 
-- ON "Activities Library" 
-- FOR INSERT 
-- TO authenticated
-- WITH CHECK (
--   EXISTS (
--     SELECT 1 FROM user_roles 
--     WHERE user_id = auth.uid() AND role = 'admin'
--   )
-- );

-- Ensure RLS is enabled (it should already be, but this guarantees it)
ALTER TABLE "Activities Library" ENABLE ROW LEVEL SECURITY;
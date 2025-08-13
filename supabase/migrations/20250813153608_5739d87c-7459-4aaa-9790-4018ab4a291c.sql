-- Fix security issue: Restrict premium training content access to authenticated users only

-- Remove the problematic public access policy for curated activities
DROP POLICY IF EXISTS "Public can read curated approved activities" ON public.activities;

-- Create new policy restricting curated activities to authenticated users only
CREATE POLICY "Authenticated users can read curated approved activities" 
ON public.activities 
FOR SELECT 
TO authenticated
USING ((source = 'curated'::text) AND (approved = true));

-- Ensure discovered activities policy is also properly scoped to authenticated users
DROP POLICY IF EXISTS "Authenticated can read public discovered activities" ON public.activities;

CREATE POLICY "Authenticated users can read public discovered activities" 
ON public.activities 
FOR SELECT 
TO authenticated
USING ((source = 'discovered'::text) AND (approved = true) AND (is_public = true));
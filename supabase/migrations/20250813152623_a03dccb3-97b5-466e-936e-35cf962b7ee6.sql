-- Fix security issue: Restrict content_templates access to authenticated users only

-- Drop the existing public access policy
DROP POLICY IF EXISTS "Anyone can view content templates" ON public.content_templates;

-- Create new policy restricting access to authenticated users only
CREATE POLICY "Authenticated users can view content templates" 
ON public.content_templates 
FOR SELECT 
TO authenticated
USING (true);

-- Optional: Add policy for service role to manage templates
CREATE POLICY "Service role can manage content templates" 
ON public.content_templates 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);
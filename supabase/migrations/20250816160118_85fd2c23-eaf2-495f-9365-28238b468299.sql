-- Fix security vulnerability in subscribers table RLS policies
-- Remove the overly permissive service role policy and create proper restrictions

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;

-- Create a new, more restrictive service role policy that only allows specific operations
-- Service role should only be able to create/update subscriptions, not read all data
CREATE POLICY "Service role can create and update subscriptions" 
ON public.subscribers 
FOR INSERT 
TO service_role 
WITH CHECK (true);

CREATE POLICY "Service role can update subscriptions" 
ON public.subscribers 
FOR UPDATE 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Service role should NOT have SELECT access to prevent data exposure
-- Users can only view their own subscription data (existing policy is correct)
-- Users can only insert/update their own subscription data (existing policies are correct)

-- Add additional security: ensure email field is never exposed in unauthorized queries
-- Create a function to get subscription status without exposing email
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(p_user_id uuid)
RETURNS TABLE(
  subscribed boolean,
  subscription_tier text,
  subscription_status text,
  subscription_end timestamp with time zone
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
BEGIN
  -- Only allow users to check their own subscription status
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized access' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT 
    s.subscribed,
    s.subscription_tier,
    s.subscription_status,
    s.subscription_end
  FROM public.subscribers s
  WHERE s.user_id = p_user_id;
END;
$$;
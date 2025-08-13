-- Fix security warnings by setting proper search_path for functions

-- Update validate_subscription function with secure search_path
CREATE OR REPLACE FUNCTION public.validate_subscription(p_user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public', 'pg_catalog'
AS $$
BEGIN
  -- Check if user has active subscription
  RETURN EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = p_user_id 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$;

-- Update update_subscribers_updated_at function with secure search_path
CREATE OR REPLACE FUNCTION public.update_subscribers_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_catalog'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;
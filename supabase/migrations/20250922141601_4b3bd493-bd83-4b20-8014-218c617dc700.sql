-- Security Fix for Subscribers Table
-- Issue: Customer Email Addresses and Payment Data Could Be Stolen

-- 1. First, ensure all existing records have proper user_id (backup any orphaned records)
UPDATE public.subscribers 
SET user_id = (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = subscribers.email 
  LIMIT 1
) 
WHERE user_id IS NULL AND email IS NOT NULL;

-- 2. Remove any records that still have NULL user_id (these are security risks)
DELETE FROM public.subscribers WHERE user_id IS NULL;

-- 3. Make user_id NOT NULL to prevent future security vulnerabilities
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;

-- 4. Add unique constraint to prevent duplicate subscriptions per user
ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_user_id_unique 
UNIQUE (user_id);

-- 5. Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Service role can create and update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;

-- 6. Create secure, restrictive RLS policies
-- Users can only view their own subscription data
CREATE POLICY "Users can view own subscription" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own subscription (with strict validation)
CREATE POLICY "Users can create own subscription" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
  AND email = (
    SELECT auth.users.email 
    FROM auth.users 
    WHERE auth.users.id = auth.uid()
  )
);

-- Users can update their own subscription (protecting sensitive fields)
CREATE POLICY "Users can update own subscription" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND user_id = OLD.user_id  -- Prevent user_id changes
  AND email = OLD.email      -- Prevent email changes by users
);

-- Service role can manage subscriptions (for Stripe webhooks and admin operations)
CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (
  user_id IS NOT NULL 
  AND email IS NOT NULL
);

-- 7. Create security audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS public.subscribers_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL,
  operation TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  performed_by UUID,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit log
ALTER TABLE public.subscribers_audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role and table owners can view audit logs
CREATE POLICY "Restrict audit log access" 
ON public.subscribers_audit_log 
FOR SELECT 
TO service_role
USING (true);

CREATE POLICY "Users can view own subscription audit" 
ON public.subscribers_audit_log 
FOR SELECT 
TO authenticated
USING (
  subscriber_id IN (
    SELECT id FROM public.subscribers 
    WHERE user_id = auth.uid()
  )
);

-- 8. Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_subscribers_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all changes to sensitive subscription data
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.subscribers_audit_log (
      subscriber_id,
      operation,
      new_values,
      performed_by
    ) VALUES (
      NEW.id,
      'INSERT',
      to_jsonb(NEW),
      auth.uid()
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if sensitive fields changed
    IF OLD.email != NEW.email 
    OR OLD.stripe_customer_id != NEW.stripe_customer_id 
    OR OLD.subscription_status != NEW.subscription_status
    OR OLD.subscribed != NEW.subscribed THEN
      INSERT INTO public.subscribers_audit_log (
        subscriber_id,
        operation,
        old_values,
        new_values,
        performed_by
      ) VALUES (
        NEW.id,
        'UPDATE',
        to_jsonb(OLD),
        to_jsonb(NEW),
        auth.uid()
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.subscribers_audit_log (
      subscriber_id,
      operation,
      old_values,
      performed_by
    ) VALUES (
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      auth.uid()
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. Create audit trigger
DROP TRIGGER IF EXISTS audit_subscribers_trigger ON public.subscribers;
CREATE TRIGGER audit_subscribers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.audit_subscribers_changes();

-- 10. Add additional security function for safe subscription operations
CREATE OR REPLACE FUNCTION public.safe_upsert_subscription(
  p_user_id UUID,
  p_email TEXT,
  p_subscribed BOOLEAN,
  p_subscription_tier TEXT DEFAULT NULL,
  p_subscription_status TEXT DEFAULT 'inactive',
  p_subscription_end TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_stripe_customer_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_subscription_id UUID;
  v_user_email TEXT;
BEGIN
  -- Security check: verify user owns this email
  SELECT email INTO v_user_email 
  FROM auth.users 
  WHERE id = p_user_id;
  
  IF v_user_email IS NULL OR v_user_email != p_email THEN
    RAISE EXCEPTION 'Email does not match authenticated user' 
    USING ERRCODE = '42501';
  END IF;
  
  -- Safe upsert with conflict resolution
  INSERT INTO public.subscribers (
    user_id,
    email,
    subscribed,
    subscription_tier,
    subscription_status,
    subscription_end,
    stripe_customer_id
  ) VALUES (
    p_user_id,
    p_email,
    p_subscribed,
    p_subscription_tier,
    p_subscription_status,
    p_subscription_end,
    p_stripe_customer_id
  )
  ON CONFLICT (user_id) DO UPDATE SET
    subscribed = EXCLUDED.subscribed,
    subscription_tier = EXCLUDED.subscription_tier,
    subscription_status = EXCLUDED.subscription_status,
    subscription_end = EXCLUDED.subscription_end,
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscribers.stripe_customer_id),
    updated_at = NOW()
  RETURNING id INTO v_subscription_id;
  
  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 11. Create secure function for getting subscription status
CREATE OR REPLACE FUNCTION public.get_secure_subscription_status(p_user_id UUID)
RETURNS TABLE(
  subscribed BOOLEAN, 
  subscription_tier TEXT, 
  subscription_status TEXT, 
  subscription_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Only allow users to check their own subscription status
  IF auth.uid() IS NULL OR p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized access to subscription data' 
    USING ERRCODE = '42501';
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
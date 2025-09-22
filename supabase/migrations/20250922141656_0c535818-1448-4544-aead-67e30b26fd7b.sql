-- Security Fix for Subscribers Table (Corrected)
-- Issue: Customer Email Addresses and Payment Data Could Be Stolen

-- 1. Handle existing duplicates by keeping the most recent record
WITH duplicate_user_ids AS (
  SELECT user_id, array_agg(id ORDER BY created_at DESC) as subscription_ids
  FROM public.subscribers 
  WHERE user_id IS NOT NULL
  GROUP BY user_id 
  HAVING COUNT(*) > 1
)
DELETE FROM public.subscribers 
WHERE id IN (
  SELECT unnest(subscription_ids[2:]) 
  FROM duplicate_user_ids
);

-- 2. Update records with NULL user_id to match with auth.users by email
UPDATE public.subscribers 
SET user_id = (
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = subscribers.email 
  LIMIT 1
) 
WHERE user_id IS NULL AND email IN (
  SELECT email FROM auth.users
);

-- 3. Remove any orphaned records (those with NULL user_id that can't be matched)
DELETE FROM public.subscribers WHERE user_id IS NULL;

-- 4. Make user_id NOT NULL to prevent future security vulnerabilities
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;

-- 5. Add unique constraint to prevent duplicate subscriptions per user
ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_user_id_unique 
UNIQUE (user_id);

-- 6. Drop existing RLS policies that are overly permissive
DROP POLICY IF EXISTS "Service role can create and update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;

-- 7. Create secure, restrictive RLS policies
-- Users can only view their own subscription data
CREATE POLICY "secure_subscribers_select" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own subscription (with validation)
CREATE POLICY "secure_subscribers_insert" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- Users can update their own subscription (restricted fields)
CREATE POLICY "secure_subscribers_update" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks and admin operations)
CREATE POLICY "service_role_subscribers_all" 
ON public.subscribers 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (user_id IS NOT NULL AND email IS NOT NULL);

-- 8. Create audit logging table for subscription changes
CREATE TABLE IF NOT EXISTS public.subscribers_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  performed_by UUID,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_info JSONB DEFAULT '{}'::JSONB
);

-- Enable RLS on audit log
ALTER TABLE public.subscribers_audit_log ENABLE ROW LEVEL SECURITY;

-- Secure audit log policies
CREATE POLICY "audit_log_service_access" 
ON public.subscribers_audit_log 
FOR ALL 
TO service_role
USING (true);

CREATE POLICY "audit_log_user_view_own" 
ON public.subscribers_audit_log 
FOR SELECT 
TO authenticated
USING (
  performed_by = auth.uid() 
  OR subscriber_id IN (
    SELECT id FROM public.subscribers 
    WHERE user_id = auth.uid()
  )
);

-- 9. Create secure audit function
CREATE OR REPLACE FUNCTION public.audit_subscription_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.subscribers_audit_log (
      subscriber_id,
      operation,
      new_values,
      performed_by,
      session_info
    ) VALUES (
      NEW.id,
      'INSERT',
      to_jsonb(NEW),
      auth.uid(),
      jsonb_build_object(
        'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
        'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for'
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log sensitive field changes
    IF (NEW.email != OLD.email OR 
        NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id OR
        NEW.subscription_status != OLD.subscription_status OR
        NEW.subscribed != OLD.subscribed OR
        NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier OR
        NEW.subscription_end IS DISTINCT FROM OLD.subscription_end) THEN
      INSERT INTO public.subscribers_audit_log (
        subscriber_id,
        operation,
        old_values,
        new_values,
        performed_by,
        session_info
      ) VALUES (
        NEW.id,
        'UPDATE',
        jsonb_build_object(
          'email', OLD.email,
          'stripe_customer_id', OLD.stripe_customer_id,
          'subscription_status', OLD.subscription_status,
          'subscribed', OLD.subscribed,
          'subscription_tier', OLD.subscription_tier,
          'subscription_end', OLD.subscription_end
        ),
        jsonb_build_object(
          'email', NEW.email,
          'stripe_customer_id', NEW.stripe_customer_id,
          'subscription_status', NEW.subscription_status,
          'subscribed', NEW.subscribed,
          'subscription_tier', NEW.subscription_tier,
          'subscription_end', NEW.subscription_end
        ),
        auth.uid(),
        jsonb_build_object(
          'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
          'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for'
        )
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.subscribers_audit_log (
      subscriber_id,
      operation,
      old_values,
      performed_by,
      session_info
    ) VALUES (
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      auth.uid(),
      jsonb_build_object(
        'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
        'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for'
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 10. Create audit trigger
DROP TRIGGER IF EXISTS secure_subscribers_audit_trigger ON public.subscribers;
CREATE TRIGGER secure_subscribers_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.audit_subscription_changes();

-- 11. Replace the old unsafe subscription function with secure version
DROP FUNCTION IF EXISTS public.safe_upsert_subscription;
CREATE OR REPLACE FUNCTION public.secure_subscription_upsert(
  p_user_id UUID,
  p_email TEXT,
  p_subscribed BOOLEAN,
  p_subscription_tier TEXT DEFAULT NULL,
  p_subscription_status TEXT DEFAULT 'inactive',
  p_subscription_end TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_stripe_customer_id TEXT DEFAULT NULL
) RETURNS UUID 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  v_subscription_id UUID;
  v_authenticated_user_id UUID;
  v_user_email TEXT;
BEGIN
  -- Get authenticated user
  v_authenticated_user_id := auth.uid();
  
  -- Security checks
  IF v_authenticated_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;
  
  -- Only allow users to manage their own subscriptions or service role
  IF v_authenticated_user_id != p_user_id AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: can only manage own subscription' USING ERRCODE = '42501';
  END IF;
  
  -- Verify email matches user (additional security layer)
  SELECT email INTO v_user_email 
  FROM auth.users 
  WHERE id = p_user_id;
  
  IF v_user_email IS NULL THEN
    RAISE EXCEPTION 'Invalid user ID' USING ERRCODE = '22023';
  END IF;
  
  IF v_user_email != p_email THEN
    RAISE EXCEPTION 'Email mismatch with authenticated user' USING ERRCODE = '42501';
  END IF;
  
  -- Secure upsert operation
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
$$ LANGUAGE plpgsql;
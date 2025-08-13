-- Create subscribers table for proper subscription management
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage all subscriptions for stripe webhooks
CREATE POLICY "Service role can manage subscriptions" ON public.subscribers
FOR ALL USING (true);

-- Restrict content_templates table access to service role only
DROP POLICY IF EXISTS "Authenticated users can view content templates" ON public.content_templates;
DROP POLICY IF EXISTS "Service role can manage content templates" ON public.content_templates;

CREATE POLICY "Only service role can access content templates" ON public.content_templates
FOR ALL USING (auth.role() = 'service_role');

-- Add function for subscription validation
CREATE OR REPLACE FUNCTION public.validate_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has active subscription
  RETURN EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = p_user_id 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger for subscribers
CREATE OR REPLACE FUNCTION public.update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_subscribers_updated_at();
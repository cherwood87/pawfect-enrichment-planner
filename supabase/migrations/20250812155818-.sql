-- Create the missing scheduled_activity_audit_log table
CREATE TABLE public.scheduled_activity_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_activity_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scheduled_activity_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit log access
CREATE POLICY "Users can view audit logs for their dogs activities" 
ON public.scheduled_activity_audit_log 
FOR SELECT 
USING (
  scheduled_activity_id IN (
    SELECT sa.id 
    FROM scheduled_activities sa 
    WHERE user_owns_dog(sa.dog_id)
  )
);

-- Only system can insert audit logs (triggers handle this)
CREATE POLICY "System can insert audit logs" 
ON public.scheduled_activity_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Add index for performance
CREATE INDEX idx_scheduled_activity_audit_log_activity_id 
ON public.scheduled_activity_audit_log(scheduled_activity_id);

CREATE INDEX idx_scheduled_activity_audit_log_created_at 
ON public.scheduled_activity_audit_log(created_at DESC);
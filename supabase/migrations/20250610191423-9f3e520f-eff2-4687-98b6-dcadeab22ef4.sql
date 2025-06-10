
-- Phase 1: Database Schema Update for scheduled_activities table

-- First, let's add an index on the constraint columns for better performance
CREATE INDEX IF NOT EXISTS idx_scheduled_activities_unique_constraint 
ON scheduled_activities (dog_id, activity_id, scheduled_date);

-- Add a status column to track activity states more granularly
ALTER TABLE scheduled_activities 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'scheduled' 
CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled'));

-- Add a source column to track how the activity was created
ALTER TABLE scheduled_activities 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual' 
CHECK (source IN ('manual', 'migration', 'bulk_import', 'api'));

-- Add better constraint handling with a more descriptive name
ALTER TABLE scheduled_activities 
DROP CONSTRAINT IF EXISTS unique_dog_activity_date;

-- Recreate the constraint with a more descriptive name and include status
ALTER TABLE scheduled_activities 
ADD CONSTRAINT scheduled_activities_unique_active_entry 
UNIQUE (dog_id, activity_id, scheduled_date, status);

-- Add a function to safely upsert scheduled activities
CREATE OR REPLACE FUNCTION public.safe_upsert_scheduled_activity(
  p_dog_id UUID,
  p_activity_id TEXT,
  p_scheduled_date DATE,
  p_week_number INTEGER DEFAULT NULL,
  p_day_of_week INTEGER DEFAULT NULL,
  p_notes TEXT DEFAULT '',
  p_completion_notes TEXT DEFAULT '',
  p_reminder_enabled BOOLEAN DEFAULT false,
  p_source TEXT DEFAULT 'manual'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  existing_id UUID;
  new_id UUID;
BEGIN
  -- Check if an active entry already exists
  SELECT id INTO existing_id
  FROM scheduled_activities
  WHERE dog_id = p_dog_id
    AND activity_id = p_activity_id
    AND scheduled_date = p_scheduled_date
    AND status = 'scheduled'
  LIMIT 1;

  -- If exists, update it
  IF existing_id IS NOT NULL THEN
    UPDATE scheduled_activities
    SET 
      week_number = COALESCE(p_week_number, week_number),
      day_of_week = COALESCE(p_day_of_week, day_of_week),
      notes = COALESCE(NULLIF(p_notes, ''), notes),
      completion_notes = COALESCE(NULLIF(p_completion_notes, ''), completion_notes),
      reminder_enabled = p_reminder_enabled,
      source = p_source,
      updated_at = now()
    WHERE id = existing_id;
    
    RETURN existing_id;
  ELSE
    -- Insert new record
    INSERT INTO scheduled_activities (
      dog_id,
      activity_id,
      scheduled_date,
      week_number,
      day_of_week,
      notes,
      completion_notes,
      reminder_enabled,
      source,
      status,
      completed
    ) VALUES (
      p_dog_id,
      p_activity_id,
      p_scheduled_date,
      p_week_number,
      p_day_of_week,
      COALESCE(p_notes, ''),
      COALESCE(p_completion_notes, ''),
      p_reminder_enabled,
      p_source,
      'scheduled',
      false
    )
    RETURNING id INTO new_id;
    
    RETURN new_id;
  END IF;
END;
$$;

-- Add a function to handle duplicate resolution during migration
CREATE OR REPLACE FUNCTION public.resolve_scheduled_activity_duplicates()
RETURNS TABLE (
  resolved_count INTEGER,
  details JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
  duplicate_groups RECORD;
  resolved_count INTEGER := 0;
  resolution_details JSONB := '[]'::JSONB;
BEGIN
  -- Find and resolve duplicate groups
  FOR duplicate_groups IN
    SELECT 
      dog_id,
      activity_id,
      scheduled_date,
      array_agg(id ORDER BY created_at DESC) as ids,
      count(*) as duplicate_count
    FROM scheduled_activities
    WHERE status = 'scheduled'
    GROUP BY dog_id, activity_id, scheduled_date
    HAVING count(*) > 1
  LOOP
    -- Keep the most recent record, mark others as cancelled
    UPDATE scheduled_activities
    SET 
      status = 'cancelled',
      notes = CASE 
        WHEN notes = '' THEN 'Cancelled due to duplicate resolution'
        ELSE notes || ' (Cancelled due to duplicate resolution)'
      END,
      updated_at = now()
    WHERE id = ANY(duplicate_groups.ids[2:array_length(duplicate_groups.ids, 1)]);
    
    resolved_count := resolved_count + (duplicate_groups.duplicate_count - 1);
    
    resolution_details := resolution_details || jsonb_build_object(
      'dog_id', duplicate_groups.dog_id,
      'activity_id', duplicate_groups.activity_id,
      'scheduled_date', duplicate_groups.scheduled_date,
      'duplicates_resolved', duplicate_groups.duplicate_count - 1,
      'kept_id', duplicate_groups.ids[1]
    );
  END LOOP;
  
  RETURN QUERY SELECT resolved_count, resolution_details;
END;
$$;

-- Add better logging for scheduled activity operations
CREATE TABLE IF NOT EXISTS scheduled_activity_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scheduled_activity_id UUID REFERENCES scheduled_activities(id) ON DELETE CASCADE,
  operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete', 'duplicate_resolved')),
  old_values JSONB,
  new_values JSONB,
  performed_by TEXT DEFAULT 'system',
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT DEFAULT ''
);

-- Create an audit trigger for scheduled_activities
CREATE OR REPLACE FUNCTION public.audit_scheduled_activities()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO scheduled_activity_audit_log (
      scheduled_activity_id,
      operation,
      new_values,
      notes
    ) VALUES (
      NEW.id,
      'insert',
      to_jsonb(NEW),
      'Activity scheduled'
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO scheduled_activity_audit_log (
      scheduled_activity_id,
      operation,
      old_values,
      new_values,
      notes
    ) VALUES (
      NEW.id,
      'update',
      to_jsonb(OLD),
      to_jsonb(NEW),
      'Activity updated'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO scheduled_activity_audit_log (
      scheduled_activity_id,
      operation,
      old_values,
      notes
    ) VALUES (
      OLD.id,
      'delete',
      to_jsonb(OLD),
      'Activity deleted'
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create the audit trigger
DROP TRIGGER IF EXISTS tr_audit_scheduled_activities ON scheduled_activities;
CREATE TRIGGER tr_audit_scheduled_activities
  AFTER INSERT OR UPDATE OR DELETE ON scheduled_activities
  FOR EACH ROW EXECUTE FUNCTION audit_scheduled_activities();

-- Run the duplicate resolution function immediately
SELECT * FROM public.resolve_scheduled_activity_duplicates();

-- Harden activities public read policy and secure function + storage

-- 1) Tighten public read access on activities
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'activities' 
      AND policyname = 'Allow public read access to approved activities'
  ) THEN
    EXECUTE 'DROP POLICY "Allow public read access to approved activities" ON public.activities';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'activities' 
      AND policyname = 'Anyone can read curated activities'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can read curated activities" ON public.activities';
  END IF;
END $$;

CREATE POLICY "Public can read curated approved activities"
ON public.activities
FOR SELECT
USING (source = 'curated' AND approved = true);

-- 2) Secure get_kajabi_settings to prevent cross-user access
DO $$ BEGIN
  -- Revoke any existing broad execute privileges
  BEGIN
    REVOKE ALL ON FUNCTION public.get_kajabi_settings(uuid) FROM PUBLIC, anon, authenticated;
  EXCEPTION WHEN undefined_function THEN
    -- Function will be (re)created below if it didn't exist
    NULL;
  END;
END $$;

CREATE OR REPLACE FUNCTION public.get_kajabi_settings(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public','pg_catalog'
AS $function$
BEGIN
  IF auth.uid() IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  RETURN (
    SELECT setting_data 
    FROM public.user_settings 
    WHERE user_id = p_user_id AND setting_type = 'kajabi_credentials'
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_kajabi_settings(uuid) TO authenticated;

-- 3) Make knowledge-base-files bucket private and add strict RLS
UPDATE storage.buckets SET public = false WHERE id = 'knowledge-base-files';

-- Read own objects
CREATE POLICY "KB files - users can read own objects"
ON storage.objects
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  bucket_id = 'knowledge-base-files'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.knowledge_base_files kbf
      WHERE kbf.storage_path = name AND kbf.user_id = auth.uid()
    )
  )
);

-- Upload to own folder (prefix = auth.uid())
CREATE POLICY "KB files - users can upload to their folder"
ON storage.objects
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'knowledge-base-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update own objects
CREATE POLICY "KB files - users can update own objects"
ON storage.objects
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'knowledge-base-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'knowledge-base-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Delete own objects
CREATE POLICY "KB files - users can delete own objects"
ON storage.objects
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  bucket_id = 'knowledge-base-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4) Drop confusing catch-all restrictive policies on key tables
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='scheduled_activities' AND policyname='Allow all operations on scheduled_activities'
  ) THEN
    EXECUTE 'DROP POLICY "Allow all operations on scheduled_activities" ON public.scheduled_activities';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='activity_completions' AND policyname='Allow all operations on activity_completions'
  ) THEN
    EXECUTE 'DROP POLICY "Allow all operations on activity_completions" ON public.activity_completions';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='discovered_activities' AND policyname='Allow all operations on discovered_activities'
  ) THEN
    EXECUTE 'DROP POLICY "Allow all operations on discovered_activities" ON public.discovered_activities';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='journal_entries' AND policyname='Allow all operations on journal entries'
  ) THEN
    EXECUTE 'DROP POLICY "Allow all operations on journal entries" ON public.journal_entries';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_activities' AND policyname='Allow all operations on user_activities'
  ) THEN
    EXECUTE 'DROP POLICY "Allow all operations on user_activities" ON public.user_activities';
  END IF;
END $$;
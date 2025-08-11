-- Secure dogs table: remove overly permissive policy and ensure RLS is enabled
DO $$ BEGIN
  -- Enable RLS (safe if already enabled)
  EXECUTE 'ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY';
EXCEPTION WHEN others THEN NULL; END $$;

-- Drop the insecure catch-all policy if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'dogs' AND policyname = 'Allow all operations on dogs'
  ) THEN
    EXECUTE 'DROP POLICY "Allow all operations on dogs" ON public.dogs';
  END IF;
END $$;

-- Note: Specific owner-scoped policies already exist and remain intact:
--   - Users can create their own dogs (INSERT with check auth.uid() = user_id)
--   - Users can update their own dogs (USING auth.uid() = user_id)
--   - Users can delete their own dogs (USING auth.uid() = user_id)
--   - Users can view their own dogs (USING auth.uid() = user_id)

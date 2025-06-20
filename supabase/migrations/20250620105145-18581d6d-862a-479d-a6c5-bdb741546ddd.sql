
-- Phase 2: Create only truly missing RLS policies with proper existence checks

-- Helper functions (create if they don't exist)
CREATE OR REPLACE FUNCTION public.user_owns_dog(dog_uuid uuid)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.dogs 
    WHERE id = dog_uuid AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_owns_dog_by_text_id(dog_text_id text)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.dogs 
    WHERE id::text = dog_text_id AND user_id = auth.uid()
  );
$$;

-- Enable RLS and create policies only where they don't exist
DO $$
DECLARE
    table_exists boolean;
    policy_exists boolean;
BEGIN
  -- Scheduled Activities
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scheduled_activities') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.scheduled_activities ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_activities' AND policyname = 'Users can view scheduled activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view scheduled activities for their dogs" ON public.scheduled_activities FOR SELECT USING (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_activities' AND policyname = 'Users can create scheduled activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can create scheduled activities for their dogs" ON public.scheduled_activities FOR INSERT WITH CHECK (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_activities' AND policyname = 'Users can update scheduled activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can update scheduled activities for their dogs" ON public.scheduled_activities FOR UPDATE USING (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scheduled_activities' AND policyname = 'Users can delete scheduled activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can delete scheduled activities for their dogs" ON public.scheduled_activities FOR DELETE USING (public.user_owns_dog(dog_id));
    END IF;
  END IF;

  -- User Activities
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_activities') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activities' AND policyname = 'Users can view activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view activities for their dogs" ON public.user_activities FOR SELECT USING (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activities' AND policyname = 'Users can create activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can create activities for their dogs" ON public.user_activities FOR INSERT WITH CHECK (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activities' AND policyname = 'Users can update activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can update activities for their dogs" ON public.user_activities FOR UPDATE USING (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activities' AND policyname = 'Users can delete activities for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can delete activities for their dogs" ON public.user_activities FOR DELETE USING (public.user_owns_dog(dog_id));
    END IF;
  END IF;

  -- Favourites
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favourites') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favourites' AND policyname = 'Users can view their own favourites') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view their own favourites" ON public.favourites FOR SELECT USING (auth.uid() = user_id);
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favourites' AND policyname = 'Users can create their own favourites') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can create their own favourites" ON public.favourites FOR INSERT WITH CHECK (auth.uid() = user_id AND public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favourites' AND policyname = 'Users can update their own favourites') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can update their own favourites" ON public.favourites FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'favourites' AND policyname = 'Users can delete their own favourites') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can delete their own favourites" ON public.favourites FOR DELETE USING (auth.uid() = user_id);
    END IF;
  END IF;

  -- Journal Entries
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journal_entries') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can view journal entries for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view journal entries for their dogs" ON public.journal_entries FOR SELECT USING (public.user_owns_dog_by_text_id(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can create journal entries for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can create journal entries for their dogs" ON public.journal_entries FOR INSERT WITH CHECK (public.user_owns_dog_by_text_id(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can update journal entries for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can update journal entries for their dogs" ON public.journal_entries FOR UPDATE USING (public.user_owns_dog_by_text_id(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can delete journal entries for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can delete journal entries for their dogs" ON public.journal_entries FOR DELETE USING (public.user_owns_dog_by_text_id(dog_id));
    END IF;
  END IF;

  -- Activity Completions
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_completions') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.activity_completions ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_completions' AND policyname = 'Users can view completions for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view completions for their dogs" ON public.activity_completions FOR SELECT USING (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_completions' AND policyname = 'Users can create completions for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can create completions for their dogs" ON public.activity_completions FOR INSERT WITH CHECK (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_completions' AND policyname = 'Users can update completions for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can update completions for their dogs" ON public.activity_completions FOR UPDATE USING (public.user_owns_dog(dog_id));
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_completions' AND policyname = 'Users can delete completions for their dogs') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can delete completions for their dogs" ON public.activity_completions FOR DELETE USING (public.user_owns_dog(dog_id));
    END IF;
  END IF;

  -- Skip activity_feedback table since policies already exist and are causing conflicts

  -- User Interactions
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_interactions') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_interactions' AND policyname = 'Users can view their own interactions') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view their own interactions" ON public.user_interactions FOR SELECT USING (auth.uid() = user_id);
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_interactions' AND policyname = 'Users can create their own interactions') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can create their own interactions" ON public.user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
  END IF;

  -- User Preferences
  SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_preferences') INTO table_exists;
  IF table_exists THEN
    ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
    
    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Users can view their own preferences') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
    END IF;

    SELECT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Users can manage their own preferences') INTO policy_exists;
    IF NOT policy_exists THEN
      CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
    END IF;
  END IF;

  -- Continue with other tables that don't have existing policy conflicts...
  -- (Adding only the ones that are likely to be missing)

END $$;

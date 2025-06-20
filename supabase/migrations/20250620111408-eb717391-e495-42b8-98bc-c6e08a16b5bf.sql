
-- Phase 1: Create comprehensive RLS policies for all tables

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

-- Enable RLS on all tables that need it
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovered_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kajabi_courses ENABLE ROW LEVEL SECURITY;

-- Dogs table policies
DROP POLICY IF EXISTS "Users can view their own dogs" ON public.dogs;
DROP POLICY IF EXISTS "Users can create their own dogs" ON public.dogs;
DROP POLICY IF EXISTS "Users can update their own dogs" ON public.dogs;
DROP POLICY IF EXISTS "Users can delete their own dogs" ON public.dogs;

CREATE POLICY "Users can view their own dogs" ON public.dogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own dogs" ON public.dogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dogs" ON public.dogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dogs" ON public.dogs FOR DELETE USING (auth.uid() = user_id);

-- Scheduled Activities policies
DROP POLICY IF EXISTS "Users can view scheduled activities for their dogs" ON public.scheduled_activities;
DROP POLICY IF EXISTS "Users can create scheduled activities for their dogs" ON public.scheduled_activities;
DROP POLICY IF EXISTS "Users can update scheduled activities for their dogs" ON public.scheduled_activities;
DROP POLICY IF EXISTS "Users can delete scheduled activities for their dogs" ON public.scheduled_activities;

CREATE POLICY "Users can view scheduled activities for their dogs" ON public.scheduled_activities FOR SELECT USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can create scheduled activities for their dogs" ON public.scheduled_activities FOR INSERT WITH CHECK (public.user_owns_dog(dog_id));
CREATE POLICY "Users can update scheduled activities for their dogs" ON public.scheduled_activities FOR UPDATE USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can delete scheduled activities for their dogs" ON public.scheduled_activities FOR DELETE USING (public.user_owns_dog(dog_id));

-- User Activities policies
DROP POLICY IF EXISTS "Users can view activities for their dogs" ON public.user_activities;
DROP POLICY IF EXISTS "Users can create activities for their dogs" ON public.user_activities;
DROP POLICY IF EXISTS "Users can update activities for their dogs" ON public.user_activities;
DROP POLICY IF EXISTS "Users can delete activities for their dogs" ON public.user_activities;

CREATE POLICY "Users can view activities for their dogs" ON public.user_activities FOR SELECT USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can create activities for their dogs" ON public.user_activities FOR INSERT WITH CHECK (public.user_owns_dog(dog_id));
CREATE POLICY "Users can update activities for their dogs" ON public.user_activities FOR UPDATE USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can delete activities for their dogs" ON public.user_activities FOR DELETE USING (public.user_owns_dog(dog_id));

-- Favourites policies
DROP POLICY IF EXISTS "Users can view their own favourites" ON public.favourites;
DROP POLICY IF EXISTS "Users can create their own favourites" ON public.favourites;
DROP POLICY IF EXISTS "Users can update their own favourites" ON public.favourites;
DROP POLICY IF EXISTS "Users can delete their own favourites" ON public.favourites;

CREATE POLICY "Users can view their own favourites" ON public.favourites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own favourites" ON public.favourites FOR INSERT WITH CHECK (auth.uid() = user_id AND public.user_owns_dog(dog_id));
CREATE POLICY "Users can update their own favourites" ON public.favourites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own favourites" ON public.favourites FOR DELETE USING (auth.uid() = user_id);

-- Journal Entries policies
DROP POLICY IF EXISTS "Users can view journal entries for their dogs" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can create journal entries for their dogs" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can update journal entries for their dogs" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can delete journal entries for their dogs" ON public.journal_entries;

CREATE POLICY "Users can view journal entries for their dogs" ON public.journal_entries FOR SELECT USING (public.user_owns_dog_by_text_id(dog_id));
CREATE POLICY "Users can create journal entries for their dogs" ON public.journal_entries FOR INSERT WITH CHECK (public.user_owns_dog_by_text_id(dog_id));
CREATE POLICY "Users can update journal entries for their dogs" ON public.journal_entries FOR UPDATE USING (public.user_owns_dog_by_text_id(dog_id));
CREATE POLICY "Users can delete journal entries for their dogs" ON public.journal_entries FOR DELETE USING (public.user_owns_dog_by_text_id(dog_id));

-- Activity Completions policies
DROP POLICY IF EXISTS "Users can view completions for their dogs" ON public.activity_completions;
DROP POLICY IF EXISTS "Users can create completions for their dogs" ON public.activity_completions;
DROP POLICY IF EXISTS "Users can update completions for their dogs" ON public.activity_completions;
DROP POLICY IF EXISTS "Users can delete completions for their dogs" ON public.activity_completions;

CREATE POLICY "Users can view completions for their dogs" ON public.activity_completions FOR SELECT USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can create completions for their dogs" ON public.activity_completions FOR INSERT WITH CHECK (public.user_owns_dog(dog_id));
CREATE POLICY "Users can update completions for their dogs" ON public.activity_completions FOR UPDATE USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can delete completions for their dogs" ON public.activity_completions FOR DELETE USING (public.user_owns_dog(dog_id));

-- Activity Feedback policies
DROP POLICY IF EXISTS "Users can view feedback for their dogs" ON public.activity_feedback;
DROP POLICY IF EXISTS "Users can create feedback for their dogs" ON public.activity_feedback;
DROP POLICY IF EXISTS "Users can update feedback for their dogs" ON public.activity_feedback;
DROP POLICY IF EXISTS "Users can delete feedback for their dogs" ON public.activity_feedback;

CREATE POLICY "Users can view feedback for their dogs" ON public.activity_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create feedback for their dogs" ON public.activity_feedback FOR INSERT WITH CHECK (auth.uid() = user_id AND (dog_id IS NULL OR public.user_owns_dog(dog_id)));
CREATE POLICY "Users can update feedback for their dogs" ON public.activity_feedback FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete feedback for their dogs" ON public.activity_feedback FOR DELETE USING (auth.uid() = user_id);

-- User Interactions policies
DROP POLICY IF EXISTS "Users can view their own interactions" ON public.user_interactions;
DROP POLICY IF EXISTS "Users can create their own interactions" ON public.user_interactions;

CREATE POLICY "Users can view their own interactions" ON public.user_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own interactions" ON public.user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;

CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- User Settings policies
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;

CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Discovery Configs policies
DROP POLICY IF EXISTS "Users can view discovery configs for their dogs" ON public.discovery_configs;
DROP POLICY IF EXISTS "Users can manage discovery configs for their dogs" ON public.discovery_configs;

CREATE POLICY "Users can view discovery configs for their dogs" ON public.discovery_configs FOR SELECT USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can manage discovery configs for their dogs" ON public.discovery_configs FOR ALL USING (public.user_owns_dog(dog_id));

-- Discovered Activities policies
DROP POLICY IF EXISTS "Users can view discovered activities for their dogs" ON public.discovered_activities;
DROP POLICY IF EXISTS "Users can manage discovered activities for their dogs" ON public.discovered_activities;

CREATE POLICY "Users can view discovered activities for their dogs" ON public.discovered_activities FOR SELECT USING (public.user_owns_dog(dog_id));
CREATE POLICY "Users can manage discovered activities for their dogs" ON public.discovered_activities FOR ALL USING (public.user_owns_dog(dog_id));

-- Learning Metrics policies
DROP POLICY IF EXISTS "Users can view learning metrics for their dogs" ON public.learning_metrics;
DROP POLICY IF EXISTS "Users can create learning metrics for their dogs" ON public.learning_metrics;

CREATE POLICY "Users can view learning metrics for their dogs" ON public.learning_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create learning metrics for their dogs" ON public.learning_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recommendation Logs policies
DROP POLICY IF EXISTS "Users can view recommendation logs for their dogs" ON public.recommendation_logs;
DROP POLICY IF EXISTS "Users can create recommendation logs for their dogs" ON public.recommendation_logs;

CREATE POLICY "Users can view recommendation logs for their dogs" ON public.recommendation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create recommendation logs for their dogs" ON public.recommendation_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Generated Content policies
DROP POLICY IF EXISTS "Users can view their own generated content" ON public.generated_content;
DROP POLICY IF EXISTS "Users can manage their own generated content" ON public.generated_content;

CREATE POLICY "Users can view their own generated content" ON public.generated_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own generated content" ON public.generated_content FOR ALL USING (auth.uid() = user_id);

-- Knowledge Base Files policies
DROP POLICY IF EXISTS "Users can view their own knowledge base files" ON public.knowledge_base_files;
DROP POLICY IF EXISTS "Users can manage their own knowledge base files" ON public.knowledge_base_files;

CREATE POLICY "Users can view their own knowledge base files" ON public.knowledge_base_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own knowledge base files" ON public.knowledge_base_files FOR ALL USING (auth.uid() = user_id);

-- Kajabi Courses policies
DROP POLICY IF EXISTS "Users can view their own kajabi courses" ON public.kajabi_courses;
DROP POLICY IF EXISTS "Users can manage their own kajabi courses" ON public.kajabi_courses;

CREATE POLICY "Users can view their own kajabi courses" ON public.kajabi_courses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own kajabi courses" ON public.kajabi_courses FOR ALL USING (auth.uid() = user_id);

-- Activities table - allow public read access for library activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to approved activities" ON public.activities;
DROP POLICY IF EXISTS "Users can manage their own custom activities" ON public.activities;

CREATE POLICY "Allow public read access to approved activities" ON public.activities FOR SELECT USING (approved = true OR is_custom = false);
CREATE POLICY "Users can manage their own custom activities" ON public.activities FOR ALL USING (is_custom = true AND dog_id IS NOT NULL AND public.user_owns_dog(dog_id));

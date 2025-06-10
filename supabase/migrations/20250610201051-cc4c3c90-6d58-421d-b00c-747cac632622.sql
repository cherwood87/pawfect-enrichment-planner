
-- Create user interaction tracking table
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('activity_view', 'activity_schedule', 'activity_complete', 'activity_skip', 'search', 'filter', 'discovery_trigger', 'feedback_submit')),
  activity_id TEXT,
  activity_type TEXT CHECK (activity_type IN ('library', 'user', 'discovered')),
  pillar TEXT CHECK (pillar IN ('mental', 'physical', 'social', 'environmental', 'instinctual')),
  context_data JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity feedback table
CREATE TABLE public.activity_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('library', 'user', 'discovered')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  engagement_rating INTEGER CHECK (engagement_rating >= 1 AND engagement_rating <= 5),
  enjoyment_rating INTEGER CHECK (enjoyment_rating >= 1 AND engagement_rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL CHECK (preference_type IN ('pillar_weights', 'difficulty_preference', 'duration_preference', 'material_preferences', 'time_preferences', 'weather_preferences')),
  preference_data JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dog_id, preference_type)
);

-- Create recommendation logs table
CREATE TABLE public.recommendation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('daily', 'weekly', 'weather_based', 'mood_based', 'discovery')),
  recommended_activities TEXT[] NOT NULL,
  algorithm_version TEXT DEFAULT 'v1.0',
  context_data JSONB DEFAULT '{}',
  user_action TEXT CHECK (user_action IN ('accepted', 'rejected', 'ignored', 'modified')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning metrics table
CREATE TABLE public.learning_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('pillar_preference', 'difficulty_adaptation', 'engagement_score', 'completion_rate', 'discovery_success')),
  metric_value NUMERIC NOT NULL,
  confidence_level NUMERIC DEFAULT 0.5 CHECK (confidence_level >= 0 AND confidence_level <= 1),
  calculation_data JSONB DEFAULT '{}',
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_metrics ENABLE ROW LEVEL SECURITY;

-- User interactions policies
CREATE POLICY "Users can view their own interactions" ON public.user_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own interactions" ON public.user_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity feedback policies
CREATE POLICY "Users can view their own feedback" ON public.activity_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own feedback" ON public.activity_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON public.activity_feedback FOR UPDATE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- Recommendation logs policies
CREATE POLICY "Users can view their own recommendation logs" ON public.recommendation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own recommendation logs" ON public.recommendation_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning metrics policies
CREATE POLICY "Users can view their own learning metrics" ON public.learning_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own learning metrics" ON public.learning_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_interactions_user_dog ON public.user_interactions(user_id, dog_id);
CREATE INDEX idx_user_interactions_type_created ON public.user_interactions(interaction_type, created_at);
CREATE INDEX idx_activity_feedback_activity ON public.activity_feedback(activity_id, activity_type);
CREATE INDEX idx_user_preferences_user_dog_type ON public.user_preferences(user_id, dog_id, preference_type);
CREATE INDEX idx_recommendation_logs_user_dog_created ON public.recommendation_logs(user_id, dog_id, created_at);
CREATE INDEX idx_learning_metrics_user_dog_type ON public.learning_metrics(user_id, dog_id, metric_type);

-- Create updated_at triggers
CREATE TRIGGER update_activity_feedback_updated_at BEFORE UPDATE ON public.activity_feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate learning metrics
CREATE OR REPLACE FUNCTION public.calculate_pillar_preferences(p_user_id UUID, p_dog_id UUID)
RETURNS TABLE(pillar TEXT, preference_score NUMERIC, confidence NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH activity_stats AS (
    SELECT 
      sa.activity_id,
      a.pillar,
      COUNT(*) as scheduled_count,
      COUNT(CASE WHEN sa.completed THEN 1 END) as completed_count,
      AVG(CASE WHEN af.rating IS NOT NULL THEN af.rating ELSE 3 END) as avg_rating
    FROM scheduled_activities sa
    LEFT JOIN activities a ON sa.activity_id = a.id
    LEFT JOIN activity_feedback af ON sa.activity_id = af.activity_id AND af.user_id = p_user_id AND af.dog_id = p_dog_id
    WHERE sa.dog_id = p_dog_id
    GROUP BY sa.activity_id, a.pillar
  ),
  pillar_metrics AS (
    SELECT 
      ast.pillar,
      SUM(ast.scheduled_count) as total_scheduled,
      SUM(ast.completed_count) as total_completed,
      AVG(ast.avg_rating) as avg_pillar_rating,
      COUNT(DISTINCT ast.activity_id) as unique_activities
    FROM activity_stats ast
    WHERE ast.pillar IS NOT NULL
    GROUP BY ast.pillar
  )
  SELECT 
    pm.pillar::TEXT,
    GREATEST(0.1, LEAST(1.0, 
      (pm.total_completed::NUMERIC / NULLIF(pm.total_scheduled, 0) * 0.4) +
      ((pm.avg_pillar_rating - 3) / 2 * 0.6)
    ))::NUMERIC as preference_score,
    LEAST(1.0, pm.unique_activities::NUMERIC / 10)::NUMERIC as confidence
  FROM pillar_metrics pm;
END;
$$;

-- Create function to generate smart recommendations
CREATE OR REPLACE FUNCTION public.generate_smart_recommendations(
  p_user_id UUID, 
  p_dog_id UUID, 
  p_recommendation_type TEXT DEFAULT 'daily',
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE(
  activity_id TEXT,
  recommendation_score NUMERIC,
  reason TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  user_preferences RECORD;
  dog_profile RECORD;
BEGIN
  -- Get user preferences
  SELECT INTO user_preferences
    COALESCE(
      (SELECT preference_data FROM user_preferences 
       WHERE user_id = p_user_id AND dog_id = p_dog_id AND preference_type = 'pillar_weights'),
      '{"mental": 0.2, "physical": 0.2, "social": 0.2, "environmental": 0.2, "instinctual": 0.2}'::jsonb
    ) as pillar_weights;
  
  -- Get dog profile
  SELECT INTO dog_profile * FROM dogs WHERE id = p_dog_id;
  
  RETURN QUERY
  WITH activity_scores AS (
    SELECT 
      a.id as activity_id,
      a.pillar,
      a.difficulty,
      a.duration,
      -- Base score from pillar preference
      (user_preferences.pillar_weights->>a.pillar)::NUMERIC as pillar_score,
      -- Difficulty alignment score
      CASE 
        WHEN dog_profile.activity_level = 'low' AND a.difficulty = 'Easy' THEN 1.0
        WHEN dog_profile.activity_level = 'moderate' AND a.difficulty = 'Medium' THEN 1.0
        WHEN dog_profile.activity_level = 'high' AND a.difficulty = 'Hard' THEN 1.0
        ELSE 0.5
      END as difficulty_score,
      -- Recent activity penalty (avoid repetition)
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM scheduled_activities sa 
          WHERE sa.activity_id = a.id 
          AND sa.dog_id = p_dog_id 
          AND sa.scheduled_date > CURRENT_DATE - INTERVAL '7 days'
        ) THEN 0.3
        ELSE 1.0
      END as novelty_score,
      -- Quality score for discovered activities
      COALESCE(a.quality_score, 1.0) as quality_score
    FROM activities a
    WHERE a.approved = true OR a.is_custom = true
  )
  SELECT 
    activity_scores.activity_id::TEXT,
    (
      activity_scores.pillar_score * 0.4 +
      activity_scores.difficulty_score * 0.25 +
      activity_scores.novelty_score * 0.2 +
      activity_scores.quality_score * 0.15
    )::NUMERIC as recommendation_score,
    CASE 
      WHEN activity_scores.novelty_score < 1.0 THEN 'Great match for ' || activity_scores.pillar || ' enrichment'
      ELSE 'Perfect for your dog''s ' || dog_profile.activity_level || ' activity level'
    END::TEXT as reason
  FROM activity_scores
  ORDER BY recommendation_score DESC
  LIMIT p_limit;
END;
$$;


import { supabase } from '@/integrations/supabase/client';
import { UserInteraction, ActivityFeedback, UserPreference, LearningMetric, PillarPreference } from '@/types/learning';

export class LearningService {
  // Track user interactions
  static async trackInteraction(interaction: Omit<UserInteraction, 'id' | 'createdAt'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: interaction.userId,
          dog_id: interaction.dogId,
          interaction_type: interaction.interactionType,
          activity_id: interaction.activityId,
          activity_type: interaction.activityType,
          pillar: interaction.pillar,
          context_data: interaction.contextData || {},
          session_id: interaction.sessionId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track interaction:', error);
      // Don't throw - tracking failures shouldn't break user experience
    }
  }

  // Submit activity feedback
  static async submitFeedback(feedback: Omit<ActivityFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActivityFeedback> {
    const { data, error } = await supabase
      .from('activity_feedback')
      .insert({
        user_id: feedback.userId,
        dog_id: feedback.dogId,
        activity_id: feedback.activityId,
        activity_type: feedback.activityType,
        rating: feedback.rating,
        difficulty_rating: feedback.difficultyRating,
        engagement_rating: feedback.engagementRating,
        enjoyment_rating: feedback.enjoymentRating,
        feedback_text: feedback.feedbackText,
        would_recommend: feedback.wouldRecommend,
        tags: feedback.tags || []
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      dogId: data.dog_id,
      activityId: data.activity_id,
      activityType: data.activity_type as 'library' | 'user' | 'discovered',
      rating: data.rating,
      difficultyRating: data.difficulty_rating,
      engagementRating: data.engagement_rating,
      enjoymentRating: data.enjoyment_rating,
      feedbackText: data.feedback_text,
      wouldRecommend: data.would_recommend,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // Get user feedback for an activity
  static async getFeedback(userId: string, dogId: string, activityId?: string): Promise<ActivityFeedback[]> {
    let query = supabase
      .from('activity_feedback')
      .select('*')
      .eq('user_id', userId)
      .eq('dog_id', dogId);

    if (activityId) {
      query = query.eq('activity_id', activityId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      dogId: item.dog_id,
      activityId: item.activity_id,
      activityType: item.activity_type as 'library' | 'user' | 'discovered',
      rating: item.rating,
      difficultyRating: item.difficulty_rating,
      engagementRating: item.engagement_rating,
      enjoymentRating: item.enjoyment_rating,
      feedbackText: item.feedback_text,
      wouldRecommend: item.would_recommend,
      tags: item.tags || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  }

  // Update user preferences
  static async updatePreference(preference: Omit<UserPreference, 'id' | 'lastUpdated'>): Promise<void> {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: preference.userId,
        dog_id: preference.dogId,
        preference_type: preference.preferenceType,
        preference_data: preference.preferenceData,
        confidence_score: preference.confidenceScore
      });

    if (error) throw error;
  }

  // Get user preferences
  static async getPreferences(userId: string, dogId: string, preferenceType?: string): Promise<UserPreference[]> {
    let query = supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('dog_id', dogId);

    if (preferenceType) {
      query = query.eq('preference_type', preferenceType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      dogId: item.dog_id,
      preferenceType: item.preference_type as 'pillar_weights' | 'difficulty_preference' | 'duration_preference' | 'material_preferences' | 'time_preferences' | 'weather_preferences',
      preferenceData: item.preference_data,
      confidenceScore: item.confidence_score,
      lastUpdated: item.last_updated
    }));
  }

  // Calculate pillar preferences using the database function
  static async calculatePillarPreferences(userId: string, dogId: string): Promise<PillarPreference[]> {
    const { data, error } = await supabase
      .rpc('calculate_pillar_preferences', {
        p_user_id: userId,
        p_dog_id: dogId
      });

    if (error) throw error;

    return (data || []).map(item => ({
      pillar: item.pillar,
      preferenceScore: item.preference_score,
      confidence: item.confidence
    }));
  }

  // Store learning metrics
  static async storeLearningMetric(metric: Omit<LearningMetric, 'id' | 'calculatedAt'>): Promise<void> {
    const { error } = await supabase
      .from('learning_metrics')
      .insert({
        user_id: metric.userId,
        dog_id: metric.dogId,
        metric_type: metric.metricType,
        metric_value: metric.metricValue,
        confidence_level: metric.confidenceLevel,
        calculation_data: metric.calculationData || {}
      });

    if (error) throw error;
  }

  // Get learning metrics
  static async getLearningMetrics(userId: string, dogId: string, metricType?: string): Promise<LearningMetric[]> {
    let query = supabase
      .from('learning_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('dog_id', dogId);

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query.order('calculated_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      dogId: item.dog_id,
      metricType: item.metric_type as 'pillar_preference' | 'difficulty_adaptation' | 'engagement_score' | 'completion_rate' | 'discovery_success',
      metricValue: item.metric_value,
      confidenceLevel: item.confidence_level,
      calculationData: item.calculation_data,
      calculatedAt: item.calculated_at
    }));
  }
}

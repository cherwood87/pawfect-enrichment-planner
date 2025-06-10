
import { supabase } from '@/integrations/supabase/client';
import { SmartRecommendation, RecommendationLog } from '@/types/learning';
import { LearningService } from './LearningService';

export class RecommendationService {
  // Generate smart recommendations using the database function
  static async generateRecommendations(
    userId: string,
    dogId: string,
    type: 'daily' | 'weekly' | 'weather_based' | 'mood_based' | 'discovery' = 'daily',
    limit: number = 5
  ): Promise<SmartRecommendation[]> {
    const { data, error } = await supabase
      .rpc('generate_smart_recommendations', {
        p_user_id: userId,
        p_dog_id: dogId,
        p_recommendation_type: type,
        p_limit: limit
      });

    if (error) throw error;

    // Log the recommendation
    await this.logRecommendation({
      userId,
      dogId,
      recommendationType: type,
      recommendedActivities: data?.map((r: any) => r.activity_id) || [],
      algorithmVersion: 'v1.0',
      contextData: { limit, timestamp: new Date().toISOString() }
    });

    return data || [];
  }

  // Log recommendation for analytics
  static async logRecommendation(log: Omit<RecommendationLog, 'id' | 'createdAt'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('recommendation_logs')
        .insert({
          user_id: log.userId,
          dog_id: log.dogId,
          recommendation_type: log.recommendationType,
          recommended_activities: log.recommendedActivities,
          algorithm_version: log.algorithmVersion,
          context_data: log.contextData || {},
          user_action: log.userAction
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to log recommendation:', error);
      // Don't throw - logging failures shouldn't break user experience
    }
  }

  // Update recommendation with user action
  static async updateRecommendationAction(
    userId: string,
    dogId: string,
    recommendedActivities: string[],
    action: 'accepted' | 'rejected' | 'ignored' | 'modified'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('recommendation_logs')
        .update({ user_action: action })
        .eq('user_id', userId)
        .eq('dog_id', dogId)
        .contains('recommended_activities', recommendedActivities)
        .is('user_action', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update recommendation action:', error);
    }
  }

  // Get personalized daily recommendations
  static async getDailyRecommendations(userId: string, dogId: string): Promise<SmartRecommendation[]> {
    // Track the interaction
    await LearningService.trackInteraction({
      userId,
      dogId,
      interactionType: 'discovery_trigger',
      contextData: { type: 'daily_recommendations' }
    });

    return this.generateRecommendations(userId, dogId, 'daily', 3);
  }

  // Get weather-based recommendations
  static async getWeatherBasedRecommendations(
    userId: string,
    dogId: string,
    weatherCondition: string
  ): Promise<SmartRecommendation[]> {
    // Track the interaction
    await LearningService.trackInteraction({
      userId,
      dogId,
      interactionType: 'discovery_trigger',
      contextData: { type: 'weather_based', weather: weatherCondition }
    });

    return this.generateRecommendations(userId, dogId, 'weather_based', 4);
  }

  // Get recommendations based on dog's mood/energy
  static async getMoodBasedRecommendations(
    userId: string,
    dogId: string,
    mood: string,
    energyLevel: string
  ): Promise<SmartRecommendation[]> {
    // Track the interaction
    await LearningService.trackInteraction({
      userId,
      dogId,
      interactionType: 'discovery_trigger',
      contextData: { type: 'mood_based', mood, energyLevel }
    });

    return this.generateRecommendations(userId, dogId, 'mood_based', 4);
  }
}

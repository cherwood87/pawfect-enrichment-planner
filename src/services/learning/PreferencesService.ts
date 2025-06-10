
import { supabase } from '@/integrations/supabase/client';
import { UserPreference, PillarPreference } from '@/types/learning';

export class PreferencesService {
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
      preferenceData: (item.preference_data || {}) as Record<string, any>,
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
}

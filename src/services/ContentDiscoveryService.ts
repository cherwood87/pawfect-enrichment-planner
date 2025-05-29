
import { supabase } from '@/integrations/supabase/client';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';

export class ContentDiscoveryService {
  static getDefaultConfig(): ContentDiscoveryConfig {
    return {
      enabled: true,
      frequency: 'weekly',
      maxActivitiesPerDiscovery: 8,
      targetSources: [],
      breedSpecific: true,
      qualityThreshold: 0.6,
    };
  }

  static async getDiscoveredActivities(dogId: string): Promise<DiscoveredActivity[]> {
    try {
      const { data, error } = await supabase
        .from('discovered_activities')
        .select('*')
        .eq('dog_id', dogId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching discovered activities:', error);
      return [];
    }
  }

  static async createDiscoveredActivities(activities: DiscoveredActivity[], dogId: string): Promise<void> {
    try {
      const activitiesWithDogId = activities.map(activity => ({
        ...activity,
        dog_id: dogId
      }));

      const { error } = await supabase
        .from('discovered_activities')
        .upsert(activitiesWithDogId);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating discovered activities:', error);
      throw error;
    }
  }

  static async getDiscoveryConfig(dogId: string): Promise<ContentDiscoveryConfig | null> {
    try {
      const { data, error } = await supabase
        .from('discovery_configs')
        .select('*')
        .eq('dog_id', dogId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching discovery config:', error);
      return null;
    }
  }

  static async saveDiscoveryConfig(config: ContentDiscoveryConfig, dogId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('discovery_configs')
        .upsert({
          ...config,
          dog_id: dogId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving discovery config:', error);
      throw error;
    }
  }
}

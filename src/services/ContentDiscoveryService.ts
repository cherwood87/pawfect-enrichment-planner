
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

  static async getDiscoveredActivities(_dogId: string): Promise<DiscoveredActivity[]> {
    try {
      // Fetch globally visible approved discovered activities (activities table)
      const actRes = await supabase
        .from('activities')
        .select('*')
        .eq('source', 'discovered')
        .eq('approved', true)
        .eq('is_public', true);

      if (actRes.error) throw actRes.error;

      // Fetch approved legacy discovered_activities (for backwards compatibility)
      const discRes = await supabase
        .from('discovered_activities')
        .select('*')
        .eq('is_approved', true);

      if (discRes.error) throw discRes.error;

      const actData = actRes.data || [];
      const discData = discRes.data || [];

      // Map activities rows (source='discovered') to DiscoveredActivity
      const fromActivitiesTable: DiscoveredActivity[] = actData.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        materials: activity.materials || [],
        emotionalGoals: activity.emotional_goals || [],
        instructions: activity.instructions || [],
        benefits: activity.benefits || '',
        tags: activity.tags || [],
        ageGroup: activity.age_group || 'All Ages',
        energyLevel: activity.energy_level || 'Medium',
        source: 'discovered' as const,
        sourceUrl: activity.source_url || '',
        discoveredAt: activity.discovered_at || new Date().toISOString(),
        verified: !!activity.verified || !!activity.approved,
        qualityScore: Number(activity.quality_score) || 0.5,
        approved: !!activity.approved,
        rejected: false,
      }));

      // Map discovered_activities rows to DiscoveredActivity
      const fromDiscoveredActivities: DiscoveredActivity[] = discData.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        materials: activity.materials || [],
        emotionalGoals: activity.emotional_goals || [],
        instructions: activity.instructions || [],
        benefits: activity.benefits || '',
        tags: activity.tags || [],
        ageGroup: activity.age_group || 'All Ages',
        energyLevel: activity.energy_level || 'Medium',
        source: 'discovered' as const,
        sourceUrl: activity.source_url || '',
        discoveredAt: activity.discovered_at,
        verified: !!activity.is_approved,
        qualityScore: Number(activity.confidence_score) || 0.5,
        approved: !!activity.is_approved,
        rejected: !!activity.is_rejected,
      }));

      // Merge and de-duplicate by id and normalized title to avoid repeats
      const combined = [...fromActivitiesTable, ...fromDiscoveredActivities];
      const seenIds = new Set<string>();
      const seenTitles = new Set<string>();
      const unique: DiscoveredActivity[] = [];

      for (const item of combined) {
        const idKey = String(item.id);
        const titleKey = (item.title || '').trim().toLowerCase();
        if (!item.title) continue;
        if (seenIds.has(idKey) || seenTitles.has(titleKey)) continue;
        seenIds.add(idKey);
        seenTitles.add(titleKey);
        unique.push(item);
      }

      return unique;
    } catch (error) {
      console.error('Error fetching discovered activities (global):', error);
      return [];
    }
  }

  static async createDiscoveredActivities(activities: DiscoveredActivity[], dogId: string): Promise<void> {
    try {
      const activitiesWithDogId = activities.map(activity => ({
        id: activity.id,
        dog_id: dogId,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        materials: activity.materials || [],
        emotional_goals: activity.emotionalGoals || [],
        instructions: activity.instructions || [],
        benefits: activity.benefits || '',
        tags: activity.tags || [],
        age_group: activity.ageGroup || 'All Ages',
        energy_level: activity.energyLevel || 'Medium',
        source_url: activity.sourceUrl || '',
        discovered_at: activity.discoveredAt,
        confidence_score: activity.qualityScore || 0.5,
        is_approved: activity.approved || false,
        is_rejected: activity.rejected || false
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
      
      if (!data) return null;

      // Map database response to ContentDiscoveryConfig type
      return {
        enabled: data.enabled,
        frequency: data.frequency as 'weekly' | 'monthly',
        maxActivitiesPerDiscovery: data.max_activities_per_discovery,
        targetSources: data.target_sources || [],
        breedSpecific: data.breed_specific,
        qualityThreshold: Number(data.quality_threshold),
        lastDiscoveryRun: data.last_discovery_run || undefined
      };
    } catch (error) {
      console.error('Error fetching discovery config:', error);
      return null;
    }
  }

  static async saveDiscoveryConfig(config: ContentDiscoveryConfig, dogId: string): Promise<void> {
    try {
      const configData = {
        dog_id: dogId,
        enabled: config.enabled,
        frequency: config.frequency,
        max_activities_per_discovery: config.maxActivitiesPerDiscovery,
        target_sources: config.targetSources || [],
        breed_specific: config.breedSpecific,
        quality_threshold: config.qualityThreshold,
        last_discovery_run: config.lastDiscoveryRun || null
      };

      const { error } = await supabase
        .from('discovery_configs')
        .upsert(configData);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving discovery config:', error);
      throw error;
    }
  }
}

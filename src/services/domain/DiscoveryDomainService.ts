
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { DiscoveryRepository } from '../data/DiscoveryRepository';
import { AIContentDiscoveryService } from '../AIContentDiscoveryService';
import { ContentDiscoveryService } from '../ContentDiscoveryService';
import { activityLibrary, getCombinedActivities } from '@/data/activityLibrary';
import { weightedShuffle } from '@/utils/weightedShuffle';

export class DiscoveryDomainService {
  static async getDiscoveredActivitiesForDog(dogId: string): Promise<DiscoveredActivity[]> {
    return await DiscoveryRepository.getDiscoveredActivities(dogId);
  }

  static async getDiscoveryConfigForDog(dogId: string): Promise<ContentDiscoveryConfig | null> {
    return await DiscoveryRepository.getDiscoveryConfig(dogId);
  }

  static async saveDiscoveryConfig(dogId: string, config: ContentDiscoveryConfig): Promise<void> {
    await DiscoveryRepository.saveDiscoveryConfig(dogId, config);
  }

  static getCombinedActivityLibrary(discoveredActivities: DiscoveredActivity[]): (ActivityLibraryItem | DiscoveredActivity)[] {
    // Only include approved activities (all AI activities are auto-approved)
    const approvedDiscovered = discoveredActivities.filter(activity => activity.approved);
    const combined = getCombinedActivities(approvedDiscovered);
    
    // Apply weighted shuffling to promote discovered activities
    return weightedShuffle(combined, {
      discoveredActivity: 3.0,  // 3x weight for discovered activities
      libraryActivity: 1.0,     // Base weight for library activities
      qualityBonus: 2.0,        // Bonus for high-quality activities
      recentDiscoveryBonus: 1.5 // Bonus for recently discovered
    });
  }

  static async discoverNewActivities(
    discoveredActivities: DiscoveredActivity[],
    discoveryConfig: ContentDiscoveryConfig,
    currentDog: Dog
  ): Promise<DiscoveredActivity[]> {
    console.log('Starting AI-powered content discovery for', currentDog.name);

    try {
      const existingActivities = [...activityLibrary, ...discoveredActivities];
      const newActivities = await AIContentDiscoveryService.discoverNewActivities(
        existingActivities,
        { ...discoveryConfig, maxActivitiesPerDiscovery: 8 },
        currentDog
      );

      if (newActivities.length > 0) {
        const updatedDiscovered = [...discoveredActivities, ...newActivities];
        await DiscoveryRepository.saveDiscoveredActivities(currentDog.id, updatedDiscovered);

        const updatedConfig = {
          ...discoveryConfig,
          lastDiscoveryRun: new Date().toISOString()
        };
        await DiscoveryRepository.saveDiscoveryConfig(currentDog.id, updatedConfig);

        console.log(`AI Discovery complete! Found ${newActivities.length} new activities for ${currentDog.name}`);
        return newActivities;
      } else {
        console.log('No new unique activities found in this AI discovery session');

        // Still update the discovery config to prevent immediate re-runs
        const updatedConfig = {
          ...discoveryConfig,
          lastDiscoveryRun: new Date().toISOString()
        };
        await DiscoveryRepository.saveDiscoveryConfig(currentDog.id, updatedConfig);
        return [];
      }
    } catch (error) {
      console.error('AI Discovery failed:', error);

      // Update config even on failure to prevent infinite retries
      const updatedConfig = {
        ...discoveryConfig,
        lastDiscoveryRun: new Date().toISOString()
      };
      await DiscoveryRepository.saveDiscoveryConfig(currentDog.id, updatedConfig);
      throw error;
    }
  }

  static async approveDiscoveredActivity(
    activityId: string,
    discoveredActivities: DiscoveredActivity[],
    dogId: string
  ): Promise<DiscoveredActivity[]> {
    const updated = discoveredActivities.map(activity =>
      activity.id === activityId
        ? { ...activity, approved: true, rejected: false, verified: true }
        : activity
    );
    
    await DiscoveryRepository.saveDiscoveredActivities(dogId, updated);
    return updated;
  }

  static async rejectDiscoveredActivity(
    activityId: string,
    discoveredActivities: DiscoveredActivity[],
    dogId: string
  ): Promise<DiscoveredActivity[]> {
    const updated = discoveredActivities.map(activity =>
      activity.id === activityId
        ? { ...activity, approved: false, rejected: true }
        : activity
    );
    
    await DiscoveryRepository.saveDiscoveredActivities(dogId, updated);
    return updated;
  }

  static shouldRunAutoDiscovery(discoveryConfig: ContentDiscoveryConfig): boolean {
    return AIContentDiscoveryService.shouldRunDiscovery(discoveryConfig);
  }

  static async updateDiscoveryConfig(
    dogId: string,
    currentConfig: ContentDiscoveryConfig,
    updates: Partial<ContentDiscoveryConfig>
  ): Promise<ContentDiscoveryConfig> {
    const updated = { ...currentConfig, ...updates };
    await DiscoveryRepository.saveDiscoveryConfig(dogId, updated);
    return updated;
  }
}

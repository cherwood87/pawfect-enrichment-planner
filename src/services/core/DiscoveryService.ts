
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { ActivityLibraryItem } from '@/types/activity';
import { Dog } from '@/types/dog';
import { DiscoveryDomainService } from '../domain/DiscoveryDomainService';

export class DiscoveryService {
  static async getDiscoveredActivities(dogId: string): Promise<DiscoveredActivity[]> {
    return DiscoveryDomainService.getDiscoveredActivitiesForDog(dogId);
  }

  static async getDiscoveryConfig(dogId: string): Promise<ContentDiscoveryConfig | null> {
    return DiscoveryDomainService.getDiscoveryConfigForDog(dogId);
  }

  static async saveDiscoveryConfig(dogId: string, config: ContentDiscoveryConfig): Promise<void> {
    return DiscoveryDomainService.saveDiscoveryConfig(dogId, config);
  }

  static getCombinedActivityLibrary(discoveredActivities: DiscoveredActivity[]): (ActivityLibraryItem | DiscoveredActivity)[] {
    return DiscoveryDomainService.getCombinedActivityLibrary(discoveredActivities);
  }

  static async discoverNewActivities(
    discoveredActivities: DiscoveredActivity[],
    discoveryConfig: ContentDiscoveryConfig,
    currentDog: Dog
  ): Promise<DiscoveredActivity[]> {
    return DiscoveryDomainService.discoverNewActivities(discoveredActivities, discoveryConfig, currentDog);
  }

  static async approveActivity(
    activityId: string,
    discoveredActivities: DiscoveredActivity[],
    dogId: string
  ): Promise<DiscoveredActivity[]> {
    return DiscoveryDomainService.approveDiscoveredActivity(activityId, discoveredActivities, dogId);
  }

  static async rejectActivity(
    activityId: string,
    discoveredActivities: DiscoveredActivity[],
    dogId: string
  ): Promise<DiscoveredActivity[]> {
    return DiscoveryDomainService.rejectDiscoveredActivity(activityId, discoveredActivities, dogId);
  }

  static shouldRunAutoDiscovery(discoveryConfig: ContentDiscoveryConfig): boolean {
    return DiscoveryDomainService.shouldRunAutoDiscovery(discoveryConfig);
  }

  static async updateDiscoveryConfig(
    dogId: string,
    currentConfig: ContentDiscoveryConfig,
    updates: Partial<ContentDiscoveryConfig>
  ): Promise<ContentDiscoveryConfig> {
    return DiscoveryDomainService.updateDiscoveryConfig(dogId, currentConfig, updates);
  }
}

import { ScheduledActivity, UserActivity } from "@/types/activity";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";

export class LocalStorageAdapter {
  // Scheduled Activities
  static getScheduledActivities(dogId: string): ScheduledActivity[] {
    const saved = localStorage.getItem(`scheduledActivities-${dogId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static saveScheduledActivities(
    dogId: string,
    activities: ScheduledActivity[],
  ): void {
    localStorage.setItem(
      `scheduledActivities-${dogId}`,
      JSON.stringify(activities),
    );
  }

  static clearScheduledActivities(dogId: string): void {
    localStorage.removeItem(`scheduledActivities-${dogId}`);
  }

  // User Activities
  static getUserActivities(dogId: string): UserActivity[] {
    const saved = localStorage.getItem(`userActivities-${dogId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static saveUserActivities(dogId: string, activities: UserActivity[]): void {
    localStorage.setItem(`userActivities-${dogId}`, JSON.stringify(activities));
  }

  static clearUserActivities(dogId: string): void {
    localStorage.removeItem(`userActivities-${dogId}`);
  }

  // Discovered Activities
  static getDiscoveredActivities(dogId: string): DiscoveredActivity[] {
    const saved = localStorage.getItem(`discoveredActivities-${dogId}`);
    return saved ? JSON.parse(saved) : [];
  }

  static saveDiscoveredActivities(
    dogId: string,
    activities: DiscoveredActivity[],
  ): void {
    localStorage.setItem(
      `discoveredActivities-${dogId}`,
      JSON.stringify(activities),
    );
  }

  static clearDiscoveredActivities(dogId: string): void {
    localStorage.removeItem(`discoveredActivities-${dogId}`);
  }

  // Discovery Config
  static getDiscoveryConfig(dogId: string): ContentDiscoveryConfig | null {
    const saved = localStorage.getItem(`discoveryConfig-${dogId}`);
    return saved ? JSON.parse(saved) : null;
  }

  static saveDiscoveryConfig(
    dogId: string,
    config: ContentDiscoveryConfig,
  ): void {
    localStorage.setItem(`discoveryConfig-${dogId}`, JSON.stringify(config));
  }

  static clearDiscoveryConfig(dogId: string): void {
    localStorage.removeItem(`discoveryConfig-${dogId}`);
  }

  // Migration helpers
  static hasScheduledActivitiesData(dogId: string): boolean {
    return localStorage.getItem(`scheduledActivities-${dogId}`) !== null;
  }

  static hasUserActivitiesData(dogId: string): boolean {
    return localStorage.getItem(`userActivities-${dogId}`) !== null;
  }

  static hasDiscoveredActivitiesData(dogId: string): boolean {
    return localStorage.getItem(`discoveredActivities-${dogId}`) !== null;
  }

  static hasDiscoveryConfigData(dogId: string): boolean {
    return localStorage.getItem(`discoveryConfig-${dogId}`) !== null;
  }
}

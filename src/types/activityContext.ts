
import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';

export interface ActivityContextType {
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  discoveredActivities: DiscoveredActivity[];
  discoveryConfig: ContentDiscoveryConfig;
  isDiscovering: boolean;
  addScheduledActivity: (activity: Omit<ScheduledActivity, 'id' | 'dogId'>) => void;
  toggleActivityCompletion: (activityId: string, completionNotes?: string) => void;
  updateScheduledActivity: (activityId: string, updates: Partial<ScheduledActivity>) => void;
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => void;
  getTodaysActivities: () => ScheduledActivity[];
  getActivityDetails: (activityId: string) => ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined;
  getStreakData: () => StreakData;
  getWeeklyProgress: () => WeeklyProgress[];
  getPillarBalance: () => Record<string, number>;
  getDailyGoals: () => PillarGoals;
  getCombinedActivityLibrary: () => (ActivityLibraryItem | DiscoveredActivity)[];
  discoverNewActivities: () => Promise<void>;
  approveDiscoveredActivity: (activityId: string) => void;
  rejectDiscoveredActivity: (activityId: string) => void;
  updateDiscoveryConfig: (config: Partial<ContentDiscoveryConfig>) => void;
  checkAndRunAutoDiscovery?: () => Promise<void>;
}

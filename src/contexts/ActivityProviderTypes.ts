
import { ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';

export interface ActivityProviderState {
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  discoveredActivities: DiscoveredActivity[];
  discoveryConfig: ContentDiscoveryConfig;
}

export interface ActivityProviderActions {
  setScheduledActivities: (activities: ScheduledActivity[] | ((prev: ScheduledActivity[]) => ScheduledActivity[])) => void;
  setUserActivities: (activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[])) => void;
  setDiscoveredActivities: (activities: DiscoveredActivity[]) => void;
  setDiscoveryConfig: (config: ContentDiscoveryConfig) => void;
}

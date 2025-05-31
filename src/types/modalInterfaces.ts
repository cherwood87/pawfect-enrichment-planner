
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from './activity';
import { DiscoveredActivity } from './discovery';

// Standardized interface for activity modals
export interface BaseActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  mode?: 'scheduled' | 'library';
}

// Props for scheduled activity modals (weekly planner)
export interface ScheduledActivityModalProps extends BaseActivityModalProps {
  scheduledActivity?: ScheduledActivity | null;
  onToggleCompletion?: (activityId: string, completionNotes?: string) => void;
  mode: 'scheduled';
}

// Props for library activity modals (activity library)
export interface LibraryActivityModalProps extends BaseActivityModalProps {
  mode: 'library';
}

// Union type for all activity modal props
export type ActivityModalProps = ScheduledActivityModalProps | LibraryActivityModalProps;

// Helper type guards
export function isScheduledMode(props: ActivityModalProps): props is ScheduledActivityModalProps {
  return props.mode === 'scheduled';
}

export function isLibraryMode(props: ActivityModalProps): props is LibraryActivityModalProps {
  return props.mode === 'library';
}

export interface ScheduledActivity {
  id: string;
  dogId: string; // Associate activities with specific dogs
  activityId: string; // references ActivityLibraryItem
  scheduledDate: string; // date in ISO format
  completed: boolean;
  notes?: string; // User notes for the activity
  completionNotes?: string; // Notes added when completing activity
  reminderEnabled?: boolean; // Whether reminders are enabled
  completedAt?: string;
  weekNumber?: number; // ISO week number for weekly planning
  dayOfWeek?: number; // Day of week (0=Sunday, 6=Saturday)
}
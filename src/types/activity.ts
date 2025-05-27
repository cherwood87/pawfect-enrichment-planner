
export interface ActivityLibraryItem {
  id: string;
  title: string;
  pillar: 'mental' | 'physical' | 'social' | 'environmental' | 'instinctual';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  materials: string[];
  emotionalGoals: string[];
  instructions: string[];
  benefits: string;
  tags: string[];
  ageGroup: 'Puppy' | 'Adult' | 'Senior' | 'All Ages';
  energyLevel: 'Low' | 'Medium' | 'High';
}

export interface ScheduledActivity {
  id: string;
  dogId: string; // Associate activities with specific dogs
  activityId: string; // references ActivityLibraryItem
  scheduledDate: string;
  scheduledTime?: string; // Add missing scheduledTime property
  userSelectedTime?: string; // Add missing userSelectedTime property
  completed: boolean;
  notes?: string; // User notes for the activity
  completionNotes?: string; // Notes added when completing activity
  reminderEnabled?: boolean; // Whether reminders are enabled
  completedAt?: string;
  weekNumber?: number; // ISO week number for weekly planning
  dayOfWeek?: number; // Day of week (0=Sunday, 6=Saturday)
}

export interface UserActivity extends ActivityLibraryItem {
  isCustom: boolean;
  createdAt: string;
  dogId: string; // Custom activities also belong to specific dogs
}

export interface WeeklyProgress {
  day: string;
  completed: boolean;
  activities: number;
  date: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  activeDays: number;
  weeklyProgress: WeeklyProgress[];
}

export interface PillarGoals {
  mental: number;
  physical: number;
  social: number;
  environmental: number;
  instinctual: number;
}

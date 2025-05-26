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
  scheduledTime: string; // Keep for backward compatibility
  userSelectedTime?: string; // NEW: User-customizable time (HH:MM format)
  scheduledDate: string;
  completed: boolean;
  notes?: string; // NEW: User notes for the activity
  completionNotes?: string; // NEW: Notes added when completing activity
  reminderEnabled?: boolean; // NEW: Whether reminders are enabled
  completedAt?: string;
  weekNumber?: number; // NEW: ISO week number for weekly planning
  dayOfWeek?: number; // NEW: Day of week (0=Sunday, 6=Saturday)
}

export interface UserActivity extends ActivityLibraryItem {
  isCustom: boolean;
  createdAt: string;
  dogId: string; // NEW: Custom activities also belong to specific dogs
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


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
  dogId: string; // NEW: Associate activities with specific dogs
  activityId: string; // references ActivityLibraryItem
  scheduledTime: string;
  scheduledDate: string;
  completed: boolean;
  notes?: string;
  completedAt?: string;
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
  weeklyProgress: WeeklyProgress[];
}

export interface PillarGoals {
  mental: number;
  physical: number;
  social: number;
  environmental: number;
  instinctual: number;
}

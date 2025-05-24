
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
}

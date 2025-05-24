
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { activityLibrary, getActivityById } from '@/data/activityLibrary';
import { useDog } from '@/contexts/DogContext';

interface ActivityContextType {
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  addScheduledActivity: (activity: Omit<ScheduledActivity, 'id' | 'dogId'>) => void;
  toggleActivityCompletion: (activityId: string) => void;
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => void;
  getTodaysActivities: () => ScheduledActivity[];
  getActivityDetails: (activityId: string) => ActivityLibraryItem | UserActivity | undefined;
  getStreakData: () => StreakData;
  getWeeklyProgress: () => WeeklyProgress[];
  getPillarBalance: () => Record<string, number>;
  getDailyGoals: () => PillarGoals;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDog } = useDog();
  const [scheduledActivities, setScheduledActivities] = useState<ScheduledActivity[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);

  // Load dog-specific data from localStorage
  useEffect(() => {
    if (!currentDog) {
      setScheduledActivities([]);
      setUserActivities([]);
      return;
    }

    const savedScheduled = localStorage.getItem(`scheduledActivities-${currentDog.id}`);
    const savedUser = localStorage.getItem(`userActivities-${currentDog.id}`);
    
    if (savedScheduled) {
      setScheduledActivities(JSON.parse(savedScheduled));
    } else {
      // Initialize with some default activities for new dogs
      const defaultActivities: ScheduledActivity[] = [
        {
          id: 'scheduled-1',
          dogId: currentDog.id,
          activityId: 'physical-morning-walk',
          scheduledTime: '8:00 AM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          id: 'scheduled-2',
          dogId: currentDog.id,
          activityId: 'mental-puzzle-feeder',
          scheduledTime: '12:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        },
        {
          id: 'scheduled-3',
          dogId: currentDog.id,
          activityId: 'environmental-new-route',
          scheduledTime: '3:00 PM',
          scheduledDate: new Date().toISOString().split('T')[0],
          completed: false
        }
      ];
      setScheduledActivities(defaultActivities);
    }
    
    if (savedUser) {
      setUserActivities(JSON.parse(savedUser));
    } else {
      setUserActivities([]);
    }
  }, [currentDog]);

  // Save dog-specific data to localStorage
  useEffect(() => {
    if (currentDog && scheduledActivities.length >= 0) {
      localStorage.setItem(`scheduledActivities-${currentDog.id}`, JSON.stringify(scheduledActivities));
    }
  }, [scheduledActivities, currentDog]);

  useEffect(() => {
    if (currentDog && userActivities.length >= 0) {
      localStorage.setItem(`userActivities-${currentDog.id}`, JSON.stringify(userActivities));
    }
  }, [userActivities, currentDog]);

  const addScheduledActivity = (activity: Omit<ScheduledActivity, 'id' | 'dogId'>) => {
    if (!currentDog) return;
    
    const newActivity: ScheduledActivity = {
      ...activity,
      id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id
    };
    setScheduledActivities(prev => [...prev, newActivity]);
  };

  const toggleActivityCompletion = (activityId: string) => {
    setScheduledActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              completed: !activity.completed,
              completedAt: !activity.completed ? new Date().toISOString() : undefined
            }
          : activity
      )
    );
  };

  const addUserActivity = (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => {
    if (!currentDog) return;
    
    const newActivity: UserActivity = {
      ...activity,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dogId: currentDog.id,
      createdAt: new Date().toISOString()
    };
    setUserActivities(prev => [...prev, newActivity]);
  };

  const getTodaysActivities = (): ScheduledActivity[] => {
    if (!currentDog) return [];
    const today = new Date().toISOString().split('T')[0];
    return scheduledActivities.filter(activity => 
      activity.scheduledDate === today && activity.dogId === currentDog.id
    );
  };

  const getActivityDetails = (activityId: string): ActivityLibraryItem | UserActivity | undefined => {
    // First check library activities
    const libraryActivity = getActivityById(activityId);
    if (libraryActivity) return libraryActivity;
    
    // Then check user activities for current dog
    return userActivities.find(activity => 
      activity.id === activityId && activity.dogId === currentDog?.id
    );
  };

  const getWeeklyProgress = (): WeeklyProgress[] => {
    if (!currentDog) return [];
    
    const today = new Date();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const progress: WeeklyProgress[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      
      const dayActivities = scheduledActivities.filter(activity => 
        activity.scheduledDate === dateStr && 
        activity.dogId === currentDog.id
      );
      
      const completedCount = dayActivities.filter(a => a.completed).length;
      
      progress.push({
        day: weekDays[dayIndex],
        completed: completedCount > 0,
        activities: completedCount,
        date: dateStr
      });
    }
    
    return progress;
  };

  const getStreakData = (): StreakData => {
    if (!currentDog) {
      return {
        currentStreak: 0,
        bestStreak: 0,
        completionRate: 0,
        weeklyProgress: []
      };
    }

    const weeklyProgress = getWeeklyProgress();
    
    // Calculate current streak
    let currentStreak = 0;
    for (let i = weeklyProgress.length - 1; i >= 0; i--) {
      if (weeklyProgress[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate best streak (simplified - would need more historical data)
    const bestStreak = Math.max(currentStreak, 12); // Keep existing best or current
    
    // Calculate completion rate
    const completedDays = weeklyProgress.filter(day => day.completed).length;
    const completionRate = weeklyProgress.length > 0 ? (completedDays / weeklyProgress.length) * 100 : 0;
    
    return {
      currentStreak,
      bestStreak,
      completionRate: Math.round(completionRate),
      weeklyProgress
    };
  };

  const getPillarBalance = (): Record<string, number> => {
    if (!currentDog) return {};
    
    const today = new Date().toISOString().split('T')[0];
    const completedToday = scheduledActivities.filter(activity => 
      activity.scheduledDate === today && 
      activity.completed && 
      activity.dogId === currentDog.id
    );
    
    const pillarCounts: Record<string, number> = {
      mental: 0,
      physical: 0,
      social: 0,
      environmental: 0,
      instinctual: 0
    };
    
    completedToday.forEach(activity => {
      const details = getActivityDetails(activity.activityId);
      if (details) {
        pillarCounts[details.pillar] = (pillarCounts[details.pillar] || 0) + 1;
      }
    });
    
    return pillarCounts;
  };

  const getDailyGoals = (): PillarGoals => {
    if (!currentDog?.quizResults) {
      return { mental: 1, physical: 1, social: 1, environmental: 1, instinctual: 1 };
    }
    
    // Set goals based on quiz results - top pillars get higher goals
    const ranking = currentDog.quizResults.ranking;
    const goals: PillarGoals = { mental: 1, physical: 1, social: 1, environmental: 1, instinctual: 1 };
    
    // Top 2 pillars get 2 activities per day, others get 1
    if (ranking.length >= 2) {
      goals[ranking[0].pillar as keyof PillarGoals] = 2;
      goals[ranking[1].pillar as keyof PillarGoals] = 2;
    }
    
    return goals;
  };

  return (
    <ActivityContext.Provider
      value={{
        scheduledActivities,
        userActivities,
        addScheduledActivity,
        toggleActivityCompletion,
        addUserActivity,
        getTodaysActivities,
        getActivityDetails,
        getStreakData,
        getWeeklyProgress,
        getPillarBalance,
        getDailyGoals
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

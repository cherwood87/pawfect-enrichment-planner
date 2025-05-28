
import React, { createContext, useContext } from 'react';
import { ScheduledActivity, UserActivity, ActivityLibraryItem, StreakData, WeeklyProgress, PillarGoals } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useDog } from '@/contexts/DogContext';
import { useActivityActions } from '@/hooks/useActivityActions';
import { useActivityOperations as useActivityOperationsHook } from '@/hooks/useActivityOperations';
import { useActivityState } from './ActivityStateContext';

interface ActivityOperationsContextType {
  addScheduledActivity: (activity: Omit<ScheduledActivity, 'id'>) => void;
  toggleActivityCompletion: (activityId: string, completionNotes?: string) => void;
  updateScheduledActivity: (activityId: string, updates: Partial<ScheduledActivity>) => void;
  addUserActivity: (activity: Omit<UserActivity, 'id' | 'createdAt' | 'dogId'>) => void;
  getTodaysActivities: () => ScheduledActivity[];
  getActivityDetails: (activityId: string) => ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined;
  getStreakData: () => StreakData;
  getWeeklyProgress: () => WeeklyProgress[];
  getPillarBalance: () => Record<string, number>;
  getDailyGoals: () => PillarGoals;
}

const ActivityOperationsContext = createContext<ActivityOperationsContextType | undefined>(undefined);

export const useActivityOperations = () => {
  const context = useContext(ActivityOperationsContext);
  if (!context) {
    throw new Error('useActivityOperations must be used within an ActivityOperationsProvider');
  }
  return context;
};

export const ActivityOperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDog } = useDog();
  const { 
    scheduledActivities, 
    userActivities, 
    discoveredActivities,
    setScheduledActivities,
    setUserActivities 
  } = useActivityState();

  // Activity actions
  const {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity
  } = useActivityActions(setScheduledActivities, setUserActivities, currentDog);

  // Activity operations hook
  const activityOps = useActivityOperationsHook(
    scheduledActivities,
    userActivities,
    discoveredActivities,
    currentDog
  );

  const value: ActivityOperationsContextType = {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity,
    getTodaysActivities: activityOps.getTodaysActivities,
    getActivityDetails: activityOps.getActivityDetails,
    getStreakData: activityOps.getStreakData,
    getWeeklyProgress: activityOps.getWeeklyProgress,
    getPillarBalance: activityOps.getPillarBalance,
    getDailyGoals: activityOps.getDailyGoals
  };

  return (
    <ActivityOperationsContext.Provider value={value}>
      {children}
    </ActivityOperationsContext.Provider>
  );
};


import React, { createContext, useContext } from 'react';
import { ActivityContextType } from '@/types/activityContext';
import { useDog } from '@/contexts/DogContext';
import { useActivityOperations } from '@/hooks/useActivityOperations';
import { useDiscoveryOperations } from '@/hooks/useDiscoveryOperations';
import { useActivityState } from '@/hooks/useActivityState';
import { useActivityActions } from '@/hooks/useActivityActions';

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
  
  // State management
  const {
    scheduledActivities,
    userActivities,
    discoveredActivities,
    discoveryConfig,
    setScheduledActivities,
    setUserActivities,
    setDiscoveredActivities,
    setDiscoveryConfig
  } = useActivityState(currentDog);

  // Activity actions
  const {
    addScheduledActivity,
    toggleActivityCompletion,
    updateScheduledActivity,
    addUserActivity
  } = useActivityActions(setScheduledActivities, setUserActivities, currentDog);

  // Activity operations hook
  const activityOps = useActivityOperations(
    scheduledActivities,
    userActivities,
    discoveredActivities,
    currentDog
  );

  // Discovery operations hook
  const discoveryOps = useDiscoveryOperations(
    discoveredActivities,
    setDiscoveredActivities,
    discoveryConfig,
    setDiscoveryConfig,
    currentDog
  );

  return (
    <ActivityContext.Provider
      value={{
        scheduledActivities,
        userActivities,
        discoveredActivities,
        discoveryConfig,
        isDiscovering: discoveryOps.isDiscovering,
        addScheduledActivity,
        toggleActivityCompletion,
        updateScheduledActivity,
        addUserActivity,
        getTodaysActivities: activityOps.getTodaysActivities,
        getActivityDetails: activityOps.getActivityDetails,
        getStreakData: activityOps.getStreakData,
        getWeeklyProgress: activityOps.getWeeklyProgress,
        getPillarBalance: activityOps.getPillarBalance,
        getDailyGoals: activityOps.getDailyGoals,
        getCombinedActivityLibrary: discoveryOps.getCombinedActivityLibrary,
        discoverNewActivities: discoveryOps.discoverNewActivities,
        approveDiscoveredActivity: discoveryOps.approveDiscoveredActivity,
        rejectDiscoveredActivity: discoveryOps.rejectDiscoveredActivity,
        updateDiscoveryConfig: discoveryOps.updateDiscoveryConfig
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

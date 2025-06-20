import React, { createContext, useContext } from "react";
import { ScheduledActivity, UserActivity } from "@/types/activity";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";
import { useDog } from "@/contexts/DogContext";
import { useActivityStateHook } from "@/hooks/useActivityState";

interface ActivityStateContextType {
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  discoveredActivities: DiscoveredActivity[];
  discoveryConfig: ContentDiscoveryConfig;
  setScheduledActivities: (
    activities:
      | ScheduledActivity[]
      | ((prev: ScheduledActivity[]) => ScheduledActivity[]),
  ) => void;
  setUserActivities: (
    activities: UserActivity[] | ((prev: UserActivity[]) => UserActivity[]),
  ) => void;
  setDiscoveredActivities: (activities: DiscoveredActivity[]) => void;
  setDiscoveryConfig: (config: ContentDiscoveryConfig) => void;
  isLoading: boolean;
}

const ActivityStateContext = createContext<
  ActivityStateContextType | undefined
>(undefined);

export const useActivityState = () => {
  const context = useContext(ActivityStateContext);
  if (!context) {
    throw new Error(
      "useActivityState must be used within an ActivityStateProvider",
    );
  }
  return context;
};

export const ActivityStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentDog } = useDog();

  const stateHookResult = useActivityStateHook(currentDog);

  const value: ActivityStateContextType = {
    scheduledActivities: stateHookResult.scheduledActivities,
    userActivities: stateHookResult.userActivities,
    discoveredActivities: stateHookResult.discoveredActivities,
    discoveryConfig: stateHookResult.discoveryConfig,
    setScheduledActivities: stateHookResult.setScheduledActivities,
    setUserActivities: stateHookResult.setUserActivities,
    setDiscoveredActivities: stateHookResult.setDiscoveredActivities,
    setDiscoveryConfig: stateHookResult.setDiscoveryConfig,
    isLoading: stateHookResult.isLoading,
  };

  return (
    <ActivityStateContext.Provider value={value}>
      {children}
    </ActivityStateContext.Provider>
  );
};

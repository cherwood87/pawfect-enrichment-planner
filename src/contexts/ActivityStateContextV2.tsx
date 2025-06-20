import React, { createContext, useContext, useMemo } from "react";
import { ScheduledActivity, UserActivity } from "@/types/activity";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";
import { useDog } from "@/contexts/DogContext";
import { useActivityStateV2 } from "@/hooks/useActivityStateV2";

// Split contexts to reduce re-renders
interface ActivityDataContextType {
  scheduledActivities: ScheduledActivity[];
  userActivities: UserActivity[];
  discoveredActivities: DiscoveredActivity[];
  discoveryConfig: ContentDiscoveryConfig;
  isLoading: boolean;
}

interface ActivityActionsContextType {
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
}

const ActivityDataContext = createContext<ActivityDataContextType | undefined>(
  undefined,
);
const ActivityActionsContext = createContext<
  ActivityActionsContextType | undefined
>(undefined);

export const useActivityData = () => {
  const context = useContext(ActivityDataContext);
  if (!context) {
    throw new Error(
      "useActivityData must be used within an ActivityStateV2Provider",
    );
  }
  return context;
};

export const useActivityActions = () => {
  const context = useContext(ActivityActionsContext);
  if (!context) {
    throw new Error(
      "useActivityActions must be used within an ActivityStateV2Provider",
    );
  }
  return context;
};

// Combine hook for backward compatibility
export const useActivityStateV2Context = () => {
  const data = useActivityData();
  const actions = useActivityActions();
  return { ...data, ...actions };
};

export const ActivityStateV2Provider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { currentDog } = useDog();

  const stateHookResult = useActivityStateV2(currentDog);

  // Memoize data context value to prevent re-renders when actions change
  const dataValue = useMemo<ActivityDataContextType>(
    () => ({
      scheduledActivities: stateHookResult.scheduledActivities,
      userActivities: stateHookResult.userActivities,
      discoveredActivities: stateHookResult.discoveredActivities,
      discoveryConfig: stateHookResult.discoveryConfig,
      isLoading: stateHookResult.isLoading,
    }),
    [
      stateHookResult.scheduledActivities,
      stateHookResult.userActivities,
      stateHookResult.discoveredActivities,
      stateHookResult.discoveryConfig,
      stateHookResult.isLoading,
    ],
  );

  // Memoize actions context value to prevent re-renders when data changes
  const actionsValue = useMemo<ActivityActionsContextType>(
    () => ({
      setScheduledActivities: stateHookResult.setScheduledActivities,
      setUserActivities: stateHookResult.setUserActivities,
      setDiscoveredActivities: stateHookResult.setDiscoveredActivities,
      setDiscoveryConfig: stateHookResult.setDiscoveryConfig,
    }),
    [
      stateHookResult.setScheduledActivities,
      stateHookResult.setUserActivities,
      stateHookResult.setDiscoveredActivities,
      stateHookResult.setDiscoveryConfig,
    ],
  );

  return (
    <ActivityDataContext.Provider value={dataValue}>
      <ActivityActionsContext.Provider value={actionsValue}>
        {children}
      </ActivityActionsContext.Provider>
    </ActivityDataContext.Provider>
  );
};

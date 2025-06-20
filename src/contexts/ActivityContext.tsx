import React, { createContext, useContext } from "react";
import { ActivityContextType } from "@/types/activityContext";
import {
  ActivityStateProvider,
  useActivityState,
} from "./ActivityStateContext";
import {
  ActivityOperationsProvider,
  useActivityOperations,
} from "./ActivityOperationsContext";
import { SyncProvider, useSync } from "./SyncContext";
import { DiscoveryProvider, useDiscovery } from "./DiscoveryContext";

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined,
);

// Backward compatible hook that combines all contexts
export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
};

// Internal component that combines all context values
const ActivityContextAggregator: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stateContext = useActivityState();
  const operationsContext = useActivityOperations();
  const syncContext = useSync();
  const discoveryContext = useDiscovery();

  // Combine all contexts into the original ActivityContextType interface
  const contextValue: ActivityContextType = {
    // State
    scheduledActivities: stateContext.scheduledActivities,
    userActivities: stateContext.userActivities,
    discoveredActivities: stateContext.discoveredActivities,
    discoveryConfig: stateContext.discoveryConfig,

    // Operations
    addScheduledActivity: operationsContext.addScheduledActivity,
    toggleActivityCompletion: operationsContext.toggleActivityCompletion,
    updateScheduledActivity: operationsContext.updateScheduledActivity,
    addUserActivity: operationsContext.addUserActivity,
    getTodaysActivities: operationsContext.getTodaysActivities,
    getActivityDetails: operationsContext.getActivityDetails,
    getStreakData: operationsContext.getStreakData,
    getWeeklyProgress: operationsContext.getWeeklyProgress,
    getPillarBalance: operationsContext.getPillarBalance,
    getDailyGoals: operationsContext.getDailyGoals,

    // Discovery
    isDiscovering: discoveryContext.isDiscovering,
    getCombinedActivityLibrary: discoveryContext.getCombinedActivityLibrary,
    discoverNewActivities: discoveryContext.discoverNewActivities,
    approveDiscoveredActivity: discoveryContext.approveDiscoveredActivity,
    rejectDiscoveredActivity: discoveryContext.rejectDiscoveredActivity,
    updateDiscoveryConfig: discoveryContext.updateDiscoveryConfig,
    checkAndRunAutoDiscovery: discoveryContext.checkAndRunAutoDiscovery,

    // Sync
    isSyncing: syncContext.isSyncing,
    lastSyncTime: syncContext.lastSyncTime,
    syncToSupabase: syncContext.syncToSupabase,
  };

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
};

// Main provider that composes all sub-providers
export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ActivityStateProvider>
      <ActivityOperationsProvider>
        <SyncProvider>
          <DiscoveryProvider>
            <ActivityContextAggregator>{children}</ActivityContextAggregator>
          </DiscoveryProvider>
        </SyncProvider>
      </ActivityOperationsProvider>
    </ActivityStateProvider>
  );
};

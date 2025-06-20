import React, { createContext, useContext, useState } from "react";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";
import { ActivityLibraryItem } from "@/types/activity";
import { useDog } from "@/contexts/DogContext";
import { useActivityState } from "./ActivityStateContext";
import { useDiscoveryOperations } from "@/hooks/core/useDiscoveryOperations";

interface DiscoveryContextType {
  isDiscovering: boolean;
  getCombinedActivityLibrary: () => (
    | ActivityLibraryItem
    | DiscoveredActivity
  )[];
  discoverNewActivities: () => Promise<void>;
  approveDiscoveredActivity: (activityId: string) => void;
  rejectDiscoveredActivity: (activityId: string) => void;
  updateDiscoveryConfig: (config: Partial<ContentDiscoveryConfig>) => void;
  checkAndRunAutoDiscovery?: () => Promise<void>;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(
  undefined,
);

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
};

export const DiscoveryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentDog } = useDog();
  const {
    discoveredActivities,
    discoveryConfig,
    setDiscoveredActivities,
    setDiscoveryConfig,
  } = useActivityState();

  const [isDiscovering, setIsDiscovering] = useState(false);

  const discoveryOps = useDiscoveryOperations(
    discoveredActivities,
    discoveryConfig,
    currentDog,
    setDiscoveredActivities,
    setDiscoveryConfig,
  );

  const discoverNewActivities = async () => {
    setIsDiscovering(true);
    try {
      await discoveryOps.discoverNewActivities();
    } finally {
      setIsDiscovering(false);
    }
  };

  const approveDiscoveredActivity = async (activityId: string) => {
    await discoveryOps.approveDiscoveredActivity(activityId);
  };

  const rejectDiscoveredActivity = async (activityId: string) => {
    await discoveryOps.rejectDiscoveredActivity(activityId);
  };

  const updateDiscoveryConfig = async (
    updates: Partial<ContentDiscoveryConfig>,
  ) => {
    await discoveryOps.updateDiscoveryConfig(updates);
  };

  const value: DiscoveryContextType = {
    isDiscovering,
    getCombinedActivityLibrary: discoveryOps.getCombinedActivityLibrary,
    discoverNewActivities,
    approveDiscoveredActivity,
    rejectDiscoveredActivity,
    updateDiscoveryConfig,
    checkAndRunAutoDiscovery: discoveryOps.checkAndRunAutoDiscovery,
  };

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
};

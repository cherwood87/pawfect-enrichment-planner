import { useCallback } from "react";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";
import { ActivityLibraryItem } from "@/types/activity";
import { Dog } from "@/types/dog";
import { DiscoveryService } from "@/services/core/DiscoveryService";

export const useDiscoveryOperations = (
  discoveredActivities: DiscoveredActivity[],
  discoveryConfig: ContentDiscoveryConfig,
  currentDog: Dog | null,
  setDiscoveredActivities: (activities: DiscoveredActivity[]) => void,
  setDiscoveryConfig: (config: ContentDiscoveryConfig) => void,
) => {
  const getCombinedActivityLibrary = useCallback((): (
    | ActivityLibraryItem
    | DiscoveredActivity
  )[] => {
    return DiscoveryService.getCombinedActivityLibrary(discoveredActivities);
  }, [discoveredActivities]);

  const discoverNewActivities = useCallback(async (): Promise<void> => {
    if (!currentDog) return;

    try {
      const newActivities = await DiscoveryService.discoverNewActivities(
        discoveredActivities,
        discoveryConfig,
        currentDog,
      );

      if (newActivities.length > 0) {
        setDiscoveredActivities([...discoveredActivities, ...newActivities]);
      }
    } catch (error) {
      console.error("Discovery failed:", error);
      throw error;
    }
  }, [
    discoveredActivities,
    discoveryConfig,
    currentDog,
    setDiscoveredActivities,
  ]);

  const approveDiscoveredActivity = useCallback(
    async (activityId: string): Promise<void> => {
      if (!currentDog) return;

      const updated = await DiscoveryService.approveActivity(
        activityId,
        discoveredActivities,
        currentDog.id,
      );
      setDiscoveredActivities(updated);
    },
    [discoveredActivities, currentDog, setDiscoveredActivities],
  );

  const rejectDiscoveredActivity = useCallback(
    async (activityId: string): Promise<void> => {
      if (!currentDog) return;

      const updated = await DiscoveryService.rejectActivity(
        activityId,
        discoveredActivities,
        currentDog.id,
      );
      setDiscoveredActivities(updated);
    },
    [discoveredActivities, currentDog, setDiscoveredActivities],
  );

  const updateDiscoveryConfig = useCallback(
    async (updates: Partial<ContentDiscoveryConfig>): Promise<void> => {
      if (!currentDog) return;

      const updated = await DiscoveryService.updateDiscoveryConfig(
        currentDog.id,
        discoveryConfig,
        updates,
      );
      setDiscoveryConfig(updated);
    },
    [currentDog, discoveryConfig, setDiscoveryConfig],
  );

  const checkAndRunAutoDiscovery = useCallback(async (): Promise<void> => {
    if (
      !currentDog ||
      !DiscoveryService.shouldRunAutoDiscovery(discoveryConfig)
    )
      return;

    await discoverNewActivities();
  }, [currentDog, discoveryConfig, discoverNewActivities]);

  return {
    getCombinedActivityLibrary,
    discoverNewActivities,
    approveDiscoveredActivity,
    rejectDiscoveredActivity,
    updateDiscoveryConfig,
    checkAndRunAutoDiscovery,
  };
};

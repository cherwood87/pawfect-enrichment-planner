import { useState } from "react";
import { DiscoveredActivity, ContentDiscoveryConfig } from "@/types/discovery";
import { ActivityLibraryItem } from "@/types/activity";
import { Dog } from "@/types/dog";
import { DiscoveryDomainService } from "@/services/domain/DiscoveryDomainService";

export const useDiscoveryOperations = (
  discoveredActivities: DiscoveredActivity[],
  setDiscoveredActivities: (activities: DiscoveredActivity[]) => void,
  discoveryConfig: ContentDiscoveryConfig,
  setDiscoveryConfig: (config: ContentDiscoveryConfig) => void,
  currentDog: Dog | null,
) => {
  const [isDiscovering, setIsDiscovering] = useState(false);

  const getCombinedActivityLibrary = (): (
    | ActivityLibraryItem
    | DiscoveredActivity
  )[] => {
    return DiscoveryDomainService.getCombinedActivityLibrary(
      discoveredActivities,
    );
  };

  const discoverNewActivities = async (): Promise<void> => {
    if (!currentDog || isDiscovering) {
      console.log("Discovery skipped: no dog or already discovering");
      return;
    }

    setIsDiscovering(true);

    try {
      const newActivities = await DiscoveryDomainService.discoverNewActivities(
        discoveredActivities,
        discoveryConfig,
        currentDog,
      );

      if (newActivities.length > 0) {
        const updatedDiscovered = [...discoveredActivities, ...newActivities];
        setDiscoveredActivities(updatedDiscovered);

        const updatedConfig = {
          ...discoveryConfig,
          lastDiscoveryRun: new Date().toISOString(),
        };
        setDiscoveryConfig(updatedConfig);

        console.log(
          `All ${newActivities.length} activities automatically added to library`,
        );
      }
    } catch (error) {
      console.error("Discovery failed:", error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const checkAndRunAutoDiscovery = async () => {
    if (!currentDog || isDiscovering) {
      console.log(
        "Auto-discovery skipped: no current dog or already discovering",
      );
      return;
    }

    const shouldRun =
      DiscoveryDomainService.shouldRunAutoDiscovery(discoveryConfig);
    if (shouldRun) {
      console.log("Running automatic weekly discovery...");
      await discoverNewActivities();
    } else {
      console.log("Auto-discovery not needed at this time");
    }
  };

  const approveDiscoveredActivity = async (activityId: string) => {
    if (!currentDog) return;

    try {
      const updated = await DiscoveryDomainService.approveDiscoveredActivity(
        activityId,
        discoveredActivities,
        currentDog.id,
      );
      setDiscoveredActivities(updated);
    } catch (error) {
      console.error("Failed to approve activity:", error);
    }
  };

  const rejectDiscoveredActivity = async (activityId: string) => {
    if (!currentDog) return;

    try {
      const updated = await DiscoveryDomainService.rejectDiscoveredActivity(
        activityId,
        discoveredActivities,
        currentDog.id,
      );
      setDiscoveredActivities(updated);
    } catch (error) {
      console.error("Failed to reject activity:", error);
    }
  };

  const updateDiscoveryConfig = async (
    config: Partial<ContentDiscoveryConfig>,
  ) => {
    if (!currentDog) return;

    try {
      const updated = await DiscoveryDomainService.updateDiscoveryConfig(
        currentDog.id,
        discoveryConfig,
        config,
      );
      setDiscoveryConfig(updated);
    } catch (error) {
      console.error("Failed to update discovery config:", error);
    }
  };

  return {
    isDiscovering,
    getCombinedActivityLibrary,
    discoverNewActivities,
    approveDiscoveredActivity,
    rejectDiscoveredActivity,
    updateDiscoveryConfig,
    checkAndRunAutoDiscovery,
  };
};

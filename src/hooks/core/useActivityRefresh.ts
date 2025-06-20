import { useCallback } from "react";
import { ScheduledActivity } from "@/types/activity";
import { Dog } from "@/types/dog";
import { ActivityDomainService } from "@/services/domain/ActivityDomainService";
import { handleError } from "@/utils/errorUtils";

/**
 * Hook for refreshing activity data from the domain service
 */
export const useActivityRefresh = (
  setScheduledActivities: (
    activities:
      | ScheduledActivity[]
      | ((prev: ScheduledActivity[]) => ScheduledActivity[]),
  ) => void,
  currentDog: Dog | null,
) => {
  const refreshScheduledActivities = useCallback(async () => {
    if (!currentDog) return;

    console.log(
      "🔄 [useActivityRefresh] Refreshing scheduled activities for dog:",
      currentDog.name,
    );

    try {
      const activities =
        await ActivityDomainService.getScheduledActivitiesForDog(currentDog.id);
      console.log(
        "✅ [useActivityRefresh] Refreshed activities:",
        activities.length,
        "activities found",
      );
      setScheduledActivities(activities);
    } catch (error) {
      console.error(
        "❌ [useActivityRefresh] Failed to refresh scheduled activities:",
        error,
      );
      handleError(error as Error, "refreshScheduledActivities", false);
    }
  }, [currentDog, setScheduledActivities]);

  return {
    refreshScheduledActivities,
  };
};

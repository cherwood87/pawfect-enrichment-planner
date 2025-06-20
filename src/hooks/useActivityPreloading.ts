import { useEffect, useCallback, useRef } from "react";
import { ActivityLibraryItem } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";

interface PreloadConfig {
  enabled: boolean;
  preloadCount: number;
  intersectionThreshold: number;
}

export const useActivityPreloading = (
  activities: (ActivityLibraryItem | DiscoveredActivity)[],
  config: PreloadConfig = {
    enabled: true,
    preloadCount: 10,
    intersectionThreshold: 0.1,
  },
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const preloadedRef = useRef<Set<string>>(new Set());
  const preloadCallbacksRef = useRef<Map<string, () => void>>(new Map());

  // Preload activity details
  const preloadActivity = useCallback(
    (activity: ActivityLibraryItem | DiscoveredActivity) => {
      if (preloadedRef.current.has(activity.id)) return;

      // Mark as preloaded
      preloadedRef.current.add(activity.id);

      // Preload any heavy resources (images, etc.)
      if ("materials" in activity && activity.materials) {
        activity.materials.forEach((material) => {
          // Preload images in materials if they're URLs
          if (
            typeof material === "string" &&
            material.match(/\.(jpg|jpeg|png|gif|webp)$/i)
          ) {
            const img = new Image();
            img.src = material;
          }
        });
      }

      // Execute any registered preload callbacks
      const callback = preloadCallbacksRef.current.get(activity.id);
      if (callback) {
        callback();
      }
    },
    [],
  );

  // Register element for preloading
  const registerForPreloading = useCallback(
    (
      element: Element | null,
      activity: ActivityLibraryItem | DiscoveredActivity,
      callback?: () => void,
    ) => {
      if (!config.enabled || !element || !observerRef.current) return;

      if (callback) {
        preloadCallbacksRef.current.set(activity.id, callback);
      }

      observerRef.current.observe(element);
    },
    [config.enabled],
  );

  // Unregister element
  const unregisterFromPreloading = useCallback(
    (element: Element | null, activityId: string) => {
      if (!element || !observerRef.current) return;

      observerRef.current.unobserve(element);
      preloadCallbacksRef.current.delete(activityId);
    },
    [],
  );

  // Preload next batch of activities
  const preloadNextBatch = useCallback(
    (currentIndex: number) => {
      const startIndex = currentIndex + 1;
      const endIndex = Math.min(
        startIndex + config.preloadCount,
        activities.length,
      );

      for (let i = startIndex; i < endIndex; i++) {
        preloadActivity(activities[i]);
      }
    },
    [activities, config.preloadCount, preloadActivity],
  );

  // Setup intersection observer
  useEffect(() => {
    if (!config.enabled) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find the activity index
            const activityId = entry.target.getAttribute("data-activity-id");
            if (activityId) {
              const activityIndex = activities.findIndex(
                (a) => a.id === activityId,
              );
              if (activityIndex >= 0) {
                preloadActivity(activities[activityIndex]);
                preloadNextBatch(activityIndex);
              }
            }
          }
        });
      },
      {
        threshold: config.intersectionThreshold,
        rootMargin: "50px",
      },
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    config.enabled,
    config.intersectionThreshold,
    activities,
    preloadActivity,
    preloadNextBatch,
  ]);

  // Clear preloaded cache when activities change
  useEffect(() => {
    preloadedRef.current.clear();
    preloadCallbacksRef.current.clear();
  }, [activities]);

  return {
    registerForPreloading,
    unregisterFromPreloading,
    preloadActivity,
    preloadNextBatch,
    isPreloaded: (activityId: string) => preloadedRef.current.has(activityId),
  };
};

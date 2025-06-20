import { useMemo, useCallback } from "react";
import { ActivityLibraryItem } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { useActivityCaching } from "./useActivityCaching";

// Pre-compiled regex for better performance
const createSearchRegex = (query: string): RegExp | null => {
  if (!query.trim()) return null;
  try {
    return new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  } catch {
    return null;
  }
};

// Optimized search function with early returns
const searchActivity = (
  activity: ActivityLibraryItem | DiscoveredActivity,
  searchRegex: RegExp | null,
): boolean => {
  if (!searchRegex) return true;

  // Check title first (most common match)
  if (searchRegex.test(activity.title)) return true;

  // Check pillar
  if (searchRegex.test(activity.pillar)) return true;

  // Check difficulty
  if (searchRegex.test(activity.difficulty)) return true;

  // Check materials (if exists)
  if (activity.materials?.some((material) => searchRegex.test(material)))
    return true;

  // Check tags (if exists)
  if (activity.tags?.some((tag) => searchRegex.test(tag))) return true;

  return false;
};

export const useOptimizedFiltering = (
  searchQuery: string,
  selectedPillar: string,
  selectedDifficulty: string,
  activities: (ActivityLibraryItem | DiscoveredActivity)[],
) => {
  const { cacheFilteredResults, getCachedFilteredResults } =
    useActivityCaching();

  // Memoized search regex
  const searchRegex = useMemo(
    () => createSearchRegex(searchQuery),
    [searchQuery],
  );

  // Optimized filtering with caching
  const filteredActivities = useMemo(() => {
    // Check cache first
    const cached = getCachedFilteredResults(
      searchQuery,
      selectedPillar,
      selectedDifficulty,
    );
    if (cached) {
      return cached;
    }

    // Apply filters with optimizations
    let filtered = activities;

    // Apply pillar filter first (usually most selective)
    if (selectedPillar !== "all") {
      filtered = filtered.filter(
        (activity) => activity.pillar === selectedPillar,
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (activity) => activity.difficulty === selectedDifficulty,
      );
    }

    // Apply search filter last (most expensive)
    if (searchRegex) {
      filtered = filtered.filter((activity) =>
        searchActivity(activity, searchRegex),
      );
    }

    // Cache the results
    cacheFilteredResults(
      searchQuery,
      selectedPillar,
      selectedDifficulty,
      filtered,
    );

    return filtered;
  }, [
    activities,
    searchQuery,
    selectedPillar,
    selectedDifficulty,
    searchRegex,
    getCachedFilteredResults,
    cacheFilteredResults,
  ]);

  // Debounced search for real-time filtering
  const debouncedFilter = useCallback(
    (query: string, pillar: string, difficulty: string) => {
      // This would be used for instant search feedback
      const regex = createSearchRegex(query);

      return activities.filter((activity) => {
        if (pillar !== "all" && activity.pillar !== pillar) return false;
        if (difficulty !== "all" && activity.difficulty !== difficulty)
          return false;
        if (regex && !searchActivity(activity, regex)) return false;
        return true;
      });
    },
    [activities],
  );

  return {
    filteredActivities,
    debouncedFilter,
    totalCount: activities.length,
    filteredCount: filteredActivities.length,
  };
};

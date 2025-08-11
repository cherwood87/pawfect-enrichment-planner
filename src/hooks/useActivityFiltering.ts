
import { useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { searchCombinedActivities } from '@/data/activityLibrary';

export const useActivityFiltering = (
  searchQuery: string,
  selectedPillar: string,
  selectedDifficulty: string,
  currentActivities: (ActivityLibraryItem | DiscoveredActivity)[],
  discoveredActivities: DiscoveredActivity[]
) => {
  const filteredActivities = useMemo(() => {
    // Use performance timing for debugging
    const start = performance.now();
    
    let activities = searchQuery ? searchCombinedActivities(searchQuery, discoveredActivities) : currentActivities;
    
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }
    
    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    const end = performance.now();
    if (end - start > 10) {
      console.warn(`🐌 Slow activity filtering: ${(end - start).toFixed(1)}ms for ${activities.length} activities`);
    }
    
    return activities;
  }, [searchQuery, selectedPillar, selectedDifficulty, currentActivities, discoveredActivities]);

  return filteredActivities;
};

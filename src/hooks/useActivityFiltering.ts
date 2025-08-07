
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
    let activities = searchQuery ? searchCombinedActivities(searchQuery, discoveredActivities) : currentActivities;
    
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }
    
    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    return activities;
  }, [searchQuery, selectedPillar, selectedDifficulty, currentActivities, discoveredActivities]);

  return filteredActivities;
};


import { useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { searchCombinedActivities } from '@/data/activityLibrary';
import { ActivityRecommendationService } from '@/services/domain/ActivityRecommendationService';

export const useActivityFiltering = (
  searchQuery: string,
  selectedPillar: string,
  selectedDifficulty: string,
  currentActivities: (ActivityLibraryItem | DiscoveredActivity)[],
  discoveredActivities: DiscoveredActivity[],
  currentDog?: Dog | null
) => {
  const filteredActivities = useMemo(() => {
    const start = performance.now();
    
    let activities = searchQuery ? searchCombinedActivities(searchQuery, discoveredActivities) : currentActivities;
    
    // Apply pillar and difficulty filters
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }
    
    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    // Apply personalized ranking if dog profile exists
    if (currentDog && !searchQuery && selectedPillar === 'all' && selectedDifficulty === 'all') {
      activities = ActivityRecommendationService.getPersonalizedActivities(activities, currentDog, activities.length);
    }
    
    const end = performance.now();
    if (end - start > 10) {
      console.warn(`🐌 Slow activity filtering: ${(end - start).toFixed(1)}ms for ${activities.length} activities`);
    }
    
    return activities;
  }, [searchQuery, selectedPillar, selectedDifficulty, currentActivities, discoveredActivities, currentDog]);

  return filteredActivities;
};

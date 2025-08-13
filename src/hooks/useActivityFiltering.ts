
import { useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { ActivityRecommendationService } from '@/services/domain/ActivityRecommendationService';

export const useActivityFiltering = (
  selectedPillar: string,
  selectedDifficulty: string,
  selectedDuration: string,
  currentActivities: (ActivityLibraryItem | DiscoveredActivity)[],
  currentDog?: Dog | null
) => {
  const filteredActivities = useMemo(() => {
    const start = performance.now();

    let activities = currentActivities;

    // Apply pillar and difficulty filters
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }

    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }

    // Apply duration filters
    if (selectedDuration !== 'all') {
      activities = activities.filter(activity => {
        const d = activity.duration ?? 0;
        switch (selectedDuration) {
          case '5':
            return d <= 5;
          case '15':
            return d <= 15;
          case '30':
            return d <= 30;
          case '30plus':
            return d >= 30;
          default:
            return true;
        }
      });
    }

    // Apply personalized ranking if dog profile exists and no filters
    if (
      currentDog &&
      selectedPillar === 'all' &&
      selectedDifficulty === 'all' &&
      selectedDuration === 'all'
    ) {
      activities = ActivityRecommendationService.getPersonalizedActivities(
        activities,
        currentDog,
        activities.length
      );
    }

    const end = performance.now();
    if (end - start > 10) {
      console.warn(`🐌 Slow activity filtering: ${(end - start).toFixed(1)}ms for ${activities.length} activities`);
    }

    return activities;
  }, [selectedPillar, selectedDifficulty, selectedDuration, currentActivities, currentDog]);

  return filteredActivities;
};

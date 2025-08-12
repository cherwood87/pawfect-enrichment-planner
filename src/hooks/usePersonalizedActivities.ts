import { useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { ActivityRecommendationService } from '@/services/domain/ActivityRecommendationService';

export const usePersonalizedActivities = (
  activities: (ActivityLibraryItem | DiscoveredActivity)[],
  currentDog: Dog | null,
  limit: number = 20
) => {
  const personalizedActivities = useMemo(() => {
    if (!currentDog) {
      return activities.slice(0, limit);
    }
    
    return ActivityRecommendationService.getPersonalizedActivities(activities, currentDog, limit);
  }, [activities, currentDog, limit]);

  const quizPersonalityContext = useMemo(() => {
    if (!currentDog) return null;
    return ActivityRecommendationService.getQuizPersonalityContext(currentDog);
  }, [currentDog]);

  return {
    personalizedActivities,
    quizPersonalityContext,
    hasQuizResults: !!currentDog?.quizResults
  };
};
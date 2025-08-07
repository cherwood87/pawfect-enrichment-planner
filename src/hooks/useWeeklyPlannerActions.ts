
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useActivity } from '@/contexts/ActivityContext';
import { ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

export const useWeeklyPlannerActions = () => {
  const { toast } = useToast();
  const { 
    toggleActivityCompletion, 
    getCombinedActivityLibrary, 
    userActivities, 
    discoveredActivities 
  } = useActivity();

  const getActivityDetails = useCallback((activityId: string): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined => {
    const allActivities = [...getCombinedActivityLibrary(), ...userActivities, ...discoveredActivities];
    return allActivities.find(activity => activity.id === activityId);
  }, [getCombinedActivityLibrary, userActivities, discoveredActivities]);

  const handleToggleCompletion = useCallback(async (activityId: string) => {
    try {
      await toggleActivityCompletion(activityId);
      toast({
        title: "Activity Updated!",
        description: "Activity completion status has been updated.",
      });
    } catch (error) {
      console.error("Error toggling activity completion:", error);
      toast({
        title: "Error",
        description: "Failed to update activity completion status. Please try again.",
        variant: "destructive",
      });
    }
  }, [toggleActivityCompletion, toast]);

  return {
    getActivityDetails,
    handleToggleCompletion
  };
};

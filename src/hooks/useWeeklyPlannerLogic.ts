
import { useState, useEffect, useCallback } from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import { WeekUtils } from '@/utils/weekUtils';

export const useWeeklyPlannerLogic = (currentWeekStartDate: Date) => {
  const { currentDog } = useDog();
  const { scheduledActivities } = useActivity();
  const [weeklyActivities, setWeeklyActivities] = useState<ScheduledActivity[]>([]);

  const currentWeekNumber = WeekUtils.getISOWeek(currentWeekStartDate);

  // Load activities for the current week with enhanced filtering logic
  useEffect(() => {
    if (currentDog) {
      const filteredActivities = scheduledActivities.filter(activity => {
        const matchesDog = activity.dogId === currentDog.id;
        const matchesWeek = activity.weekNumber === currentWeekNumber;
        
        // Additional validation: check if the scheduled date is actually in the current week
        const activityDate = new Date(activity.scheduledDate);
        const isInCurrentWeek = WeekUtils.isSameWeek(activityDate, currentWeekStartDate);
        
        return matchesDog && matchesWeek && isInCurrentWeek;
      });
      
      setWeeklyActivities(filteredActivities);
    } else {
      setWeeklyActivities([]);
    }
  }, [scheduledActivities, currentDog, currentWeekNumber, currentWeekStartDate]);

  // Calculate completion status for each day
  const getDayCompletionStatus = useCallback((dayIndex: number): { completed: boolean, activity: ScheduledActivity | undefined } => {
    const dayActivities = weeklyActivities.filter(activity => activity.dayOfWeek === dayIndex);
    
    if (dayActivities.length === 0) return { completed: false, activity: undefined };
    const completed = dayActivities.every(activity => activity.completed);
    return { completed, activity: dayActivities[0] };
  }, [weeklyActivities]);

  return {
    weeklyActivities,
    currentWeekNumber,
    getDayCompletionStatus
  };
};

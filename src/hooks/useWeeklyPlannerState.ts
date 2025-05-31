
import { useState, useMemo } from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const useWeeklyPlannerState = () => {
  const { scheduledActivities } = useActivity();
  const { currentDog } = useDog();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Get start of week (Sunday)
  const startOfWeek = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    return new Date(date.setDate(date.getDate() - day));
  }, [currentDate]);

  // Build structure: [{ label, date, activities }]
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      return {
        label: DAY_LABELS[dayDate.getDay()],
        date: new Date(dayDate), // clone
        activities: scheduledActivities.filter(
          a => new Date(a.scheduledDate).toDateString() === dayDate.toDateString() &&
            (!currentDog || a.dogId === currentDog.id)
        ),
      };
    });
  }, [startOfWeek, scheduledActivities, currentDog]);

  const allWeekActivities = weekDays.flatMap(day => day.activities);

  // Progress summary (used in header and summary)
  const completedActivities = allWeekActivities.filter(a => 
    optimisticUpdates[a.id] !== undefined ? optimisticUpdates[a.id] : a.completed
  ).length;
  const totalActivities = allWeekActivities.length;

  // Get current week and year for header
  const getWeekOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  };

  const currentWeek = getWeekOfYear(startOfWeek);
  const currentYear = startOfWeek.getFullYear();

  // Check if this is the initial load with no activities ever scheduled
  const hasNeverScheduledActivities = scheduledActivities.length === 0;

  return {
    currentDate,
    setCurrentDate,
    selectedActivity,
    setSelectedActivity,
    isModalOpen,
    setIsModalOpen,
    viewMode,
    setViewMode,
    optimisticUpdates,
    setOptimisticUpdates,
    loadingStates,
    setLoadingStates,
    startOfWeek,
    weekDays,
    allWeekActivities,
    completedActivities,
    totalActivities,
    currentWeek,
    currentYear,
    hasNeverScheduledActivities
  };
};


import { useState, useMemo, useCallback } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useChat } from '@/contexts/ChatContext';
import { ScheduledActivity } from '@/types/activity';

export const useWeeklyPlannerLogic = (onChatOpen?: () => void) => {
  const {
    scheduledActivities,
    toggleActivityCompletion,
    getActivityDetails
  } = useActivity();
  const { currentDog } = useDog();
  const { loadConversation, sendMessage } = useChat();

  // Always show current week for week view
  const [currentWeek] = useState(getISOWeek(new Date()));
  const [currentYear] = useState(new Date().getFullYear());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('day');
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get ISO week number
  function getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + (4 - target.getDay() + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  // Memoize week activities calculation
  const weekActivities = useMemo(() => 
    scheduledActivities.filter(activity => activity.weekNumber === currentWeek && activity.dogId === currentDog?.id),
    [scheduledActivities, currentWeek, currentDog?.id]
  );

  // Memoize computed values - for day view, only count current day's activities
  const { totalActivities, completedActivities } = useMemo(() => {
    if (viewMode === 'day') {
      const currentDayIndex = currentDate.getDay();
      const dayActivities = weekActivities.filter(activity => activity.dayOfWeek === currentDayIndex);
      return {
        totalActivities: dayActivities.length,
        completedActivities: dayActivities.filter(a => a.completed).length
      };
    }
    return {
      totalActivities: weekActivities.length,
      completedActivities: weekActivities.filter(a => a.completed).length
    };
  }, [weekActivities, viewMode, currentDate]);

  // No week navigation needed for week view since it always shows current week
  const navigateWeek = useCallback(() => {
    // No-op since week view always shows current week
  }, []);

  const navigateDay = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleViewModeChange = useCallback((mode: 'week' | 'day') => {
    setViewMode(mode);
    
    // When switching to day view, set current date to today
    if (mode === 'day') {
      setCurrentDate(new Date());
    }
  }, []);

  const handleActivityClick = useCallback((activity: ScheduledActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, []);

  const handleNeedHelp = useCallback(async () => {
    if (!selectedActivity || !currentDog) return;
    const activityDetails = getActivityDetails(selectedActivity.activityId);
    if (!activityDetails) return;

    // Start a new activity-help conversation
    loadConversation(currentDog.id, 'activity-help');

    // Prepare activity context for the AI coach
    const activityContext = {
      activityName: activityDetails.title,
      activityPillar: activityDetails.pillar,
      activityDifficulty: activityDetails.difficulty,
      activityDuration: activityDetails.duration
    };

    // Send initial help message with activity context
    const helpMessage = `I need help with the "${activityDetails.title}" activity. Can you provide step-by-step guidance and tips for this ${activityDetails.pillar} enrichment activity?`;
    try {
      await sendMessage(helpMessage, activityContext);

      // Close the modal and open chat
      handleModalClose();
      if (onChatOpen) {
        onChatOpen();
      }
    } catch (error) {
      console.error('Error starting help conversation:', error);
    }
  }, [selectedActivity, currentDog, getActivityDetails, loadConversation, sendMessage, handleModalClose, onChatOpen]);

  return {
    currentWeek,
    currentYear,
    currentDate,
    viewMode,
    selectedActivity,
    isModalOpen,
    weekActivities,
    totalActivities,
    completedActivities,
    toggleActivityCompletion,
    getActivityDetails,
    navigateWeek,
    navigateDay,
    handleViewModeChange,
    handleActivityClick,
    handleModalClose,
    handleNeedHelp,
    // Export target context for ActivityCard
    getTargetWeek: () => viewMode === 'day' ? getISOWeek(currentDate) : currentWeek,
    getTargetDate: () => currentDate
  };
};

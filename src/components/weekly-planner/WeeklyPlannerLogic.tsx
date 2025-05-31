
import React, { useCallback } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useWeeklyPlannerState } from '@/hooks/useWeeklyPlannerState';
import { useWeeklyPlannerActions } from '@/hooks/useWeeklyPlannerActions';
import EmptyWeeklyPlanner from './EmptyWeeklyPlanner';
import WeeklyPlannerView from './WeeklyPlannerView';

interface WeeklyPlannerLogicProps {
  onPillarSelect: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerLogic: React.FC<WeeklyPlannerLogicProps> = ({ onPillarSelect }) => {
  const { getActivityDetails } = useActivity();
  
  const {
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
    weekDays,
    allWeekActivities,
    completedActivities,
    totalActivities,
    currentWeek,
    currentYear,
    hasNeverScheduledActivities
  } = useWeeklyPlannerState();

  const { handleToggleCompletion, isRetrying } = useWeeklyPlannerActions(
    allWeekActivities,
    optimisticUpdates,
    loadingStates,
    setOptimisticUpdates,
    setLoadingStates
  );

  // Navigation handlers
  const handleDayChange = useCallback((direction: 'prev' | 'next') => {
    const next = new Date(currentDate);
    if (direction === 'prev') next.setDate(currentDate.getDate() - 1);
    if (direction === 'next') next.setDate(currentDate.getDate() + 1);
    setCurrentDate(next);
  }, [currentDate]);

  const handleViewModeChange = (mode: 'week' | 'day') => {
    setViewMode(mode);
    if (mode === 'day') setCurrentDate(new Date());
  };

  // Activity modal handlers
  const handleActivityClick = useCallback((activity: any) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedActivity(null);
    setIsModalOpen(false);
  }, []);

  // Show full empty planner only if user has never scheduled any activities
  if (hasNeverScheduledActivities) {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  // Apply optimistic updates to activities for display
  const weekDaysWithOptimisticUpdates = weekDays.map(day => ({
    ...day,
    activities: day.activities.map(activity => ({
      ...activity,
      completed: optimisticUpdates[activity.id] !== undefined ? optimisticUpdates[activity.id] : activity.completed
    }))
  }));

  return (
    <WeeklyPlannerView
      completedActivities={completedActivities}
      totalActivities={totalActivities}
      currentWeek={currentWeek}
      currentYear={currentYear}
      currentDate={currentDate}
      viewMode={viewMode}
      weekDays={weekDaysWithOptimisticUpdates}
      selectedActivity={selectedActivity}
      isModalOpen={isModalOpen}
      loadingStates={loadingStates}
      isRetrying={isRetrying}
      onNavigateWeek={() => {}}
      onNavigateDay={handleDayChange}
      onViewModeChange={handleViewModeChange}
      onActivityClick={handleActivityClick}
      onToggleCompletion={handleToggleCompletion}
      onModalClose={handleModalClose}
      getActivityDetails={getActivityDetails}
    />
  );
};

export default WeeklyPlannerLogic;

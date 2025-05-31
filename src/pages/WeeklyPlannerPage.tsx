
import React, { useState, useCallback } from 'react';
import { useWeeklyPlannerState } from '@/hooks/useWeeklyPlannerState';
import { useWeeklyPlannerActions } from '@/hooks/useWeeklyPlannerActions';
import { useActivity } from '@/contexts/ActivityContext';
import WeeklyPlannerView from '@/components/weekly-planner/WeeklyPlannerView';
import ActivityModal from '@/components/ActivityModal';

const WeeklyPlannerPage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const {
    completedActivities,
    totalActivities,
    currentWeek,
    currentYear,
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    weekDays,
    selectedActivity,
    setSelectedActivity,
    isModalOpen,
    setIsModalOpen,
    loadingStates,
    setLoadingStates,
    optimisticUpdates,
    setOptimisticUpdates,
    allWeekActivities
  } = useWeeklyPlannerState();

  const { getCombinedActivityLibrary, userActivities, discoveredActivities } = useActivity();

  const {
    handleToggleCompletion,
    isRetrying
  } = useWeeklyPlannerActions(
    allWeekActivities,
    optimisticUpdates,
    loadingStates,
    setOptimisticUpdates,
    setLoadingStates
  );

  // Navigation functions
  const handleNavigateWeek = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  }, [currentDate, setCurrentDate]);

  const handleNavigateDay = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  }, [currentDate, setCurrentDate]);

  const handleViewModeChange = useCallback((mode: 'week' | 'day') => {
    setViewMode(mode);
  }, [setViewMode]);

  const handleActivityClick = useCallback((activity: any) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, [setSelectedActivity, setIsModalOpen]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, [setIsModalOpen, setSelectedActivity]);

  const getActivityDetails = useCallback((activityId: string) => {
    // Combine all possible activity sources
    const allActivities = [...getCombinedActivityLibrary(), ...userActivities, ...discoveredActivities];
    return allActivities.find(activity => activity.id === activityId);
  }, [getCombinedActivityLibrary, userActivities, discoveredActivities]);

  const handlePillarSelect = useCallback((pillar: string) => {
    setSelectedPillar(pillar);
    setIsActivityModalOpen(true);
  }, []);

  const handleActivityModalClose = useCallback(() => {
    setIsActivityModalOpen(false);
    setSelectedPillar(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Weekly Activity Planner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plan and track your dog's enrichment activities for the week
            </p>
          </div>

          <WeeklyPlannerView
            completedActivities={completedActivities}
            totalActivities={totalActivities}
            currentWeek={currentWeek}
            currentYear={currentYear}
            currentDate={currentDate}
            viewMode={viewMode}
            weekDays={weekDays}
            selectedActivity={selectedActivity}
            isModalOpen={isModalOpen}
            loadingStates={loadingStates}
            isRetrying={isRetrying}
            onNavigateWeek={handleNavigateWeek}
            onNavigateDay={handleNavigateDay}
            onViewModeChange={handleViewModeChange}
            onActivityClick={handleActivityClick}
            onToggleCompletion={handleToggleCompletion}
            onModalClose={handleModalClose}
            getActivityDetails={getActivityDetails}
          />
        </div>
      </div>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={handleActivityModalClose}
        selectedPillar={selectedPillar}
      />
    </div>
  );
};

export default WeeklyPlannerPage;

import React, { useState, useMemo, useCallback } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useToast } from '@/hooks/use-toast';
import { useRetry } from '@/hooks/useRetry';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import VerticalDayCard from './weekly-planner/VerticalDayCard';
import WeeklySummary from './weekly-planner/WeeklySummary';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';
import ActivityDetailModal from './weekly-planner/ActivityDetailModal';
import { ScheduledActivity } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyPlannerCard = ({ onPillarSelect, onChatOpen }) => {
  const { scheduledActivities, toggleActivityCompletion, getActivityDetails } = useActivity();
  const { currentDog } = useDog();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use today as the anchor for the current week
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Retry mechanism for failed operations
  const { retry, isRetrying } = useRetry({
    maxAttempts: 3,
    delay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt} for error:`, error);
      toast({
        title: `Retrying... (${attempt}/3)`,
        description: "Please wait while we try again.",
        variant: "default"
      });
    }
  });

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

  // Enhanced toggle completion with optimistic updates and error handling
  const handleToggleCompletion = useCallback(async (activityId: string, completionNotes?: string) => {
    if (loadingStates[activityId]) return; // Prevent double-clicks

    // Set loading state
    setLoadingStates(prev => ({ ...prev, [activityId]: true }));

    // Find current state
    const activity = allWeekActivities.find(a => a.id === activityId);
    if (!activity) {
      console.error('Activity not found:', activityId);
      setLoadingStates(prev => ({ ...prev, [activityId]: false }));
      return;
    }

    const currentState = optimisticUpdates[activityId] !== undefined ? optimisticUpdates[activityId] : activity.completed;
    const newState = !currentState;

    // Optimistic update
    setOptimisticUpdates(prev => ({ ...prev, [activityId]: newState }));

    try {
      // Wrap the toggleActivityCompletion call to ensure it returns a Promise
      await retry(async () => {
        await toggleActivityCompletion(activityId, completionNotes);
        return Promise.resolve(); // Ensure we return a Promise
      });
      
      // Clear optimistic update on success
      setOptimisticUpdates(prev => {
        const { [activityId]: _, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: newState ? "Activity completed!" : "Activity marked incomplete",
        description: newState ? "Great job on completing this activity!" : "Activity status updated",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to toggle activity completion:', error);
      
      // Revert optimistic update
      setOptimisticUpdates(prev => {
        const { [activityId]: _, ...rest } = prev;
        return rest;
      });
      
      toast({
        title: "Update failed",
        description: "We couldn't update the activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [activityId]: false }));
    }
  }, [allWeekActivities, optimisticUpdates, loadingStates, toggleActivityCompletion, retry, toast]);

  // Navigation handlers (if you want day navigation for mobile/future)
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

  // Activity details modal handlers
  const handleActivityClick = useCallback((activity: ScheduledActivity) => {
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

  // Simple empty state for current week with no activities
  const SimpleEmptyState = () => (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
        <Calendar className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No activities this week
      </h3>
      <p className="text-gray-500 mb-4 text-sm">
        Add some enrichment activities to get started!
      </p>
      <Button 
        onClick={() => navigate('/activity-library')} 
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Activities
      </Button>
    </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="bg-white/80 rounded-3xl shadow-lg border border-purple-100 max-w-4xl mx-auto my-8 overflow-hidden">
      <WeeklyPlannerHeader
        completedActivities={completedActivities}
        totalActivities={totalActivities}
        currentWeek={currentWeek}
        currentYear={currentYear}
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigateWeek={() => {}}
        onNavigateDay={handleDayChange}
        onViewModeChange={handleViewModeChange}
      />

      {totalActivities === 0 ? (
        <SimpleEmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-6 p-4 md:p-8 bg-gradient-to-br from-purple-50/40 to-cyan-50/40">
            {weekDays.map(day => (
              <VerticalDayCard
                key={day.date.toISOString()}
                label={day.label}
                date={day.date}
                activities={day.activities.map(activity => ({
                  ...activity,
                  completed: optimisticUpdates[activity.id] !== undefined ? optimisticUpdates[activity.id] : activity.completed
                }))}
                onActivityClick={handleActivityClick}
                onToggleCompletion={handleToggleCompletion}
                getActivityDetails={getActivityDetails}
                loadingStates={loadingStates}
                isRetrying={isRetrying}
              />
            ))}
          </div>

          <WeeklySummary
            completedActivities={completedActivities}
            totalActivities={totalActivities}
          />
        </>
      )}

      <ActivityDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        activity={selectedActivity}
        activityDetails={selectedActivity ? getActivityDetails(selectedActivity.activityId) : null}
        onToggleCompletion={handleToggleCompletion}
      />
    </div>
  );
};

export default WeeklyPlannerCard;

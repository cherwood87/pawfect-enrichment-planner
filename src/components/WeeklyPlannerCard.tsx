import React, { useState, useMemo, useCallback } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import VerticalDayCard from './VerticalDayCard';
import WeeklySummary from './weekly-planner/WeeklySummary';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';
import ActivityDetailModal from './weekly-planner/ActivityDetailModal';
import { ScheduledActivity } from '@/types/activity';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyPlannerCard = ({ onPillarSelect, onChatOpen }) => {
  const { scheduledActivities, toggleActivityCompletion, getActivityDetails } = useActivity();
  const { currentDog } = useDog();

  // Use today as the anchor for the current week
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState<ScheduledActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

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
  const completedActivities = allWeekActivities.filter(a => a.completed).length;
  const totalActivities = allWeekActivities.length;

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

  // Show empty planner if there's nothing scheduled
  if (totalActivities === 0) {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  // --- MAIN RENDER ---
  return (
    <div className="bg-white/80 rounded-3xl shadow-lg border border-purple-100 max-w-4xl mx-auto my-8 overflow-hidden">
      <WeeklyPlannerHeader
        completedActivities={completedActivities}
        totalActivities={totalActivities}
        currentWeek={null}
        currentYear={null}
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigateWeek={() => {}}
        onNavigateDay={handleDayChange}
        onViewModeChange={handleViewModeChange}
      />

      <div className="flex flex-col gap-6 p-4 md:p-8 bg-gradient-to-br from-purple-50/40 to-cyan-50/40">
        {weekDays.map(day => (
          <VerticalDayCard
            key={day.date.toISOString()}
            label={day.label}
            date={day.date}
            activities={day.activities}
            onActivityClick={handleActivityClick}
            onToggleCompletion={toggleActivityCompletion}
            getActivityDetails={getActivityDetails}
          />
        ))}
      </div>

      <WeeklySummary
        completedActivities={completedActivities}
        totalActivities={totalActivities}
      />

      <ActivityDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        activity={selectedActivity}
        activityDetails={selectedActivity ? getActivityDetails(selectedActivity.activityId) : null}
        onToggleCompletion={toggleActivityCompletion}
      />
    </div>
  );
};

export default WeeklyPlannerCard;

import React, { useState, useMemo, useCallback } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import VerticalDayCard from './weekly-planner/VerticalDayCard';
import WeeklySummary from './weekly-planner/WeeklySummary';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';
import ActivityDetailModal from './weekly-planner/ActivityDetailModal';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyPlannerCard = ({ onPillarSelect, onChatOpen }) => {
  const { scheduledActivities, toggleActivityCompletion, getActivityDetails } = useActivity();
  const { currentDog } = useDog();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get start of week (Sunday) for the current week
  const startOfWeek = React.useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    return new Date(date.setDate(date.getDate() - day));
  }, [currentDate]);

  // Create a list: [{label: "Monday", date: Date, activities: ScheduledActivity[]}, ...]
  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, dayIdx) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + dayIdx);
      return {
        label: DAY_LABELS[dayDate.getDay()],
        date: dayDate,
        activities: scheduledActivities
          .filter(
            (a) => new Date(a.scheduledDate).toDateString() === dayDate.toDateString() &&
            (!currentDog || a.dogId === currentDog.id)
          ),
      };
    });
  }, [startOfWeek, scheduledActivities, currentDog]);

  // Show empty planner if no activities this week
  const hasActivities = weekDays.some(day => day.activities.length > 0);

  // Show modal for activity details
  const handleActivityClick = useCallback((activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, []);

  if (!hasActivities) {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  return (
    <div className="bg-white/80 rounded-3xl shadow-lg border border-purple-100 max-w-4xl mx-auto my-8 overflow-hidden">
      <WeeklyPlannerHeader
        // ...your header props here
      />

      <div className="flex flex-col gap-6 p-4 md:p-8 bg-gradient-to-br from-purple-50/40 to-cyan-50/40">
        {weekDays.map((day) => (
          <VerticalDayCard
            key={day.label}
            date={day.date}
            label={day.label}
            activities={day.activities}
            onActivityClick={handleActivityClick}
            onToggleCompletion={toggleActivityCompletion}
            getActivityDetails={getActivityDetails}
          />
        ))}
      </div>

      <WeeklySummary
        // ...your summary props here
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

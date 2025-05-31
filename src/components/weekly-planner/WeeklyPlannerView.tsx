
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import WeeklyPlannerHeader from './WeeklyPlannerHeader';
import VerticalDayCard from './VerticalDayCard';
import WeeklySummary from './WeeklySummary';
import SimpleEmptyState from './SimpleEmptyState';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';

interface WeeklyPlannerViewProps {
  completedActivities: number;
  totalActivities: number;
  currentWeek: number;
  currentYear: number;
  currentDate: Date;
  viewMode: 'week' | 'day';
  weekDays: Array<{
    label: string;
    date: Date;
    activities: ScheduledActivity[];
  }>;
  selectedActivity: ScheduledActivity | null;
  isModalOpen: boolean;
  loadingStates: Record<string, boolean>;
  isRetrying: boolean;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onNavigateDay: (direction: 'prev' | 'next') => void;
  onViewModeChange: (mode: 'week' | 'day') => void;
  onActivityClick: (activity: ScheduledActivity) => void;
  onToggleCompletion: (activityId: string, completionNotes?: string) => void;
  onModalClose: () => void;
  getActivityDetails: (activityId: string) => any;
}

const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  completedActivities,
  totalActivities,
  currentWeek,
  currentYear,
  currentDate,
  viewMode,
  weekDays,
  selectedActivity,
  isModalOpen,
  loadingStates,
  isRetrying,
  onNavigateWeek,
  onNavigateDay,
  onViewModeChange,
  onActivityClick,
  onToggleCompletion,
  onModalClose,
  getActivityDetails
}) => {
  return (
    <div className="bg-white/80 rounded-3xl shadow-lg border border-purple-100 max-w-4xl mx-auto my-8 overflow-hidden">
      <WeeklyPlannerHeader
        completedActivities={completedActivities}
        totalActivities={totalActivities}
        currentWeek={currentWeek}
        currentYear={currentYear}
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigateWeek={onNavigateWeek}
        onNavigateDay={onNavigateDay}
        onViewModeChange={onViewModeChange}
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
                activities={day.activities}
                onActivityClick={onActivityClick}
                onToggleCompletion={onToggleCompletion}
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

      <ConsolidatedActivityModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        activityDetails={selectedActivity ? getActivityDetails(selectedActivity.activityId) : null}
        scheduledActivity={selectedActivity}
        onToggleCompletion={onToggleCompletion}
        mode="scheduled"
      />
    </div>
  );
};

export default WeeklyPlannerView;


import React from 'react';
import { Card } from '@/components/ui/card';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import WeeklyPlannerContent from './weekly-planner/WeeklyPlannerContent';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';
import ActivityDetailModal from './weekly-planner/ActivityDetailModal';
import { useWeeklyPlannerLogic } from './weekly-planner/WeeklyPlannerLogic';

interface WeeklyPlannerCardProps {
  onPillarSelect?: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerCard: React.FC<WeeklyPlannerCardProps> = ({
  onPillarSelect,
  onChatOpen
}) => {
  const {
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
    getTargetWeek,
    getTargetDate
  } = useWeeklyPlannerLogic(onChatOpen);

  if (totalActivities === 0 && viewMode === 'week') {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  return (
    <>
      <Card className="card-elevated overflow-hidden animate-fade-in-up">
        <WeeklyPlannerHeader 
          completedActivities={completedActivities} 
          totalActivities={totalActivities} 
          currentWeek={currentWeek} 
          currentYear={currentYear} 
          currentDate={currentDate}
          viewMode={viewMode}
          onNavigateWeek={navigateWeek}
          onNavigateDay={navigateDay}
          onViewModeChange={handleViewModeChange}
        />
        
        <WeeklyPlannerContent
          viewMode={viewMode}
          currentDate={currentDate}
          weekActivities={weekActivities}
          completedActivities={completedActivities}
          totalActivities={totalActivities}
          onToggleCompletion={toggleActivityCompletion}
          onActivityClick={handleActivityClick}
        />
      </Card>

      <ActivityDetailModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        activity={selectedActivity} 
        activityDetails={selectedActivity ? getActivityDetails(selectedActivity.activityId) : null} 
        onToggleCompletion={toggleActivityCompletion} 
        onNeedHelp={handleNeedHelp} 
      />
    </>
  );
};

export default WeeklyPlannerCard;

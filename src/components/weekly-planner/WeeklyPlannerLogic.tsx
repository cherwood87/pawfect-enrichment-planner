
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useWeeklyPlannerLogic } from '@/hooks/useWeeklyPlannerLogic';
import WeeklyPlannerNavigation from './WeeklyPlannerNavigation';
import WeeklyPlannerProgress from './WeeklyPlannerProgress';
import WeeklyPlannerGrid from './WeeklyPlannerGrid';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';

interface WeeklyPlannerLogicProps {
  onPillarSelect: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerLogic: React.FC<WeeklyPlannerLogicProps> = ({ onPillarSelect }) => {
  const navigate = useNavigate();
  
  const {
    currentWeekStartDate,
    setCurrentWeekStartDate,
    weeklyActivities,
    selectedActivityModal,
    setSelectedActivityModal,
    getDayCompletionStatus,
    getActivityDetails,
    handleToggleCompletion
  } = useWeeklyPlannerLogic();

  // Handle navigation to the next week
  const goToNextWeek = () => {
    const nextWeekStartDate = new Date(currentWeekStartDate);
    nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    setCurrentWeekStartDate(nextWeekStartDate);
  };

  // Handle navigation to the previous week
  const goToPreviousWeek = () => {
    const previousWeekStartDate = new Date(currentWeekStartDate);
    previousWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    setCurrentWeekStartDate(previousWeekStartDate);
  };

  // Handle navigation to today's week
  const goToTodayWeek = () => {
    setCurrentWeekStartDate(new Date());
  };

  const handleDayCardClick = (dayIndex: number) => {
    const dayActivities = weeklyActivities.filter(activity => activity.dayOfWeek === dayIndex);
    if (dayActivities.length > 0) {
      const activity = dayActivities[0];
      // Fetch activity details based on activityId
      const activityDetails = getActivityDetails(activity.activityId);
      if (activityDetails) {
        setSelectedActivityModal({ activity: activityDetails, scheduledActivity: activity });
      } else {
        console.error("Activity details not found for activityId:", activity.activityId);
      }
    } else {
      // Navigate to activity library with selected pillar - updated path
      onPillarSelect('all');
      navigate('/activity-library');
    }
  };

  const calculateWeekCompletion = (): number => {
    const totalDays = 7;
    let completedDays = 0;
    for (let i = 0; i < totalDays; i++) {
      const { completed } = getDayCompletionStatus(i);
      if (completed) {
        completedDays++;
      }
    }
    return (completedDays / totalDays) * 100;
  };

  const weekCompletion = calculateWeekCompletion();

  return (
    <Card className="col-span-2 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Weekly Plan</CardTitle>
        <CardDescription className="text-gray-600">
          Stay on track with your dog's weekly activities.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <WeeklyPlannerNavigation
          onPreviousWeek={goToPreviousWeek}
          onCurrentWeek={goToTodayWeek}
          onNextWeek={goToNextWeek}
        />
        
        <WeeklyPlannerProgress weekCompletion={weekCompletion} />
        
        <WeeklyPlannerGrid
          weeklyActivities={weeklyActivities}
          getDayCompletionStatus={getDayCompletionStatus}
          onDayCardClick={handleDayCardClick}
        />
      </CardContent>

      {/* Activity Detail Modal */}
      <ConsolidatedActivityModal
        isOpen={!!selectedActivityModal.activity}
        onClose={() => setSelectedActivityModal({ activity: null, scheduledActivity: null })}
        activityDetails={selectedActivityModal.activity}
        scheduledActivity={selectedActivityModal.scheduledActivity}
        onToggleCompletion={handleToggleCompletion}
        mode="scheduled"
      />
    </Card>
  );
};

export default WeeklyPlannerLogic;

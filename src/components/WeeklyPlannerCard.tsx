
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useChat } from '@/contexts/ChatContext';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import WeeklyGrid from './weekly-planner/WeeklyGrid';
import WeeklySummary from './weekly-planner/WeeklySummary';
import EmptyWeeklyPlanner from './weekly-planner/EmptyWeeklyPlanner';
import ActivityDetailModal from './weekly-planner/ActivityDetailModal';
import { ScheduledActivity } from '@/types/activity';

interface WeeklyPlannerCardProps {
  onPillarSelect?: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerCard: React.FC<WeeklyPlannerCardProps> = ({
  onPillarSelect,
  onChatOpen
}) => {
  const {
    scheduledActivities,
    toggleActivityCompletion,
    getActivityDetails
  } = useActivity();
  const {
    currentDog
  } = useDog();
  const {
    loadConversation,
    sendMessage
  } = useChat();
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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

  // Memoize computed values
  const { totalActivities, completedActivities } = useMemo(() => ({
    totalActivities: weekActivities.length,
    completedActivities: weekActivities.filter(a => a.completed).length
  }), [weekActivities]);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentWeek === 1) {
        setCurrentYear(currentYear - 1);
        setCurrentWeek(52);
      } else {
        setCurrentWeek(currentWeek - 1);
      }
    } else {
      if (currentWeek === 52) {
        setCurrentYear(currentYear + 1);
        setCurrentWeek(1);
      } else {
        setCurrentWeek(currentWeek + 1);
      }
    }
  }, [currentWeek, currentYear]);

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

  if (totalActivities === 0) {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <WeeklyPlannerHeader 
          completedActivities={completedActivities} 
          totalActivities={totalActivities} 
          currentWeek={currentWeek} 
          currentYear={currentYear} 
          onNavigateWeek={navigateWeek} 
        />
        
        <CardContent className="text-purple-600 text-center py-8 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border-2 border-purple-200">
          <WeeklyGrid 
            weekActivities={weekActivities} 
            onToggleCompletion={toggleActivityCompletion} 
            onActivityClick={handleActivityClick} 
          />

          <WeeklySummary 
            completedActivities={completedActivities} 
            totalActivities={totalActivities} 
          />
        </CardContent>
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

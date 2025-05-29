import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useChat } from '@/contexts/ChatContext';
import WeeklyPlannerHeader from './weekly-planner/WeeklyPlannerHeader';
import WeeklyGrid from './weekly-planner/WeeklyGrid';
import SingleDayView from './weekly-planner/SingleDayView';
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('day'); // Changed default to 'day'
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

  const navigateDay = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    
    // Update week if we moved to a different week
    const newWeek = getISOWeek(newDate);
    if (newWeek !== currentWeek) {
      setCurrentWeek(newWeek);
      setCurrentYear(newDate.getFullYear());
    }
  }, [currentDate, currentWeek]);

  const handleViewModeChange = useCallback((mode: 'week' | 'day') => {
    setViewMode(mode);
    
    // When switching to day view, ensure currentDate is in the current week
    if (mode === 'day') {
      const weekStart = getWeekStartDate(currentWeek, currentYear);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // If current date is not in the current week, set it to today or week start
      if (currentDate < weekStart || currentDate > weekEnd) {
        const today = new Date();
        if (today >= weekStart && today <= weekEnd) {
          setCurrentDate(today);
        } else {
          setCurrentDate(weekStart);
        }
      }
    }
  }, [currentWeek, currentYear, currentDate]);

  // Helper function to get week start date
  const getWeekStartDate = (week: number, year: number): Date => {
    const jan1 = new Date(year, 0, 1);
    const daysToFirstThursday = (4 - jan1.getDay() + 7) % 7;
    const firstThursday = new Date(year, 0, 1 + daysToFirstThursday);
    const weekStart = new Date(firstThursday);
    weekStart.setDate(firstThursday.getDate() + (week - 1) * 7 - 3);
    return weekStart;
  };

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

  if (totalActivities === 0 && viewMode === 'week') {
    return <EmptyWeeklyPlanner onPillarSelect={onPillarSelect} />;
  }

  return (
    <>
      <Card className="overflow-hidden shadow-lg border-2 border-purple-200">
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
        
        <CardContent className="p-6 bg-gradient-to-br from-purple-50/50 to-cyan-50/50">
          {viewMode === 'week' ? (
            <>
              <WeeklyGrid 
                weekActivities={weekActivities} 
                onToggleCompletion={toggleActivityCompletion} 
                onActivityClick={handleActivityClick} 
              />

              <WeeklySummary 
                completedActivities={completedActivities} 
                totalActivities={totalActivities} 
              />
            </>
          ) : (
            <SingleDayView
              currentDate={currentDate}
              weekActivities={weekActivities}
              onToggleCompletion={toggleActivityCompletion}
              onActivityClick={handleActivityClick}
            />
          )}
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

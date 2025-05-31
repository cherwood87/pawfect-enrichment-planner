import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, CheckCircle, Circle, Plus, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import { ActivityLibraryItem, ScheduledActivity, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';

interface WeeklyPlannerLogicProps {
  onPillarSelect: (pillar: string) => void;
  onChatOpen?: () => void;
}

interface ActivityModalState {
  activity: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  scheduledActivity: ScheduledActivity | null;
}

const WeeklyPlannerLogic: React.FC<WeeklyPlannerLogicProps> = ({ onPillarSelect, onChatOpen }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentDog } = useDog();
  const { scheduledActivities, toggleActivityCompletion, getCombinedActivityLibrary, userActivities, discoveredActivities } = useActivity();

  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());
  const [weeklyActivities, setWeeklyActivities] = useState<ScheduledActivity[]>([]);
  const [selectedActivityModal, setSelectedActivityModal] = useState<ActivityModalState>({
    activity: null,
    scheduledActivity: null,
  });

  // Function to get the ISO week number
  function getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  const currentWeekNumber = getISOWeek(currentWeekStartDate);

  // Load activities for the current week
  useEffect(() => {
    if (currentDog) {
      const filteredActivities = scheduledActivities.filter(activity =>
        activity.dogId === currentDog.id && activity.weekNumber === currentWeekNumber
      );
      setWeeklyActivities(filteredActivities);
    }
  }, [scheduledActivities, currentDog, currentWeekNumber]);

  // Calculate completion status for each day
  const getDayCompletionStatus = useCallback((dayIndex: number): { completed: boolean, activity: ScheduledActivity | undefined } => {
    const dayActivities = weeklyActivities.filter(activity => activity.dayOfWeek === dayIndex);
    if (dayActivities.length === 0) return { completed: false, activity: undefined };
    const completed = dayActivities.every(activity => activity.completed);
    return { completed, activity: dayActivities[0] };
  }, [weeklyActivities]);

  // Get the current date
  const today = new Date();
  const currentDayIndex = today.getDay();

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

  // Handle activity completion toggle
  const handleToggleCompletion = async (activityId: string) => {
    try {
      await toggleActivityCompletion(activityId);
      toast({
        title: "Activity Updated!",
        description: "Activity completion status has been updated.",
      });
    } catch (error) {
      console.error("Error toggling activity completion:", error);
      toast({
        title: "Error",
        description: "Failed to update activity completion status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDayCardClick = (dayIndex: number) => {
    const dayActivities = weeklyActivities.filter(activity => activity.dayOfWeek === dayIndex);
    if (dayActivities.length > 0) {
      const activity = scheduledActivities.find(sa => sa.id === dayActivities[0].id);
      if (activity) {
        // Fetch activity details based on activityId
        const activityDetails = getActivityDetails(activity.activityId);
        if (activityDetails) {
          setSelectedActivityModal({ activity: activityDetails, scheduledActivity: activity });
        } else {
          console.error("Activity details not found for activityId:", activity.activityId);
        }
      }
    } else {
      // Navigate to activity library with selected pillar
      onPillarSelect('all');
      navigate('/dog-profile-dashboard/activity-library');
    }
  };

  const getActivityDetails = (activityId: string): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined => {
    // Combine all possible activity sources
    const allActivities = [...getCombinedActivityLibrary(), ...userActivities, ...discoveredActivities];
    return allActivities.find(activity => activity.id === activityId);
  };

  const getDayName = (dayIndex: number): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayIndex];
  };

  const getFullDayName = (dayIndex: number): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex];
  };

  const getDayDate = (dayIndex: number): string => {
    const date = new Date(currentWeekStartDate);
    const diff = dayIndex - date.getDay();
    date.setDate(date.getDate() + diff);
    return format(date, 'MM/dd');
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
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            Previous Week
          </Button>
          <Button variant="secondary" size="sm" onClick={goToTodayWeek}>
            Current Week
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Next Week
          </Button>
        </div>
        <Progress value={weekCompletion} className="h-4 rounded-xl bg-purple-200" />
        <div className="grid grid-cols-7 gap-4">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
            const { completed, activity } = getDayCompletionStatus(dayIndex);
            const isToday = dayIndex === currentDayIndex;
            return (
              <Card
                key={dayIndex}
                className={`shadow-md rounded-xl cursor-pointer transition-colors duration-200 ${isToday ? 'ring-2 ring-blue-500' : ''
                  } hover:bg-purple-50`}
                onClick={() => handleDayCardClick(dayIndex)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-base font-semibold">{getDayName(dayIndex)}</CardTitle>
                  <Target className="w-4 h-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm opacity-70">{getDayDate(dayIndex)}</div>
                </CardContent>
                <CardFooter className="text-sm justify-between">
                  {completed ? (
                    <Badge variant="outline" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </Badge>
                  ) : activity ? (
                    <Badge className="gap-2">
                      <Circle className="h-4 w-4" />
                      Scheduled
                    </Badge>
                  ) : (
                    <Button size="sm" variant="secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
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

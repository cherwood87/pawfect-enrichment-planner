
import React from 'react';
import { CheckCircle, Circle, Plus, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduledActivity } from '@/types/activity';

interface WeeklyPlannerGridProps {
  weeklyActivities: ScheduledActivity[];
  getDayCompletionStatus: (dayIndex: number) => { completed: boolean, activity: ScheduledActivity | undefined };
  onDayCardClick: (dayIndex: number) => void;
}

const WeeklyPlannerGrid: React.FC<WeeklyPlannerGridProps> = ({
  weeklyActivities,
  getDayCompletionStatus,
  onDayCardClick
}) => {
  const getDayName = (dayIndex: number): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayIndex];
  };

  const getDayDate = (dayIndex: number): string => {
    const currentWeekStartDate = new Date();
    const date = new Date(currentWeekStartDate);
    const diff = dayIndex - date.getDay();
    date.setDate(date.getDate() + diff);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  };

  // Get the current date
  const today = new Date();
  const currentDayIndex = today.getDay();

  return (
    <div className="grid grid-cols-7 gap-4">
      {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
        const { completed, activity } = getDayCompletionStatus(dayIndex);
        const isToday = dayIndex === currentDayIndex;
        
        return (
          <Card
            key={dayIndex}
            className={`shadow-md rounded-xl cursor-pointer transition-colors duration-200 ${
              isToday ? 'ring-2 ring-blue-500' : ''
            } hover:bg-purple-50`}
            onClick={() => onDayCardClick(dayIndex)}
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
  );
};

export default WeeklyPlannerGrid;

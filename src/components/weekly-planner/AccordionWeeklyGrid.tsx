
import React from 'react';
import { ScheduledActivity } from '@/types/activity';
import { useActivity } from '@/contexts/ActivityContext';
import { Calendar, Target } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AccordionDayCard from './AccordionDayCard';

interface AccordionWeeklyGridProps {
  weekActivities: ScheduledActivity[];
  onToggleCompletion: (activityId: string) => void;
  onActivityClick?: (activity: ScheduledActivity) => void;
}

const AccordionWeeklyGrid: React.FC<AccordionWeeklyGridProps> = ({
  weekActivities,
  onToggleCompletion,
  onActivityClick
}) => {
  const { getActivityDetails } = useActivity();
  
  const dayNames = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' }, 
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' }
  ];

  // Get current day index
  const currentDayIndex = new Date().getDay();
  
  // Group activities by day of week
  const activitiesByDay = dayNames.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = weekActivities.filter(activity => activity.dayOfWeek === dayIndex);
    return acc;
  }, {} as Record<number, ScheduledActivity[]>);

  // Reorder days to start with today
  const reorderedDays = [
    ...dayNames.slice(currentDayIndex),
    ...dayNames.slice(0, currentDayIndex)
  ].map((day, index) => ({
    ...day,
    originalIndex: (currentDayIndex + index) % 7
  }));

  const totalActivities = weekActivities.length;

  if (totalActivities === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border border-purple-200">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl w-16 h-16 mx-auto mb-4">
          <Calendar className="w-10 h-10 text-white mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-purple-800 mb-2">No Activities This Week</h3>
        <p className="text-purple-600 mb-4">Start planning your dog's enrichment journey!</p>
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl border border-purple-200">
          <Target className="w-4 h-4" />
          <span className="font-medium">Add activities to get started</span>
        </div>
      </div>
    );
  }

  // Default to today's day being open (which is now first in the list)
  const defaultValue = `day-${currentDayIndex}`;

  return (
    <Accordion type="multiple" defaultValue={[defaultValue]} className="space-y-4">
      {reorderedDays.map((day, displayIndex) => {
        const dayIndex = day.originalIndex;
        const dayActivities = activitiesByDay[dayIndex] || [];
        const completedCount = dayActivities.filter(a => a.completed).length;
        const totalCount = dayActivities.length;
        const isToday = currentDayIndex === dayIndex;
        
        return (
          <AccordionItem 
            key={dayIndex} 
            value={`day-${dayIndex}`} 
            className="bg-white/90 backdrop-blur-sm rounded-3xl border-3 border-purple-300 overflow-hidden shadow-lg"
          >
            <AccordionTrigger className={`
              flex items-center justify-between p-6 hover:no-underline transition-colors
              ${isToday ? 'bg-gradient-to-r from-blue-100 to-blue-200' : 'bg-gradient-to-r from-gray-50 to-gray-100'}
            `}>
              <div className="flex items-center space-x-4">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-lg
                  ${isToday ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-white text-gray-700 border-2 border-gray-300'}
                `}>
                  {day.short}
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-xl ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
                    {day.full}
                    {isToday && <span className="ml-3 text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">Today</span>}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">{completedCount}/{totalCount} completed</p>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="p-6 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm">
              <AccordionDayCard
                activities={dayActivities}
                getActivityDetails={getActivityDetails}
                onToggleCompletion={onToggleCompletion}
                onActivityClick={onActivityClick}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default AccordionWeeklyGrid;

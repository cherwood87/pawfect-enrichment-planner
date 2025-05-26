
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Circle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';

const WeeklyPlannerCard = () => {
  const { scheduledActivities, getActivityDetails, toggleActivityCompletion } = useActivity();
  const { currentDog } = useDog();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(new Date()));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Get ISO week number
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get activities for the current week
  const weekActivities = scheduledActivities.filter(activity => 
    activity.weekNumber === currentWeek && 
    activity.dogId === currentDog?.id
  );

  // Group activities by day of week
  const activitiesByDay = dayNames.reduce((acc, _, dayIndex) => {
    acc[dayIndex] = weekActivities.filter(activity => activity.dayOfWeek === dayIndex);
    return acc;
  }, {} as Record<number, typeof weekActivities>);

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentWeek === 1) {
        setCurrentYear(currentYear - 1);
        setCurrentWeek(52); // Assume 52 weeks per year
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
  };

  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'purple',
      physical: 'green',
      social: 'blue',
      environmental: 'teal',
      instinctual: 'orange'
    };
    return colors[pillar as keyof typeof colors] || 'gray';
  };

  const totalActivities = weekActivities.length;
  const completedActivities = weekActivities.filter(a => a.completed).length;

  if (totalActivities === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="mobile-card bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
            <span>Weekly Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center mobile-card">
          <div className="text-gray-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No weekly activities planned</p>
            <p className="text-sm">Create a weekly routine for {currentDog?.name}!</p>
          </div>
          <Button 
            onClick={() => navigate('/activity-library')}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plan Weekly Activities
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="mobile-card bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} />
            <CardTitle className="font-bold text-gray-800">Weekly Plan</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`${
                completedActivities === totalActivities 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {completedActivities}/{totalActivities}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/activity-library')}
              className="text-green-600 hover:text-green-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('prev')}
            className="p-1"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-gray-600">
            Week {currentWeek}, {currentYear}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateWeek('next')}
            className="p-1"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{width: `${totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0}%`}}
            ></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="mobile-space-y mobile-card">
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((dayName, dayIndex) => {
            const dayActivities = activitiesByDay[dayIndex] || [];
            const dayCompleted = dayActivities.filter(a => a.completed).length;
            const dayTotal = dayActivities.length;
            
            return (
              <div key={dayIndex} className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-2">
                  {dayName}
                </div>
                <div className="space-y-1">
                  {dayActivities.map((activity) => {
                    const activityDetails = getActivityDetails(activity.activityId);
                    if (!activityDetails) return null;

                    const pillarColor = getPillarColor(activityDetails.pillar);
                    
                    return (
                      <div 
                        key={activity.id}
                        className={`p-2 rounded border text-xs cursor-pointer transition-all ${
                          activity.completed 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-white hover:border-blue-200'
                        }`}
                        onClick={() => toggleActivityCompletion(activity.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          {activity.completed ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-gray-400" />
                          )}
                          <Badge 
                            variant="secondary" 
                            className={`text-xs bg-${pillarColor}-100 text-${pillarColor}-700`}
                          >
                            {activityDetails.pillar.charAt(0).toUpperCase()}
                          </Badge>
                        </div>
                        <div className={`font-medium ${
                          activity.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}>
                          {activityDetails.title}
                        </div>
                        <div className="text-gray-500 mt-1">
                          {activity.userSelectedTime || activity.scheduledTime}
                        </div>
                      </div>
                    );
                  })}
                  {dayActivities.length === 0 && (
                    <div className="text-gray-400 text-xs py-4">
                      No activities
                    </div>
                  )}
                </div>
                {dayTotal > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {dayCompleted}/{dayTotal}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly Summary */}
        {completedActivities === totalActivities && totalActivities > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg mobile-card text-center mt-4">
            <CheckCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-green-500 mx-auto mb-1`} />
            <p className="text-sm font-medium text-green-800">Amazing Week Complete!</p>
            <p className="text-xs text-green-600">
              {currentDog?.name} had a fantastic week of enrichment!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyPlannerCard;

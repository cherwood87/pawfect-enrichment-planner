
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Circle } from 'lucide-react';

interface Activity {
  id: number;
  time: string;
  title: string;
  pillar: string;
  duration: string;
  completed: boolean;
  pillarColor: string;
}

const TodaySchedule = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      time: '8:00 AM',
      title: 'Morning Walk',
      pillar: 'Physical',
      duration: '30 min',
      completed: true,
      pillarColor: 'green'
    },
    {
      id: 2,
      time: '12:00 PM',
      title: 'Puzzle Toy',
      pillar: 'Mental',
      duration: '15 min',
      completed: true,
      pillarColor: 'purple'
    },
    {
      id: 3,
      time: '3:00 PM',
      title: 'Sniff Walk',
      pillar: 'Environmental',
      duration: '20 min',
      completed: false,
      pillarColor: 'teal'
    },
    {
      id: 4,
      time: '6:00 PM',
      title: 'Backyard Digging',
      pillar: 'Instinctual',
      duration: '10 min',
      completed: false,
      pillarColor: 'orange'
    }
  ]);

  // Load completion states from localStorage on mount
  useEffect(() => {
    const savedStates = localStorage.getItem('todayScheduleStates');
    if (savedStates) {
      const states = JSON.parse(savedStates);
      setActivities(prevActivities => 
        prevActivities.map(activity => ({
          ...activity,
          completed: states[activity.id] !== undefined ? states[activity.id] : activity.completed
        }))
      );
    }
  }, []);

  // Save completion states to localStorage whenever activities change
  useEffect(() => {
    const states = activities.reduce((acc, activity) => {
      acc[activity.id] = activity.completed;
      return acc;
    }, {} as Record<number, boolean>);
    localStorage.setItem('todayScheduleStates', JSON.stringify(states));
  }, [activities]);

  const toggleCompletion = (activityId: number) => {
    setActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const completedCount = activities.filter(a => a.completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Today's Schedule</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {completedCount}/{activities.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleCompletion(activity.id)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompletion(activity.id);
              }}
            >
              {activity.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium transition-all ${activity.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                  {activity.title}
                </h3>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs bg-${activity.pillarColor}-100 text-${activity.pillarColor}-700`}
                >
                  {activity.pillar}
                </Badge>
                <span className="text-xs text-gray-500">{activity.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;

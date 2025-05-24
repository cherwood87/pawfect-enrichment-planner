import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Circle, Plus, Calendar } from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { useNavigate } from 'react-router-dom';

const TodaySchedule = () => {
  const { getTodaysActivities, toggleActivityCompletion, getActivityDetails } = useActivity();
  const navigate = useNavigate();
  const todaysActivities = getTodaysActivities();

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

  const completedCount = todaysActivities.filter(a => a.completed).length;

  if (todaysActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-gray-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No activities scheduled for today</p>
            <p className="text-sm">Add activities from the library to get started!</p>
          </div>
          <Button 
            onClick={() => navigate('/activity-library')}
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Activity Library
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Today's Schedule</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {completedCount}/{todaysActivities.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {todaysActivities.map((scheduledActivity) => {
          const activityDetails = getActivityDetails(scheduledActivity.activityId);
          if (!activityDetails) return null;

          const pillarColor = getPillarColor(activityDetails.pillar);
          
          return (
            <div 
              key={scheduledActivity.id} 
              className="flex items-center space-x-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleActivityCompletion(scheduledActivity.id)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleActivityCompletion(scheduledActivity.id);
                }}
              >
                {scheduledActivity.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </Button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium transition-all ${scheduledActivity.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                    {activityDetails.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{scheduledActivity.scheduledTime}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs bg-${pillarColor}-100 text-${pillarColor}-700`}
                  >
                    {activityDetails.pillar}
                  </Badge>
                  <span className="text-xs text-gray-500">{activityDetails.duration} min</span>
                  <Badge variant="outline" className="text-xs">
                    {activityDetails.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;

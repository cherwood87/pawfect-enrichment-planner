
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, CheckCircle, Circle, Plus, Calendar, Edit3, StickyNote, Save, X } from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';

const DailyPlannerCard = () => {
  const { getTodaysActivities, toggleActivityCompletion, getActivityDetails, updateScheduledActivity } = useActivity();
  const { currentDog } = useDog();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState<string>('');
  
  const todaysActivities = getTodaysActivities();
  const completedCount = todaysActivities.filter(a => a.completed).length;
  const totalCount = todaysActivities.length;

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

  const toggleActivityExpansion = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
    setEditingTime(null); // Close any time editing when collapsing
  };

  const startTimeEdit = (activityId: string, currentTime: string) => {
    setEditingTime(activityId);
    setTempTime(currentTime);
  };

  const cancelTimeEdit = () => {
    setEditingTime(null);
    setTempTime('');
  };

  const saveTimeEdit = (activityId: string) => {
    if (tempTime && updateScheduledActivity) {
      updateScheduledActivity(activityId, { userSelectedTime: tempTime });
    }
    setEditingTime(null);
    setTempTime('');
  };

  if (todaysActivities.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
            <span>Today's Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center mobile-card">
          <div className="text-gray-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No activities planned for today</p>
            <p className="text-sm">Let's create a perfect day for {currentDog?.name}!</p>
          </div>
          <Button 
            onClick={() => navigate('/activity-library')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plan Activities
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
            <CardTitle className="font-bold text-gray-800">Today's Plan</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              variant="secondary" 
              className={`${
                completedCount === totalCount 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {completedCount}/{totalCount}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/activity-library')}
              className="text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-white rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
              style={{width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`}}
            ></div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="mobile-space-y mobile-card">
        {todaysActivities.map((scheduledActivity) => {
          const activityDetails = getActivityDetails(scheduledActivity.activityId);
          if (!activityDetails) return null;

          const pillarColor = getPillarColor(activityDetails.pillar);
          const isExpanded = expandedActivity === scheduledActivity.id;
          const displayTime = scheduledActivity.userSelectedTime || scheduledActivity.scheduledTime;
          const isEditingThisTime = editingTime === scheduledActivity.id;
          
          return (
            <div 
              key={scheduledActivity.id} 
              className={`bg-white rounded-lg border transition-all duration-200 ${
                scheduledActivity.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
              }`}
            >
              {/* Main Activity Row */}
              <div className="flex items-center space-x-3 mobile-card">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => toggleActivityCompletion(scheduledActivity.id)}
                >
                  {scheduledActivity.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </Button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium transition-all ${
                      scheduledActivity.completed 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-800'
                    }`}>
                      {activityDetails.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{displayTime}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-gray-400 hover:text-gray-600"
                        onClick={() => toggleActivityExpansion(scheduledActivity.id)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
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
                    {scheduledActivity.notes && (
                      <StickyNote className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 mobile-card bg-gray-50">
                  <div className="space-y-3">
                    {/* Time Picker Section */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Scheduled Time:</p>
                      {isEditingThisTime ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={tempTime}
                            onChange={(e) => setTempTime(e.target.value)}
                            className="w-32 h-7 text-xs"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7"
                            onClick={() => saveTimeEdit(scheduledActivity.id)}
                          >
                            <Save className="w-3 h-3 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7"
                            onClick={cancelTimeEdit}
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded border">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span>{displayTime}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-7 w-7"
                            onClick={() => startTimeEdit(scheduledActivity.id, displayTime)}
                          >
                            <Edit3 className="w-3 h-3 text-blue-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Benefits:</p>
                      <p className="text-xs text-gray-600">{activityDetails.benefits}</p>
                    </div>
                    
                    {scheduledActivity.notes && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
                        <p className="text-xs text-gray-600">{scheduledActivity.notes}</p>
                      </div>
                    )}
                    
                    {scheduledActivity.completionNotes && scheduledActivity.completed && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Completion Notes:</p>
                        <p className="text-xs text-gray-600">{scheduledActivity.completionNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Today's Summary */}
        {completedCount === totalCount && totalCount > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg mobile-card text-center">
            <CheckCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-green-500 mx-auto mb-1`} />
            <p className="text-sm font-medium text-green-800">Perfect Day Complete!</p>
            <p className="text-xs text-green-600">
              {currentDog?.name} had an amazing enrichment day!
            </p>
          </div>
        )}

        {/* Planning Encouragement */}
        {completedCount < totalCount && completedCount > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg mobile-card text-center">
            <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-blue-500 mx-auto mb-1`} />
            <p className="text-sm font-medium text-blue-800">Great Progress!</p>
            <p className="text-xs text-blue-600">
              {totalCount - completedCount} more activit{totalCount - completedCount === 1 ? 'y' : 'ies'} to complete today
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyPlannerCard;

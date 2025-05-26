
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
import ActivityCompletionModal from '@/components/ActivityCompletionModal';
import { convertTo24Hour, convertTo12Hour, validateTimeFormat } from '@/utils/timeUtils';
import { toast } from '@/components/ui/use-toast';

const DailyPlannerCard = () => {
  const { getTodaysActivities, toggleActivityCompletion, getActivityDetails, updateScheduledActivity } = useActivity();
  const { currentDog } = useDog();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');
  const [completionModal, setCompletionModal] = useState<{
    isOpen: boolean;
    activityId: string;
    activityTitle: string;
  }>({
    isOpen: false,
    activityId: '',
    activityTitle: ''
  });
  
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
    setTimeError(''); // Clear any time errors
  };

  const startTimeEdit = (activityId: string, currentTime: string) => {
    console.log('Starting time edit for activity:', activityId, 'Current time:', currentTime);
    setEditingTime(activityId);
    setTimeError('');
    
    try {
      // Convert display time (12-hour) to 24-hour format for the input
      const time24h = convertTo24Hour(currentTime);
      setTempTime(time24h);
      console.log('Set temp time to:', time24h);
    } catch (error) {
      console.error('Error converting time to 24-hour format:', error);
      setTimeError('Failed to parse current time');
      setTempTime('12:00'); // fallback
    }
  };

  const cancelTimeEdit = () => {
    console.log('Canceling time edit');
    setEditingTime(null);
    setTempTime('');
    setTimeError('');
  };

  const saveTimeEdit = (activityId: string) => {
    console.log('Saving time edit for activity:', activityId, 'Temp time:', tempTime);
    
    if (!tempTime.trim()) {
      setTimeError('Please enter a valid time');
      return;
    }

    // Validate the 24-hour format from the input
    if (!validateTimeFormat(tempTime)) {
      console.warn('Invalid time format detected:', tempTime);
      setTimeError('Invalid time format. Please use HH:MM format.');
      return;
    }

    if (!updateScheduledActivity) {
      console.error('updateScheduledActivity function not available');
      setTimeError('Unable to save time changes');
      return;
    }

    try {
      // Convert 24-hour input back to 12-hour format for storage and display
      const time12h = convertTo12Hour(tempTime);
      console.log('Converting 24-hour time to 12-hour for storage:', tempTime, '->', time12h);
      
      updateScheduledActivity(activityId, { userSelectedTime: time12h });
      console.log('Time update completed successfully');
      
      // Show success feedback
      toast({
        title: "Time Updated",
        description: `Activity time changed to ${time12h}`,
      });
      
      // Clear editing state
      setEditingTime(null);
      setTempTime('');
      setTimeError('');
      
    } catch (error) {
      console.error('Error during time conversion or update:', error);
      setTimeError('Failed to save time. Please try again.');
    }
  };

  const handleActivityToggle = (activityId: string) => {
    const activity = todaysActivities.find(a => a.id === activityId);
    if (!activity) return;

    if (activity.completed) {
      // If already completed, just toggle off
      toggleActivityCompletion(activityId);
    } else {
      // If not completed, open completion modal
      const activityDetails = getActivityDetails(activity.activityId);
      setCompletionModal({
        isOpen: true,
        activityId,
        activityTitle: activityDetails?.title || 'Activity'
      });
    }
  };

  const handleCompleteActivity = (notes: string) => {
    toggleActivityCompletion(completionModal.activityId, notes);
    setCompletionModal({
      isOpen: false,
      activityId: '',
      activityTitle: ''
    });
  };

  const closeCompletionModal = () => {
    setCompletionModal({
      isOpen: false,
      activityId: '',
      activityTitle: ''
    });
  };

  if (todaysActivities.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
            <span>Today's Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center mobile-card">
          <div className="text-gray-500 mb-4">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">No activities scheduled for today</p>
            <p className="text-sm">Add activities to your weekly plan to get started!</p>
          </div>
          <Button 
            onClick={() => navigate('/activity-library')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Weekly Activities
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
              <CardTitle className="font-bold text-gray-800">Today's Activities</CardTitle>
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
                    onClick={() => handleActivityToggle(scheduledActivity.id)}
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
                      {(scheduledActivity.notes || scheduledActivity.completionNotes) && (
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
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Input
                                type="time"
                                value={tempTime}
                                onChange={(e) => {
                                  console.log('Time input changed:', e.target.value);
                                  setTempTime(e.target.value);
                                  setTimeError(''); // Clear error on change
                                }}
                                className="w-32 h-7 text-xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    saveTimeEdit(scheduledActivity.id);
                                  } else if (e.key === 'Escape') {
                                    cancelTimeEdit();
                                  }
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-7 w-7"
                                onClick={() => saveTimeEdit(scheduledActivity.id)}
                                title="Save time"
                              >
                                <Save className="w-3 h-3 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-7 w-7"
                                onClick={cancelTimeEdit}
                                title="Cancel edit"
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                            {timeError && (
                              <p className="text-xs text-red-600">{timeError}</p>
                            )}
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
                              title="Edit time"
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
                          <p className="text-xs text-gray-600 bg-green-50 p-2 rounded border border-green-200">
                            {scheduledActivity.completionNotes}
                          </p>
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

      <ActivityCompletionModal
        isOpen={completionModal.isOpen}
        onClose={closeCompletionModal}
        onComplete={handleCompleteActivity}
        activityTitle={completionModal.activityTitle}
      />
    </>
  );
};

export default DailyPlannerCard;

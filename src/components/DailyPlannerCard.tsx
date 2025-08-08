
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Clock, CheckCircle, Circle, Plus, Calendar, Edit3, StickyNote, Save, X 
} from 'lucide-react';
import { useActivity } from '@/contexts/ActivityContext';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ActivityCompletionModal from '@/components/ActivityCompletionModal';
import { convertTo24Hour, convertTo12Hour, validateTimeFormat } from '@/utils/timeUtils';
import { toast } from '@/components/ui/use-toast';

// --- Helper: Pillar color ---
const PILLAR_COLORS: Record<string, { bg: string; text: string }> = {
  mental:        { bg: 'bg-purple-100',       text: 'text-purple-700' },
  physical:      { bg: 'bg-green-100',        text: 'text-green-700' },
  social:        { bg: 'bg-blue-100',         text: 'text-blue-700' },
  environmental: { bg: 'bg-teal-100',         text: 'text-teal-700' },
  instinctual:   { bg: 'bg-orange-100',       text: 'text-orange-700' }
};
const getPillarColor = (pillar: string) => PILLAR_COLORS[pillar] || { bg: 'bg-gray-100', text: 'text-gray-700' };

// --- Subcomponent: Progress Bar ---
const ProgressBar = ({ completed, total }: { completed: number; total: number }) => (
  <div className="mt-3">
    <div className="w-full bg-white rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
        style={{width: `${total > 0 ? (completed / total) * 100 : 0}%`}}
      />
    </div>
  </div>
);

// --- Subcomponent: Empty State ---
const EmptyState = ({ onAdd, isMobile }: { onAdd: () => void; isMobile: boolean }) => (
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
        <p className="text-sm">Add activities to get started!</p>
      </div>
      <Button 
        onClick={onAdd}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Browse Activities
      </Button>
    </CardContent>
  </Card>
);

// --- Subcomponent: Activity Row ---
const ActivityRow = ({
  scheduledActivity,
  activityDetails,
  isExpanded,
  onToggle,
  onStartTimeEdit,
  onToggleActivity,
  displayTime,
  isEditingThisTime,
  tempTime,
  setTempTime,
  timeError,
  onSaveTimeEdit,
  onCancelTimeEdit,
  editingTimeId,
}: any) => {
  const pillarColor = getPillarColor(activityDetails.pillar);
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
          onClick={() => onToggleActivity(scheduledActivity.id)}
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
                onClick={() => onToggle(scheduledActivity.id)}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <Badge 
              variant="secondary" 
              className={`text-xs ${pillarColor.bg} ${pillarColor.text}`}
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
            {/* The below section is removed, as time editing is no longer supported */}
            {/* Remove scheduledTime/userSelectedTime editing */}
            {/* You can re-add a new time scheduling feature here if you wish in the future */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">Scheduled Time:</p>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded border">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>Day-based scheduling only</span>
                </div>
              </div>
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
};

// --- Subcomponent: Banner ---
const Banner = ({ type, count, dogName }: { type: 'complete' | 'progress', count?: number, dogName?: string }) => {
  if (type === 'complete') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg mobile-card text-center">
        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
        <p className="text-sm font-medium text-green-800">Perfect Day Complete!</p>
        <p className="text-xs text-green-600">
          {dogName} had an amazing enrichment day!
        </p>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg mobile-card text-center">
      <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-1" />
      <p className="text-sm font-medium text-blue-800">Great Progress!</p>
      <p className="text-xs text-blue-600">
        {count} more activit{count === 1 ? 'y' : 'ies'} to complete today
      </p>
    </div>
  );
};

// --- ENHANCED HEADER with Floating Add Button ---
const EnhancedHeader = ({
  completedCount,
  totalCount,
  isMobile,
  onAddActivity,
}: {
  completedCount: number;
  totalCount: number;
  isMobile: boolean;
  onAddActivity: () => void;
}) => (
  <CardHeader className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm rounded-b-xl">
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
          size="sm"
          onClick={onAddActivity}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="w-4 h-4 mr-1" />
          {isMobile ? 'Add' : 'Add Activity'}
        </Button>
      </div>
    </div>
    <ProgressBar completed={completedCount} total={totalCount} />
  </CardHeader>
);

// --- MAIN COMPONENT ---
const DailyPlannerCard = () => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const { 
    getTodaysActivities, 
    getActivityDetails, 
    toggleActivityCompletion,
    updateScheduledActivity 
  } = useActivity();
  const isMobile = useIsMobile();
  
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
  const [tempTime, setTempTime] = useState('');
  const [timeError, setTimeError] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todaysActivities = getTodaysActivities();
  const completedCount = todaysActivities.filter(activity => activity.completed).length;
  const totalCount = todaysActivities.length;

  const handleAddActivity = () => {
    navigate('/activity-library');
  };

  const handleToggleExpanded = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
    setEditingTimeId(null);
    setTimeError('');
  };

  const handleToggleActivity = (activityId: string) => {
    const activity = todaysActivities.find(a => a.id === activityId);
    if (!activity) return;

    if (!activity.completed) {
      const activityDetails = getActivityDetails(activity.activityId);
      setSelectedActivity({ ...activity, activityDetails });
      setIsModalOpen(true);
    } else {
      toggleActivityCompletion(activityId, '');
    }
  };

  const handleModalComplete = (completionNotes: string) => {
    if (selectedActivity) {
      toggleActivityCompletion(selectedActivity.id, completionNotes);
      setIsModalOpen(false);
      setSelectedActivity(null);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  // Empty state
  if (totalCount === 0) {
    return <EmptyState onAdd={handleAddActivity} isMobile={isMobile} />;
  }

  return (
    <>
      <Card className="overflow-hidden">
        <EnhancedHeader 
          completedCount={completedCount}
          totalCount={totalCount}
          isMobile={isMobile}
          onAddActivity={handleAddActivity}
        />
        
        <CardContent className="mobile-card">
          {/* Success/Progress Banner */}
          {completedCount === totalCount ? (
            <Banner type="complete" dogName={currentDog?.name} />
          ) : completedCount > 0 ? (
            <Banner type="progress" count={totalCount - completedCount} />
          ) : null}

          {/* Activity List */}
          <div className="space-y-3 mt-4">
            {todaysActivities.map((scheduledActivity) => {
              const activityDetails = getActivityDetails(scheduledActivity.activityId);
              if (!activityDetails) return null;

              const displayTime = "All day";
              const isExpanded = expandedActivity === scheduledActivity.id;
              const isEditingThisTime = editingTimeId === scheduledActivity.id;

              return (
                <ActivityRow
                  key={scheduledActivity.id}
                  scheduledActivity={scheduledActivity}
                  activityDetails={activityDetails}
                  isExpanded={isExpanded}
                  onToggle={handleToggleExpanded}
                  onToggleActivity={handleToggleActivity}
                  displayTime={displayTime}
                  isEditingThisTime={isEditingThisTime}
                  tempTime={tempTime}
                  setTempTime={setTempTime}
                  timeError={timeError}
                  editingTimeId={editingTimeId}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedActivity && (
        <ActivityCompletionModal
          isOpen={isModalOpen}
          onClose={handleModalCancel}
          onComplete={handleModalComplete}
          activityTitle={selectedActivity.activityDetails?.title || ''}
        />
      )}
    </>
  );
};

export default DailyPlannerCard;

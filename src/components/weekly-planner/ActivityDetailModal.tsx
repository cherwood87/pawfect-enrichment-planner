
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, Star, Target, MessageCircle } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import { useFavourites } from '@/hooks/useFavourites';
import ActivityCardActions from '@/components/ActivityCardActions';
import DaySelector from '@/components/DaySelector';

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ScheduledActivity | null;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  onToggleCompletion: (activityId: string) => void;
  onNeedHelp?: (activityContext: {
    type: 'activity-help';
    activityName: string;
    activityPillar: string;
    activityDifficulty: string;
    activityDuration: number;
  }) => void;
  mode?: 'scheduled' | 'library';
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity,
  activityDetails,
  onToggleCompletion,
  onNeedHelp,
  mode = 'scheduled'
}) => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const { addScheduledActivity } = useActivity();
  const { addToFavourites } = useFavourites(currentDog?.id || null);
  
  // Add state for day selection and loading states
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(new Date().getDay());
  const [isScheduling, setIsScheduling] = useState(false);
  const [isFavouriting, setIsFavouriting] = useState(false);

  if (!activityDetails) return null;

  const handleNeedHelp = () => {
    if (!onNeedHelp || !activityDetails) return;
    const activityContext = {
      type: 'activity-help' as const,
      activityName: activityDetails.title,
      activityPillar: activityDetails.pillar,
      activityDifficulty: activityDetails.difficulty,
      activityDuration: activityDetails.duration
    };
    onNeedHelp(activityContext);
  };

  const handleScheduleActivity = async () => {
    if (!currentDog || !activityDetails) return;
    
    setIsScheduling(true);
    
    try {
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

      const currentWeek = getISOWeek(new Date());
      const today = new Date();
      
      // Calculate the date for the selected day of week
      const dayDiff = selectedDayOfWeek - today.getDay();
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + dayDiff);
      
      addScheduledActivity({
        dogId: currentDog.id,
        activityId: activityDetails.id,
        scheduledDate: scheduledDate.toISOString().split('T')[0],
        completed: false,
        notes: '',
        completionNotes: '',
        reminderEnabled: false,
        weekNumber: currentWeek,
        dayOfWeek: selectedDayOfWeek
      });
      
      onClose();
      navigate('/dog-profile-dashboard/weekly-plan');
    } catch (error) {
      console.error('Error scheduling activity:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleAddToFavourites = async () => {
    if (!activityDetails) return;
    
    setIsFavouriting(true);
    
    try {
      // Determine activity type based on the activity structure
      let activityType: 'library' | 'user' | 'discovered' = 'library';
      if ('isCustom' in activityDetails && activityDetails.isCustom) {
        activityType = 'user';
      } else if ('source' in activityDetails && activityDetails.source === 'discovered') {
        activityType = 'discovered';
      }
      
      await addToFavourites(activityDetails, activityType);
    } catch (error) {
      console.error('Error adding to favourites:', error);
    } finally {
      setIsFavouriting(false);
    }
  };

  const getPillarColor = (pillar: string) => {
    const colors = {
      mental: 'bg-purple-100 text-purple-700',
      physical: 'bg-emerald-100 text-emerald-700',
      social: 'bg-cyan-100 text-cyan-700',
      environmental: 'bg-teal-100 text-teal-700',
      instinctual: 'bg-orange-100 text-orange-700'
    };
    return colors[pillar as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyStars = (difficulty: string) => {
    const level = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-2xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-purple-800">{activityDetails.title}</span>
            </span>
            <div className="flex items-center space-x-2">
              {onNeedHelp && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNeedHelp}
                  className="flex items-center space-x-2 rounded-2xl border-2 border-purple-300 hover:bg-purple-100 bg-white/70 backdrop-blur-sm"
                >
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700 font-medium">Need Help?</span>
                </Button>
              )}
              {mode === 'scheduled' && activity && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleCompletion(activity.id)}
                  className="flex items-center space-x-2 hover:bg-purple-100 rounded-xl"
                >
                  {activity.completed ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-emerald-600">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Mark Complete</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`${getPillarColor(activityDetails.pillar)} rounded-2xl px-4 py-2 font-semibold`}>
              {activityDetails.pillar.charAt(0).toUpperCase() + activityDetails.pillar.slice(1)}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-purple-700 bg-purple-100 rounded-2xl px-3 py-2">
              <Clock className="w-4 h-4" />
              <span>{activityDetails.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-1 bg-cyan-100 rounded-2xl px-3 py-2">
              <span className="text-sm text-cyan-700 mr-1">Difficulty:</span>
              {getDifficultyStars(activityDetails.difficulty)}
            </div>
          </div>

          {/* Day Selector for library mode */}
          {mode === 'library' && (
            <div className="bg-white/70 rounded-3xl p-4 border border-purple-200">
              <DaySelector
                selectedDayOfWeek={selectedDayOfWeek}
                onDaySelect={setSelectedDayOfWeek}
              />
            </div>
          )}

          <div className="bg-white/70 rounded-3xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Benefits</h3>
            <p className="text-gray-700 leading-relaxed">{activityDetails.benefits}</p>
          </div>

          <div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Instructions</h3>
            <div className="text-gray-700 leading-relaxed">
              {Array.isArray(activityDetails.instructions) ? (
                <ol className="list-decimal list-inside space-y-1">
                  {activityDetails.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              ) : typeof activityDetails.instructions === 'string' ? (
                <p>{activityDetails.instructions}</p>
              ) : null}
            </div>
          </div>

          {activityDetails.materials && activityDetails.materials.length > 0 && (
            <div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Materials Needed</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {activityDetails.materials.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {mode === 'scheduled' && activity?.notes && (
            <div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Notes</h3>
              <p className="text-gray-700 bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
                {activity.notes}
              </p>
            </div>
          )}

          {mode === 'scheduled' && activity?.completionNotes && activity.completed && (
            <div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Completion Notes</h3>
              <p className="text-gray-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                {activity.completionNotes}
              </p>
            </div>
          )}

          {/* Use ActivityCardActions for library mode with loading states */}
          {mode === 'library' && (
            <ActivityCardActions
              onClose={onClose}
              onScheduleActivity={handleScheduleActivity}
              onAddToFavourites={handleAddToFavourites}
              disabled={isScheduling || isFavouriting}
              onNeedHelp={handleNeedHelp}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;

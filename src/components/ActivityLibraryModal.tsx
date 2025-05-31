
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, Star, Target, Calendar, Heart, MessageSquare } from 'lucide-react';
import { ScheduledActivity, ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/hooks/use-toast';
import DaySelector from '@/components/DaySelector';
import ChatModal from '@/components/chat/ChatModal';
import { ActivityHelpContext } from '@/types/activityContext';

interface ActivityLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
  scheduledActivity?: ScheduledActivity | null;
  onToggleCompletion?: (activityId: string) => void;
  mode?: 'scheduled' | 'library';
}

const ActivityLibraryModal: React.FC<ActivityLibraryModalProps> = ({
  isOpen,
  onClose,
  activityDetails,
  scheduledActivity = null,
  onToggleCompletion,
  mode = 'library'
}) => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const { addScheduledActivity } = useActivity();
  const { addToFavourites } = useFavourites(currentDog?.id || null);
  const { loadConversation } = useChat();
  
  // State management
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(new Date().getDay());
  const [isScheduling, setIsScheduling] = useState(false);
  const [isFavouriting, setIsFavouriting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!activityDetails) return null;

  const handleNeedHelp = () => {
    if (!activityDetails) return;
    
    loadConversation(currentDog?.id || '', 'activity-help');
    setIsChatOpen(true);
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
      
      await addScheduledActivity({
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
      
      toast({
        title: "Activity Scheduled!",
        description: "Activity has been added to your weekly plan."
      });
      
      onClose();
      navigate('/dog-profile-dashboard/weekly-plan');
    } catch (error) {
      console.error('Error scheduling activity:', error);
      toast({
        title: "Error",
        description: "Failed to schedule activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleAddToFavourites = async () => {
    if (!activityDetails) return;
    
    setIsFavouriting(true);
    
    try {
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

  const chatContext: ActivityHelpContext = {
    type: 'activity-help',
    activityName: activityDetails.title,
    activityPillar: activityDetails.pillar,
    activityDifficulty: activityDetails.difficulty,
    activityDuration: activityDetails.duration
  };

  return (
    <>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNeedHelp}
                  className="flex items-center space-x-2 hover:bg-purple-100 rounded-xl"
                >
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600">Get Help</span>
                </Button>
                {mode === 'scheduled' && scheduledActivity && onToggleCompletion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleCompletion(scheduledActivity.id)}
                    className="flex items-center space-x-2 hover:bg-purple-100 rounded-xl"
                  >
                    {scheduledActivity.completed ? (
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

            {mode === 'scheduled' && scheduledActivity?.notes && (
              <div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Notes</h3>
                <p className="text-gray-700 bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
                  {scheduledActivity.notes}
                </p>
              </div>
            )}

            {mode === 'scheduled' && scheduledActivity?.completionNotes && scheduledActivity.completed && (
              <div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Completion Notes</h3>
                <p className="text-gray-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  {scheduledActivity.completionNotes}
                </p>
              </div>
            )}

            {/* Action buttons for library mode */}
            {mode === 'library' && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-200/50">
                <Button
                  onClick={handleScheduleActivity}
                  className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isScheduling}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {isScheduling ? 'Scheduling...' : 'Add to Weekly Plan'}
                </Button>
                <Button
                  onClick={handleAddToFavourites}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isFavouriting}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {isFavouriting ? 'Adding...' : 'Add to Favourites'}
                </Button>
              </div>
            )}

            <div className="pt-4 border-t border-purple-200/50">
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="w-full rounded-2xl border-purple-300 hover:bg-purple-50"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Modal for Activity Help */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        chatContext={chatContext}
      />
    </>
  );
};

export default ActivityLibraryModal;

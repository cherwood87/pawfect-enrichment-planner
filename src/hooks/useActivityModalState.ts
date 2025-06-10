
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useChat } from '@/contexts/ChatContext';
import { toast } from '@/hooks/use-toast';
import { ActivityLibraryItem, UserActivity } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivityState } from '@/contexts/ActivityStateContext';
import { useActivityActions } from '@/hooks/core/useActivityActions'; // Use consolidated hook

export const useActivityModalState = (
  activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity | null,
  onClose: () => void
) => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const { addToFavourites } = useFavourites(currentDog?.id || null);
  const { loadConversation } = useChat();

  const {
    scheduledActivities,
    setScheduledActivities,
    setUserActivities
  } = useActivityState();

  const { addScheduledActivity } = useActivityActions(
    setScheduledActivities, 
    setUserActivities, 
    currentDog,
    scheduledActivities // Pass existing activities for duplicate checking
  );

  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(new Date().getDay());
  const [isScheduling, setIsScheduling] = useState(false);
  const [isFavouriting, setIsFavouriting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNeedHelp = () => {
    if (!activityDetails) return;
    
    loadConversation(currentDog?.id || '', 'activity-help');
    setIsChatOpen(true);
  };

  const handleScheduleActivity = async () => {
    if (!currentDog || !activityDetails) return;
    
    setIsScheduling(true);
    
    try {
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

  return {
    selectedDayOfWeek,
    setSelectedDayOfWeek,
    isScheduling,
    isFavouriting,
    isChatOpen,
    setIsChatOpen,
    handleNeedHelp,
    handleScheduleActivity,
    handleAddToFavourites
  };
};

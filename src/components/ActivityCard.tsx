
import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import ActivityCardHeader from './ActivityCardHeader';
import ActivityCardStats from './ActivityCardStats';
import ActivityCardContent from './ActivityCardContent';
import ActivityCardActions from './ActivityCardActions';
import DaySelector from './DaySelector';

interface ActivityCardProps {
  activity: ActivityLibraryItem | DiscoveredActivity;
  isOpen: boolean;
  onClose: () => void;
  targetDate?: Date; // Optional target date for scheduling
  targetWeek?: number; // Optional target week for scheduling
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  isOpen, 
  onClose, 
  targetDate,
  targetWeek 
}) => {
  const { addScheduledActivity } = useActivity();
  const { currentDog } = useDog();
  const { addToFavourites } = useFavourites(currentDog?.id || null);
  
  // Use target date's day of week if provided, otherwise default to Monday
  const defaultDayOfWeek = targetDate ? targetDate.getDay() : 1;
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(defaultDayOfWeek);

  const isDiscoveredActivity = useCallback((activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
    return 'source' in activity && activity.source === 'discovered';
  }, []);

  const getISOWeek = useCallback((date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }, []);

  const getDateForDayOfWeek = useCallback((dayOfWeek: number) => {
    // If we have a target date and week, calculate relative to that week
    if (targetDate && targetWeek) {
      const startOfTargetWeek = new Date(targetDate);
      // Find Monday of the target week
      const dayOffset = (startOfTargetWeek.getDay() + 6) % 7; // Days since Monday
      startOfTargetWeek.setDate(startOfTargetWeek.getDate() - dayOffset);
      
      // Add the selected day offset
      const targetDayDate = new Date(startOfTargetWeek);
      targetDayDate.setDate(startOfTargetWeek.getDate() + dayOfWeek);
      return targetDayDate;
    }
    
    // Fallback to current week calculation
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayOfWeek - currentDay;
    const targetDateCalc = new Date(today);
    targetDateCalc.setDate(today.getDate() + diff);
    return targetDateCalc;
  }, [targetDate, targetWeek]);

  const handleScheduleActivity = useCallback(async () => {
    if (!currentDog) {
      console.error('No current dog selected');
      return;
    }
    
    try {
      const calculatedTargetDate = getDateForDayOfWeek(selectedDayOfWeek);
      const weekNumber = targetWeek || getISOWeek(calculatedTargetDate);
      const scheduledDate = calculatedTargetDate.toISOString().split('T')[0];

      console.log('Scheduling activity:', {
        activityId: activity.id,
        scheduledDate,
        weekNumber,
        dayOfWeek: selectedDayOfWeek,
        targetDate: targetDate?.toISOString(),
        targetWeek
      });

      await addScheduledActivity({
        dogId: currentDog.id,
        activityId: activity.id,
        scheduledDate,
        scheduledTime: '',
        weekNumber,
        dayOfWeek: selectedDayOfWeek,
        completed: false,
        notes: '',
        completionNotes: '',
        reminderEnabled: false,
      });

      console.log('Activity scheduled successfully');
      onClose();
    } catch (error) {
      console.error('Error scheduling activity:', error);
    }
  }, [currentDog, selectedDayOfWeek, activity.id, getDateForDayOfWeek, getISOWeek, addScheduledActivity, onClose, targetWeek]);

  const handleAddToFavourites = useCallback(async () => {
    if (!currentDog) return;

    const activityType = isDiscoveredActivity(activity) ? 'discovered' : 'library';
    await addToFavourites(activity, activityType);
  }, [currentDog, activity, isDiscoveredActivity, addToFavourites]);

  const handleDaySelect = useCallback((day: number) => {
    setSelectedDayOfWeek(day);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">Activity Details</DialogTitle>
          <ActivityCardHeader activity={activity} />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <ActivityCardStats activity={activity} />
          <ActivityCardContent activity={activity} />
          
          <DaySelector 
            selectedDayOfWeek={selectedDayOfWeek}
            onDaySelect={handleDaySelect}
            targetDate={targetDate}
            targetWeek={targetWeek}
          />

          <ActivityCardActions
            onClose={onClose}
            onScheduleActivity={handleScheduleActivity}
            onAddToFavourites={handleAddToFavourites}
            disabled={!currentDog}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityCard;

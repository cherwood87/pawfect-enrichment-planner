
import { useNavigate } from 'react-router-dom';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { toast } from '@/hooks/use-toast';
import { calculateScheduledDate } from './ActivityModalUtils';

export const useActivityModalHandlers = (
  selectedDayOfWeek: number,
  onClose: () => void,
  resetCustomActivityForm: () => void,
  customActivityState: {
    activityName: string;
    pillar: string;
    duration: string;
    materials: string;
    instructions: string;
    description: string;
  }
) => {
  const navigate = useNavigate();
  const { addScheduledActivity, addUserActivity } = useActivity();
  const { currentDog } = useDog();

  const handleActivitySelect = async (activity: any) => {
    console.log('🎯 [ActivityModalHandlers] Activity selected for scheduling:', {
      activityId: activity.id,
      activityTitle: activity.title,
      selectedDayOfWeek,
      currentDog: currentDog?.name || 'None'
    });
    
    if (!currentDog) {
      console.error('❌ [ActivityModalHandlers] No dog selected');
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate the scheduled date with enhanced validation and week number
    const dateResult = calculateScheduledDate(selectedDayOfWeek);
    
    if (!dateResult.isValid) {
      console.error('❌ [ActivityModalHandlers] Invalid date calculated:', dateResult.error);
      toast({
        title: "Invalid Date",
        description: dateResult.error || "Cannot schedule for the selected date",
        variant: "destructive"
      });
      return;
    }
    
    const scheduledActivityData = {
      dogId: currentDog.id,
      activityId: activity.id,
      scheduledDate: dateResult.date,
      completed: false,
      notes: '',
      completionNotes: '',
      reminderEnabled: false,
      weekNumber: dateResult.weekNumber,
      dayOfWeek: selectedDayOfWeek
    };
    
    console.log('📋 [ActivityModalHandlers] Preparing to schedule activity:', {
      ...scheduledActivityData,
      dogName: currentDog.name,
      activityTitle: activity.title
    });
    
    try {
      console.log('⏳ [ActivityModalHandlers] Calling addScheduledActivity...');
      await addScheduledActivity(scheduledActivityData);
      
      console.log('✅ [ActivityModalHandlers] Activity scheduled successfully');
      toast({
        title: "Activity Scheduled!",
        description: `"${activity.title}" scheduled for ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDayOfWeek]}.`
      });
      
      onClose();
      navigate('/app#favorites');
    } catch (error) {
      console.error('❌ [ActivityModalHandlers] Error scheduling activity:', error);
      
      // Provide specific error handling for common issues
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('already scheduled')) {
        toast({
          title: "Activity Already Scheduled",
          description: "This activity is already scheduled for the selected date. The existing schedule has been updated instead.",
          variant: "default"
        });
        // Still close modal and navigate as the upsert succeeded
        onClose();
        navigate('/app#favorites');
      } else {
        toast({
          title: "Failed to Schedule Activity",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  };

  const handleCreateCustomActivity = async () => {
    const { activityName, pillar, duration, materials, instructions, description } = customActivityState;
    
    if (!activityName || !pillar || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!currentDog) {
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }

    const newActivity = {
      title: activityName,
      pillar: pillar as 'mental' | 'physical' | 'social' | 'environmental' | 'instinctual',
      difficulty: 'Medium' as const,
      duration: parseInt(duration),
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      emotionalGoals: [],
      instructions: instructions.split('\n').filter(Boolean),
      benefits: description,
      tags: [],
      ageGroup: 'All Ages' as const,
      energyLevel: 'Medium' as const,
      isCustom: true
    };

    try {
      await addUserActivity(newActivity);
      resetCustomActivityForm();
      onClose();
      navigate('/app#favorites');
    } catch (error) {
      console.error('Error creating custom activity:', error);
      // Don't show another toast here as the addUserActivity function already handles it
    }
  };

  const handleCancelCustomActivity = () => {
    resetCustomActivityForm();
  };

  return {
    handleActivitySelect,
    handleCreateCustomActivity,
    handleCancelCustomActivity
  };
};

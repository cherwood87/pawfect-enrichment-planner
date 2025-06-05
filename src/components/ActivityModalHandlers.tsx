
import { useNavigate } from 'react-router-dom';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { toast } from '@/hooks/use-toast';
import { calculateScheduledDate, getISOWeek } from './ActivityModalUtils';

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
    console.log('🎯 [ActivityModal] Activity selected for scheduling:', {
      activityId: activity.id,
      activityTitle: activity.title,
      selectedDayOfWeek,
      currentDog: currentDog?.name || 'None'
    });
    
    if (!currentDog) {
      console.error('❌ [ActivityModal] No dog selected');
      toast({
        title: "No dog selected",
        description: "Please select a dog first",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate the scheduled date with validation
    const dateResult = calculateScheduledDate(selectedDayOfWeek);
    
    if (!dateResult.isValid) {
      console.error('❌ [ActivityModal] Invalid date calculated:', dateResult.error);
      toast({
        title: "Invalid Date",
        description: dateResult.error || "Cannot schedule for the selected date",
        variant: "destructive"
      });
      return;
    }
    
    const currentWeek = getISOWeek(new Date(dateResult.date));
    
    const scheduledActivityData = {
      dogId: currentDog.id,
      activityId: activity.id,
      scheduledDate: dateResult.date,
      completed: false,
      notes: '',
      completionNotes: '',
      reminderEnabled: false,
      weekNumber: currentWeek,
      dayOfWeek: selectedDayOfWeek
    };
    
    console.log('📋 [ActivityModal] Preparing to schedule activity:', {
      ...scheduledActivityData,
      dogName: currentDog.name
    });
    
    try {
      console.log('⏳ [ActivityModal] Calling addScheduledActivity...');
      await addScheduledActivity(scheduledActivityData);
      
      console.log('✅ [ActivityModal] Activity scheduled successfully');
      toast({
        title: "Activity Scheduled!",
        description: "Activity has been added to your weekly plan."
      });
      
      onClose();
      navigate('/dog-profile-dashboard/weekly-plan');
    } catch (error) {
      console.error('❌ [ActivityModal] Error scheduling activity:', error);
      // Don't show another toast here as the addScheduledActivity function already handles it
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
      navigate('/dog-profile-dashboard/weekly-plan');
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


import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target } from 'lucide-react';
import DaySelector from './DaySelector';
import ActivityModalTabs from './ActivityModalTabs';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { getPillarActivities } from '@/data/activityLibrary';
import { useNavigate } from 'react-router-dom';
import { SchedulingValidator } from '@/utils/schedulingValidation';
import { toast } from '@/hooks/use-toast';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPillar?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedPillar
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const { discoveredActivities, addScheduledActivity, addUserActivity } = useActivity();
  const { currentDog } = useDog();
  
  // State for CreateCustomTab
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [materials, setMaterials] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  
  // State for weekly scheduling
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(new Date().getDay());
  
  const pendingActivities = discoveredActivities.filter(activity => 
    !activity.approved && !activity.rejected
  );
  
  // Get filtered library activities based on selected pillar
  const allLibraryActivities = getPillarActivities(selectedPillar || '');
  const filteredLibraryActivities = selectedPillar 
    ? allLibraryActivities.filter(activity => activity.pillar === selectedPillar)
    : allLibraryActivities;

  // Enhanced ISO week calculation
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

  // Enhanced date calculation with validation
  function calculateScheduledDate(selectedDayOfWeek: number): { date: string; isValid: boolean; error?: string } {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    
    let daysUntilSelectedDay = selectedDayOfWeek - currentDayOfWeek;
    
    // If the selected day is today or in the past this week, schedule for next week
    if (daysUntilSelectedDay <= 0) {
      daysUntilSelectedDay += 7;
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilSelectedDay);
    
    const scheduledDateString = targetDate.toISOString().split('T')[0];
    
    // Validate the calculated date
    const validation = SchedulingValidator.validateScheduledDate(scheduledDateString);
    
    return {
      date: scheduledDateString,
      isValid: validation.isValid,
      error: validation.errors[0]
    };
  }

  const handleActivitySelect = async (activity: any) => {
    console.log('Selecting activity:', activity);
    console.log('Selected day of week:', selectedDayOfWeek);
    console.log('Current dog:', currentDog);
    
    if (!currentDog) {
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
      toast({
        title: "Invalid Date",
        description: dateResult.error || "Cannot schedule for the selected date",
        variant: "destructive"
      });
      return;
    }
    
    const currentWeek = getISOWeek(new Date(dateResult.date));
    
    console.log('Calculated date:', dateResult.date);
    console.log('Week number:', currentWeek);
    
    try {
      await addScheduledActivity({
        dogId: currentDog.id,
        activityId: activity.id,
        scheduledDate: dateResult.date,
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
      // Don't show another toast here as the addScheduledActivity function already handles it
    }
  };

  const handleCreateCustomActivity = async () => {
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
      
      // Reset form
      setActivityName('');
      setPillar(selectedPillar || '');
      setDuration('');
      setMaterials('');
      setInstructions('');
      setDescription('');
      
      onClose();
      navigate('/dog-profile-dashboard/weekly-plan');
    } catch (error) {
      console.error('Error creating custom activity:', error);
      // Don't show another toast here as the addUserActivity function already handles it
    }
  };

  const handleCancelCustomActivity = () => {
    // Reset form
    setActivityName('');
    setPillar(selectedPillar || '');
    setDuration('');
    setMaterials('');
    setInstructions('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-2xl">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-purple-800">Add Activity</span>
          </DialogTitle>
        </DialogHeader>

        <DaySelector 
          selectedDayOfWeek={selectedDayOfWeek}
          onDaySelect={setSelectedDayOfWeek}
        />
        
        <ActivityModalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedPillar={selectedPillar}
          filteredLibraryActivities={filteredLibraryActivities}
          onActivitySelect={handleActivitySelect}
          pendingActivities={pendingActivities}
          discoveredActivities={discoveredActivities}
          activityName={activityName}
          setActivityName={setActivityName}
          pillar={pillar}
          setPillar={setPillar}
          duration={duration}
          setDuration={setDuration}
          materials={materials}
          setMaterials={setMaterials}
          instructions={instructions}
          setInstructions={setInstructions}
          description={description}
          setDescription={setDescription}
          onCreateCustomActivity={handleCreateCustomActivity}
          onCancelCustomActivity={handleCancelCustomActivity}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;

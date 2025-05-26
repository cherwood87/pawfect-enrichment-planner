
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ActivityModalHeader from './ActivityModalHeader';
import DaySelector from './DaySelector';
import ActivityModalTabs from './ActivityModalTabs';
import { useActivity } from '@/contexts/ActivityContext';
import { getPillarActivities } from '@/data/activityLibrary';
import { useNavigate } from 'react-router-dom'; // <-- Add this import

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
  const navigate = useNavigate(); // <-- Add this line
  const [activeTab, setActiveTab] = useState('browse');
  const { discoveredActivities, addScheduledActivity, addUserActivity } = useActivity();
  
  // State for CreateCustomTab
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [materials, setMaterials] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  
  // State for weekly scheduling
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(0);
  
  const pendingActivities = discoveredActivities.filter(activity => 
    !activity.approved && !activity.rejected
  );
  
  // Get filtered library activities based on selected pillar
  const allLibraryActivities = getPillarActivities(selectedPillar || '');
  const filteredLibraryActivities = selectedPillar 
    ? allLibraryActivities.filter(activity => activity.pillar === selectedPillar)
    : allLibraryActivities;

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

  const handleActivitySelect = (activity: any) => {
    const scheduledTime = '12:00 PM';
    const currentWeek = getISOWeek(new Date());
    
    // Calculate the date for the selected day of the week
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const daysUntilSelectedDay = selectedDayOfWeek - currentDayOfWeek;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilSelectedDay);
    
    const scheduledDate = targetDate.toISOString().split('T')[0];
    
    addScheduledActivity({
      activityId: activity.id,
      scheduledTime: scheduledTime,
      userSelectedTime: scheduledTime,
      scheduledDate: scheduledDate,
      completed: false,
      notes: '',
      completionNotes: '',
      reminderEnabled: false,
      weekNumber: currentWeek,
      dayOfWeek: selectedDayOfWeek
    });
    
    onClose();
    navigate('/dog-profile-dashboard/weekly-plan'); // <-- Add this line
  };

  const handleCreateCustomActivity = () => {
    if (!activityName || !pillar || !duration) return;

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

    addUserActivity(newActivity);
    
    // Reset form
    setActivityName('');
    setPillar(selectedPillar || '');
    setDuration('');
    setMaterials('');
    setInstructions('');
    setDescription('');
    
    onClose();
    navigate('/dog-profile-dashboard/weekly-plan'); // <-- Add this line if you want navigation on custom activity creation too
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
        <ActivityModalHeader onClose={onClose} />

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
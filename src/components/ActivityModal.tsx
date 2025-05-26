import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import BrowseLibraryTab from './BrowseLibraryTab';
import CreateCustomTab from './CreateCustomTab';
import DiscoveryReview from './DiscoveryReview';
import { useActivity } from '@/contexts/ActivityContext';
import { getPillarActivities } from '@/data/activityLibrary';

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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Activity Library
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Day Selection - Always Visible */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Select Day for Weekly Plan</h3>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day, index) => (
              <Button
                key={day}
                variant={selectedDayOfWeek === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDayOfWeek(index)}
                className="text-xs"
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Library</TabsTrigger>
            <TabsTrigger value="create">Create Custom</TabsTrigger>
            <TabsTrigger value="review" className="relative">
              Discovery Review
              {pendingActivities.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingActivities.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <BrowseLibraryTab 
              selectedPillar={selectedPillar}
              filteredLibraryActivities={filteredLibraryActivities}
              onActivitySelect={handleActivitySelect}
              schedulingMode="weekly"
            />
          </TabsContent>
          
          <TabsContent value="create">
            <CreateCustomTab 
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
              onSubmit={handleCreateCustomActivity}
              onCancel={handleCancelCustomActivity}
            />
          </TabsContent>
          
          <TabsContent value="review">
            <DiscoveryReview 
              activities={discoveredActivities}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;

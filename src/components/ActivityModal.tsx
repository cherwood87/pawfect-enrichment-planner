
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

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, selectedPillar }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const { discoveredActivities, addScheduledActivity, addUserActivity } = useActivity();
  
  // State for CreateCustomTab
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [materials, setMaterials] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  
  const pendingActivities = discoveredActivities.filter(activity => 
    !activity.approved && !activity.rejected
  );
  
  // Get filtered library activities based on selected pillar
  const allLibraryActivities = getPillarActivities(selectedPillar || '');
  const filteredLibraryActivities = selectedPillar 
    ? allLibraryActivities.filter(activity => activity.pillar === selectedPillar)
    : allLibraryActivities;

  const handleActivitySelect = (activity: any) => {
    // Schedule the activity for the current day at a default time
    const scheduledDate = new Date().toISOString().split('T')[0];
    const scheduledTime = '12:00 PM';
    
    addScheduledActivity({
      activityId: activity.id,
      scheduledTime: scheduledTime,
      userSelectedTime: scheduledTime,
      scheduledDate: scheduledDate,
      completed: false,
      notes: '',
      completionNotes: '',
      reminderEnabled: false
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

  const handleScheduleActivity = (activityId: string, scheduledTime: string, notes?: string) => {
    const scheduledDate = new Date().toISOString().split('T')[0];
    
    // Handle scheduling logic here
    console.log('Scheduling activity:', { activityId, scheduledTime, scheduledDate, notes });
    onClose();
  };

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


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Target } from 'lucide-react';
import { activityLibrary, getPillarActivities } from '@/data/activityLibrary';
import { useActivity } from '@/contexts/ActivityContext';
import ActivityCard from '@/components/ActivityCard';
import BrowseLibraryTab from '@/components/BrowseLibraryTab';
import CreateCustomTab from '@/components/CreateCustomTab';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPillar?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, selectedPillar }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const { addScheduledActivity, addUserActivity } = useActivity();
  
  // Custom activity form state
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [materials, setMaterials] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleCustomSubmit = () => {
    if (!activityName || !pillar || !duration) return;

    // Create custom activity
    const customActivity = {
      title: activityName,
      pillar: pillar as any,
      difficulty: 'Medium' as const,
      duration: parseInt(duration) || 15,
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      emotionalGoals: ['Custom activity'],
      instructions: instructions.split('\n').filter(Boolean),
      benefits: description || 'Custom enrichment activity',
      tags: ['custom'],
      ageGroup: 'All Ages' as const,
      energyLevel: 'Medium' as const,
      isCustom: true
    };

    addUserActivity(customActivity);

    // Reset form
    setActivityName('');
    setPillar('');
    setDuration('');
    setDescription('');
    setScheduledTime('');
    setMaterials('');
    setInstructions('');
    onClose();
  };

  const handleLibraryActivitySelect = (activity: any) => {
    const now = new Date();
    const defaultTime = `${now.getHours() + 1}:00 ${now.getHours() + 1 >= 12 ? 'PM' : 'AM'}`;
    const scheduleTime = scheduledTime || defaultTime;
    const scheduleDate = now.toISOString().split('T')[0];

    addScheduledActivity({
      activityId: activity.id,
      scheduledTime: scheduleTime,
      scheduledDate: scheduleDate,
      completed: false
    });

    onClose();
  };

  const filteredLibraryActivities = selectedPillar 
    ? getPillarActivities(selectedPillar)
    : activityLibrary;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">Add Activity</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Browse Library</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Create Custom</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <BrowseLibraryTab
                selectedPillar={selectedPillar}
                filteredLibraryActivities={filteredLibraryActivities}
                onActivitySelect={setSelectedActivity}
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
                onSubmit={handleCustomSubmit}
                onCancel={onClose}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityCard 
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </>
  );
};

export default ActivityModal;

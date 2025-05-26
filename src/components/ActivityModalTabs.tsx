
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrowseLibraryTab from './BrowseLibraryTab';
import CreateCustomTab from './CreateCustomTab';
import DiscoveryReview from './DiscoveryReview';
import { DiscoveredActivity } from '@/types/discovery';

interface ActivityModalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedPillar?: string | null;
  filteredLibraryActivities: any[];
  onActivitySelect: (activity: any) => void;
  pendingActivities: DiscoveredActivity[];
  discoveredActivities: DiscoveredActivity[];
  // Create Custom Tab props
  activityName: string;
  setActivityName: (name: string) => void;
  pillar: string;
  setPillar: (pillar: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  materials: string;
  setMaterials: (materials: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  description: string;
  setDescription: (description: string) => void;
  onCreateCustomActivity: () => void;
  onCancelCustomActivity: () => void;
}

const ActivityModalTabs: React.FC<ActivityModalTabsProps> = ({
  activeTab,
  onTabChange,
  selectedPillar,
  filteredLibraryActivities,
  onActivitySelect,
  pendingActivities,
  discoveredActivities,
  activityName,
  setActivityName,
  pillar,
  setPillar,
  duration,
  setDuration,
  materials,
  setMaterials,
  instructions,
  setInstructions,
  description,
  setDescription,
  onCreateCustomActivity,
  onCancelCustomActivity
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
          onActivitySelect={onActivitySelect}
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
          onSubmit={onCreateCustomActivity}
          onCancel={onCancelCustomActivity}
        />
      </TabsContent>
      
      <TabsContent value="review">
        <DiscoveryReview 
          activities={discoveredActivities}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ActivityModalTabs;

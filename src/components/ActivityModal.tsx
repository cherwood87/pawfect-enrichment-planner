
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import BrowseLibraryTab from './BrowseLibraryTab';
import CreateCustomTab from './CreateCustomTab';
import DiscoveryReview from './DiscoveryReview';
import { useActivity } from '@/contexts/ActivityContext';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPillar?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, selectedPillar }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const { discoveredActivities } = useActivity();
  
  const pendingActivities = discoveredActivities.filter(activity => 
    !activity.isApproved && !activity.isRejected
  );
  
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
              onScheduleActivity={handleScheduleActivity}
            />
          </TabsContent>
          
          <TabsContent value="create">
            <CreateCustomTab onClose={onClose} />
          </TabsContent>
          
          <TabsContent value="review">
            <DiscoveryReview />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;

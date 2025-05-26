
import React from 'react';
import { getPillarActivities } from '@/data/activityLibrary';
import ActivityListItem from './ActivityListItem';

interface BrowseLibraryTabProps {
  selectedPillar?: string | null;
  filteredLibraryActivities: any[];
  onActivitySelect: (activity: any) => void;
  schedulingMode?: 'daily' | 'weekly';
}

const BrowseLibraryTab: React.FC<BrowseLibraryTabProps> = ({
  filteredLibraryActivities,
  onActivitySelect,
  schedulingMode = 'daily'
}) => {
  const scheduleButtonText = 'Add to Weekly Plan';

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-gray-600">Choose from our curated collection of enrichment activities</p>
        <p className="text-sm text-blue-600 mt-1">
          Activities will be added to your weekly enrichment plan
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLibraryActivities.map((activity) => (
          <ActivityListItem
            key={activity.id}
            activity={activity}
            onSelect={onActivitySelect}
            buttonText={scheduleButtonText}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseLibraryTab;


import React, { memo, useMemo } from 'react';
import ActivityListItem from './ActivityListItem';

interface BrowseLibraryTabProps {
  selectedPillar?: string | null;
  filteredLibraryActivities: any[];
  onActivitySelect: (activity: any) => void;
}

const BrowseLibraryTabOptimized = memo<BrowseLibraryTabProps>(({
  filteredLibraryActivities,
  onActivitySelect
}) => {
  // Memoize the activity items to prevent unnecessary re-renders
  const activityItems = useMemo(() => 
    filteredLibraryActivities.map((activity) => (
      <ActivityListItem
        key={activity.id}
        activity={activity}
        onSelect={onActivitySelect}
        buttonText="Add to Weekly Plan"
      />
    )), 
    [filteredLibraryActivities, onActivitySelect]
  );

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-gray-600">Choose from our curated collection of enrichment activities</p>
        <p className="text-sm text-blue-600 mt-1">
          Activities will be added to your weekly enrichment plan
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activityItems}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.filteredLibraryActivities.length === nextProps.filteredLibraryActivities.length &&
    prevProps.filteredLibraryActivities.every((activity, index) => 
      activity.id === nextProps.filteredLibraryActivities[index]?.id
    )
  );
});

BrowseLibraryTabOptimized.displayName = 'BrowseLibraryTabOptimized';

export default BrowseLibraryTabOptimized;

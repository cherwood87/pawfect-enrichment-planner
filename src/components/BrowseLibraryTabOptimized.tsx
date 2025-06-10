
import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import ActivityCard from './ActivityCard';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useBundleAnalytics } from '@/hooks/useBundleAnalytics';

interface BrowseLibraryTabOptimizedProps {
  selectedPillar?: string | null;
  filteredLibraryActivities: (ActivityLibraryItem | DiscoveredActivity)[];
  onActivitySelect: (activity: ActivityLibraryItem | DiscoveredActivity) => void;
}

// Memoized activity item component
const ActivityItem = memo<{
  index: number;
  style: React.CSSProperties;
  data: {
    activities: (ActivityLibraryItem | DiscoveredActivity)[];
    onActivitySelect: (activity: ActivityLibraryItem | DiscoveredActivity) => void;
  };
}>(({ index, style, data }) => {
  const activity = data.activities[index];
  
  if (!activity) return null;

  return (
    <div style={style} className="px-2 py-1">
      <ActivityCard
        activity={activity}
        onSelect={() => data.onActivitySelect(activity)}
      />
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

const BrowseLibraryTabOptimized: React.FC<BrowseLibraryTabOptimizedProps> = ({
  selectedPillar,
  filteredLibraryActivities,
  onActivitySelect
}) => {
  const { getMetrics } = useBundleAnalytics('BrowseLibraryTabOptimized');

  // Memoize the item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    activities: filteredLibraryActivities,
    onActivitySelect
  }), [filteredLibraryActivities, onActivitySelect]);

  // Memoized dimensions based on screen size
  const { listHeight, listWidth, itemHeight } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    return {
      listHeight: isMobile ? 400 : 600,
      listWidth: Math.min(window.innerWidth - 32, 800), // Max width with padding
      itemHeight: isMobile ? 120 : 140
    };
  }, []);

  // Early return for empty state
  if (!filteredLibraryActivities || filteredLibraryActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {selectedPillar 
            ? `No activities found for ${selectedPillar} pillar` 
            : 'No activities available'
          }
        </p>
      </div>
    );
  }

  // Use virtualization for large lists (>20 items)
  if (filteredLibraryActivities.length > 20) {
    return (
      <div className="w-full">
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredLibraryActivities.length} activities
          {selectedPillar && ` for ${selectedPillar} pillar`}
        </div>
        <List
          height={listHeight}
          width={listWidth}
          itemCount={filteredLibraryActivities.length}
          itemSize={itemHeight}
          itemData={itemData}
          className="rounded-lg border border-gray-200"
        >
          {ActivityItem}
        </List>
      </div>
    );
  }

  // For smaller lists, use regular grid layout
  return (
    <div className="w-full">
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredLibraryActivities.length} activities
        {selectedPillar && ` for ${selectedPillar} pillar`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLibraryActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onSelect={() => onActivitySelect(activity)}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(BrowseLibraryTabOptimized);

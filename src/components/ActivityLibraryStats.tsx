
import React from 'react';

interface ActivityLibraryStatsProps {
  filteredActivitiesCount: number;
  curatedCount: number;
  autoApprovedCount: number;
  pendingReviewCount: number;
}

const ActivityLibraryStats: React.FC<ActivityLibraryStatsProps> = ({
  filteredActivitiesCount,
  curatedCount,
  autoApprovedCount,
  pendingReviewCount
}) => {
  return (
    <div className="text-sm text-muted-foreground">
      <span>
        {filteredActivitiesCount} activit{filteredActivitiesCount === 1 ? 'y' : 'ies'} found
      </span>
    </div>
  );
};

export default ActivityLibraryStats;

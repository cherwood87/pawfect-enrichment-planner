
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
    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
      <span>
        {filteredActivitiesCount} activit{filteredActivitiesCount === 1 ? 'y' : 'ies'} found
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-foreground/80">
        Curated: <strong className="font-semibold">{curatedCount}</strong>
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-foreground/80">
        Community Discovered: <strong className="font-semibold">{autoApprovedCount}</strong>
      </span>
    </div>
  );
};

export default ActivityLibraryStats;

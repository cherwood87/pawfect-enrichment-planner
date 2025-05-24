
import React from 'react';
import { DiscoveredActivity } from '@/types/discovery';

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
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>
        {filteredActivitiesCount} activit{filteredActivitiesCount === 1 ? 'y' : 'ies'} found
      </span>
      <div className="flex items-center space-x-4">
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Curated ({curatedCount})</span>
        </span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Auto-Added ({autoApprovedCount})</span>
        </span>
        {pendingReviewCount > 0 && (
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>Pending Review ({pendingReviewCount})</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ActivityLibraryStats;


import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import ActivityLibraryHeader from '@/components/ActivityLibraryHeader';
import ActivityLibraryFilters from '@/components/ActivityLibraryFilters';
import ActivityLibraryStats from '@/components/ActivityLibraryStats';

interface ActivityLibraryContentProps {
  autoApprovedCount: number;
  curatedCount: number;
  isDiscovering: boolean;
  onDiscoverMore: () => void;
  onChooseForMe?: () => void;
  canPickSuggested?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPillar: string;
  setSelectedPillar: (pillar: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  filteredActivitiesCount: number;
}

const ActivityLibraryContent: React.FC<ActivityLibraryContentProps> = memo(({
  autoApprovedCount,
  curatedCount,
  isDiscovering,
  onDiscoverMore,
  onChooseForMe,
  canPickSuggested,
  searchQuery,
  setSearchQuery,
  selectedPillar,
  setSelectedPillar,
  selectedDifficulty,
  setSelectedDifficulty,
  filteredActivitiesCount
}) => {
  return (
    <Card className="modern-card">
      <ActivityLibraryHeader
        autoApprovedCount={autoApprovedCount}
        curatedCount={curatedCount}
        isDiscovering={isDiscovering}
        onDiscoverMore={onDiscoverMore}
        onChooseForMe={onChooseForMe}
        canPickSuggested={canPickSuggested}
      />
      <CardContent className="space-y-6">
        <ActivityLibraryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPillar={selectedPillar}
          setSelectedPillar={setSelectedPillar}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />

        <ActivityLibraryStats
          filteredActivitiesCount={filteredActivitiesCount}
          curatedCount={curatedCount}
          autoApprovedCount={autoApprovedCount}
          pendingReviewCount={0} // No manual review anymore
        />
      </CardContent>
    </Card>
  );
});

ActivityLibraryContent.displayName = 'ActivityLibraryContent';

export default ActivityLibraryContent;

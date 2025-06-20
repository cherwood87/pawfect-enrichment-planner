import React, { memo } from "react";
import { useLightweightMonitor } from "@/hooks/useLightweightMonitor";
import AIDiscoverySection from "@/components/activity-library/AIDiscoverySection";
import SearchAndFilterSection from "@/components/activity-library/SearchAndFilterSection";

interface ActivityLibraryContentProps {
  autoApprovedCount: number;
  isDiscovering: boolean;
  onDiscoverMore: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPillar: string;
  setSelectedPillar: (pillar: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  filteredActivitiesCount: number;
  curatedCount: number;
  onManualSync?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncTime?: Date | null;
}

const ActivityLibraryContent: React.FC<ActivityLibraryContentProps> = ({
  autoApprovedCount,
  isDiscovering,
  onDiscoverMore,
  searchQuery,
  setSearchQuery,
  selectedPillar,
  setSelectedPillar,
  selectedDifficulty,
  setSelectedDifficulty,
  filteredActivitiesCount,
  curatedCount,
  onManualSync,
  isSyncing = false,
  lastSyncTime,
}) => {
  useLightweightMonitor("ActivityLibraryContent");

  return (
    <div className="space-y-6">
      <AIDiscoverySection
        autoApprovedCount={autoApprovedCount}
        curatedCount={curatedCount}
        isDiscovering={isDiscovering}
        onDiscoverMore={onDiscoverMore}
        onManualSync={onManualSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      <SearchAndFilterSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPillar={selectedPillar}
        setSelectedPillar={setSelectedPillar}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        filteredActivitiesCount={filteredActivitiesCount}
      />
    </div>
  );
};

export default memo(ActivityLibraryContent);

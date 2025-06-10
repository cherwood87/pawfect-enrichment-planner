
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import { useSimpleFiltering } from '@/hooks/useSimpleFiltering';
import { useLightweightMonitor } from '@/hooks/useLightweightMonitor';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import PillarSelectionCards from '@/components/PillarSelectionCards';
import ActivityLibraryContent from '@/components/ActivityLibraryContent';
import ActivityCard from '@/components/ActivityCard';

// Simple energy level normalization
const normalizeEnergyLevel = (level: string): "Low" | "Medium" | "High" => {
  if (!level) return "Medium";
  const l = level.toLowerCase();
  if (l.includes("low")) return "Low";
  if (l.includes("high")) return "High";
  return "Medium";
};

const ActivityLibrary = () => {
  useLightweightMonitor('ActivityLibrary');
  
  const { 
    getCombinedActivityLibrary, 
    discoveredActivities, 
    discoverNewActivities, 
    isDiscovering, 
    checkAndRunAutoDiscovery,
    isSyncing,
    lastSyncTime,
    syncToSupabase
  } = useActivity();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLibraryItem | DiscoveredActivity | null>(null);

  // Get normalized activities
  const normalizedActivities = useMemo(() => {
    return getCombinedActivityLibrary().map(activity =>
      activity && typeof activity.energyLevel === 'string'
        ? { ...activity, energyLevel: normalizeEnergyLevel(activity.energyLevel) }
        : activity
    );
  }, [getCombinedActivityLibrary]);

  // Use simple filtering instead of complex caching
  const filteredActivities = useSimpleFiltering(
    searchQuery,
    selectedPillar,
    selectedDifficulty,
    normalizedActivities
  );

  // Check for auto-discovery on mount
  useEffect(() => {
    if (checkAndRunAutoDiscovery) {
      checkAndRunAutoDiscovery();
    }
  }, [checkAndRunAutoDiscovery]);

  // Callback functions
  const handleDiscoverMore = useCallback(async () => {
    await discoverNewActivities();
  }, [discoverNewActivities]);

  const handleManualSync = useCallback(async () => {
    await syncToSupabase();
  }, [syncToSupabase]);

  const handleActivitySelect = useCallback((activity: ActivityLibraryItem | DiscoveredActivity) => {
    setSelectedActivity(activity);
  }, []);

  const handleActivityModalClose = useCallback(() => {
    setSelectedActivity(null);
  }, []);

  const handlePillarSelect = useCallback((pillar: string) => {
    setSelectedPillar(pillar);
  }, []);

  // Compute stats
  const { autoApprovedCount, curatedCount } = useMemo(() => {
    const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
      return 'source' in activity && activity.source === 'discovered';
    };

    return {
      autoApprovedCount: discoveredActivities.filter(a => a.approved).length,
      curatedCount: normalizedActivities.filter(a => !isDiscoveredActivity(a)).length
    };
  }, [discoveredActivities, normalizedActivities]);

  return (
    <div className="mobile-space-y">
      <PillarSelectionCards
        selectedPillar={selectedPillar}
        onPillarSelect={handlePillarSelect}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />
      
      <ActivityLibraryContent
        autoApprovedCount={autoApprovedCount}
        isDiscovering={isDiscovering}
        onDiscoverMore={handleDiscoverMore}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPillar={selectedPillar}
        setSelectedPillar={setSelectedPillar}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        filteredActivitiesCount={filteredActivities.length}
        curatedCount={curatedCount}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      {/* Simple activity grid without virtualization for better reliability */}
      <div className="modern-card">
        <div className="mobile-card">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onSelect={() => handleActivitySelect(activity)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ConsolidatedActivityModal
          isOpen={!!selectedActivity}
          onClose={handleActivityModalClose}
          activityDetails={selectedActivity}
          onToggleCompletion={() => {}}
          mode="library"
        />
      )}
    </div>
  );
};

export default ActivityLibrary;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ActivityLibraryItem } from "@/types/activity";
import { DiscoveredActivity } from "@/types/discovery";
import { useActivity } from "@/contexts/ActivityContext";
import { useSimpleFiltering } from "@/hooks/useSimpleFiltering";
import { useDiagnosticTracking } from "@/hooks/useDiagnosticTracking";
import ConsolidatedActivityModal from "@/components/modals/ConsolidatedActivityModal";
import PillarSelectionCards from "@/components/PillarSelectionCards";
import ActivityLibraryContent from "@/components/ActivityLibraryContent";
import ActivityCard from "@/components/ActivityCard";

// Simple energy level normalization
const normalizeEnergyLevel = (level: string): "Low" | "Medium" | "High" => {
  if (!level) return "Medium";
  const l = level.toLowerCase();
  if (l.includes("low")) return "Low";
  if (l.includes("high")) return "High";
  return "Medium";
};

const ActivityLibrary = () => {
  const { startCustomStage, completeCustomStage, recordMetric } =
    useDiagnosticTracking("ActivityLibrary");

  const {
    getCombinedActivityLibrary,
    discoveredActivities,
    discoverNewActivities,
    isDiscovering,
    checkAndRunAutoDiscovery,
    isSyncing,
    lastSyncTime,
    syncToSupabase,
  } = useActivity();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedActivity, setSelectedActivity] = useState<
    ActivityLibraryItem | DiscoveredActivity | null
  >(null);

  // Track data loading stages
  useEffect(() => {
    startCustomStage("Data Loading");

    const activities = getCombinedActivityLibrary();
    const loadTime = performance.now();

    completeCustomStage("Data Loading", {
      activitiesCount: activities.length,
      discoveredCount: discoveredActivities.length,
    });

    recordMetric("Activities Loaded", loadTime);
  }, [
    startCustomStage,
    completeCustomStage,
    recordMetric,
    getCombinedActivityLibrary,
    discoveredActivities.length,
  ]);

  // Get normalized activities with performance tracking
  const normalizedActivities = useMemo(() => {
    const startTime = performance.now();
    startCustomStage("Activity Normalization");

    const normalized = getCombinedActivityLibrary().map((activity) =>
      activity && typeof activity.energyLevel === "string"
        ? {
            ...activity,
            energyLevel: normalizeEnergyLevel(activity.energyLevel),
          }
        : activity,
    );

    const processingTime = performance.now() - startTime;
    completeCustomStage("Activity Normalization");
    recordMetric("Normalization Time", processingTime);

    return normalized;
  }, [
    getCombinedActivityLibrary,
    startCustomStage,
    completeCustomStage,
    recordMetric,
  ]);

  // Use simple filtering with performance tracking
  const filteredActivities = useSimpleFiltering(
    searchQuery,
    selectedPillar,
    selectedDifficulty,
    normalizedActivities,
  );

  // Track filtering performance
  useEffect(() => {
    const filteringTime = performance.now();
    startCustomStage("Activity Filtering");

    setTimeout(() => {
      completeCustomStage("Activity Filtering", {
        totalActivities: normalizedActivities.length,
        filteredCount: filteredActivities.length,
        searchQuery,
        selectedPillar,
        selectedDifficulty,
      });

      const processingTime = performance.now() - filteringTime;
      recordMetric("Filtering Time", processingTime);
    }, 0);
  }, [
    filteredActivities.length,
    normalizedActivities.length,
    searchQuery,
    selectedPillar,
    selectedDifficulty,
    startCustomStage,
    completeCustomStage,
    recordMetric,
  ]);

  // Check for auto-discovery on mount with tracking
  useEffect(() => {
    if (checkAndRunAutoDiscovery) {
      startCustomStage("Auto Discovery Check");

      checkAndRunAutoDiscovery()
        .then(() => {
          completeCustomStage("Auto Discovery Check");
        })
        .catch((error) => {
          console.error("Auto discovery failed:", error);
        });
    }
  }, [checkAndRunAutoDiscovery, startCustomStage, completeCustomStage]);

  // Callback functions with performance tracking
  const handleDiscoverMore = useCallback(async () => {
    startCustomStage("Manual Discovery");
    const startTime = performance.now();

    try {
      await discoverNewActivities();
      const discoveryTime = performance.now() - startTime;
      completeCustomStage("Manual Discovery");
      recordMetric("Discovery Time", discoveryTime);
    } catch (error) {
      console.error("Manual discovery failed:", error);
    }
  }, [
    discoverNewActivities,
    startCustomStage,
    completeCustomStage,
    recordMetric,
  ]);

  const handleManualSync = useCallback(async () => {
    startCustomStage("Manual Sync");
    const startTime = performance.now();

    try {
      await syncToSupabase();
      const syncTime = performance.now() - startTime;
      completeCustomStage("Manual Sync");
      recordMetric("Sync Time", syncTime);
    } catch (error) {
      console.error("Manual sync failed:", error);
    }
  }, [syncToSupabase, startCustomStage, completeCustomStage, recordMetric]);

  const handleActivitySelect = useCallback(
    (activity: ActivityLibraryItem | DiscoveredActivity) => {
      startCustomStage("Activity Selection");
      setSelectedActivity(activity);
      recordMetric("Activity Select Time", 0);
      completeCustomStage("Activity Selection");
    },
    [startCustomStage, completeCustomStage, recordMetric],
  );

  const handleActivityModalClose = useCallback(() => {
    startCustomStage("Modal Close");
    setSelectedActivity(null);
    completeCustomStage("Modal Close");
  }, [startCustomStage, completeCustomStage]);

  const handlePillarSelect = useCallback(
    (pillar: string) => {
      startCustomStage("Pillar Selection");
      setSelectedPillar(pillar);
      recordMetric("Pillar Change Time", 0);
      completeCustomStage("Pillar Selection");
    },
    [startCustomStage, completeCustomStage, recordMetric],
  );

  // Compute stats with performance tracking
  const { autoApprovedCount, curatedCount } = useMemo(() => {
    const startTime = performance.now();
    startCustomStage("Stats Calculation");

    const isDiscoveredActivity = (
      activity: ActivityLibraryItem | DiscoveredActivity,
    ): activity is DiscoveredActivity => {
      return "source" in activity && activity.source === "discovered";
    };

    const stats = {
      autoApprovedCount: discoveredActivities.filter((a) => a.approved).length,
      curatedCount: normalizedActivities.filter((a) => !isDiscoveredActivity(a))
        .length,
    };

    const calculationTime = performance.now() - startTime;
    completeCustomStage("Stats Calculation");
    recordMetric("Stats Calculation Time", calculationTime);

    return stats;
  }, [
    discoveredActivities,
    normalizedActivities,
    startCustomStage,
    completeCustomStage,
    recordMetric,
  ]);

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

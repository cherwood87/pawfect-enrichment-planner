
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useActivityFiltering } from '@/hooks/useActivityFiltering';
import ActivityLibraryGrid from '@/components/ActivityLibraryGrid';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import { usePersonalizedActivities } from '@/hooks/usePersonalizedActivities';
import ActivityLibraryFilters from '@/components/ActivityLibraryFilters';
import ActivityLibraryActionsBar from '@/components/ActivityLibraryActionsBar';

// Energy level normalization function
const normalizeEnergyLevel = (level: string): 'Low' | 'Medium' | 'High' => {
  if (!level) return 'Medium';
  const l = level.toLowerCase();
  if (l.includes('very low')) return 'Low';
  if (l.includes('low') && l.includes('moderate')) return 'Medium';
  if (l.includes('low')) return 'Low';
  if (l.includes('moderate') && l.includes('high')) return 'High';
  if (l.includes('moderate')) return 'Medium';
  if (l.includes('high')) return 'High';
  return 'Medium';
};

const ActivityLibrary = React.memo(() => {
  const {
    getCombinedActivityLibrary,
    discoveredActivities,
    discoverNewActivities,
    isDiscovering,
  } = useActivity();

  const { currentDog } = useDog();

  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLibraryItem | DiscoveredActivity | null>(null);
  const [currentActivities, setCurrentActivities] = useState<(ActivityLibraryItem | DiscoveredActivity)[]>([]);
  const [topPicks, setTopPicks] = useState<(ActivityLibraryItem | DiscoveredActivity)[]>([]);

  // Memoize normalized activities
  const normalizedActivities = useMemo(() => {
    return getCombinedActivityLibrary().map((activity) =>
      activity && typeof activity.energyLevel === 'string'
        ? { ...activity, energyLevel: normalizeEnergyLevel(activity.energyLevel) }
        : activity
    );
  }, [getCombinedActivityLibrary]);

  // Initialize activities
  useEffect(() => {
    setCurrentActivities(normalizedActivities);
  }, [normalizedActivities]);

  // Filtering hook (no search, unified feed)
  const filteredActivities = useActivityFiltering(
    selectedPillar,
    selectedDifficulty,
    selectedDuration,
    currentActivities,
    currentDog
  );

  // Personalized picks
  const { personalizedActivities } = usePersonalizedActivities(currentActivities, currentDog, currentActivities.length || 20);

  const handleDiscoverMore = useCallback(async () => {
    await discoverNewActivities();
  }, [discoverNewActivities]);

  const handleActivitySelect = useCallback((activity: ActivityLibraryItem | DiscoveredActivity) => {
    setSelectedActivity(activity);
  }, []);

  const handleActivityModalClose = useCallback(() => {
    setSelectedActivity(null);
  }, []);

  const shuffleArray = useCallback((list: (ActivityLibraryItem | DiscoveredActivity)[]) => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const handleShuffle = useCallback(() => {
    setTopPicks([]); // clear picks when shuffling entire library
    setCurrentActivities((prev) => shuffleArray(prev));
  }, [shuffleArray]);

  const handleChooseForMe = useCallback(() => {
    // Get available activities for randomization
    const availableActivities = personalizedActivities.length > 0 
      ? personalizedActivities 
      : filteredActivities;
    
    if (availableActivities.length === 0) return;
    
    // Select a random activity, avoiding the last few selected ones
    const lastSelectedIds = new Set([selectedActivity?.id].filter(Boolean));
    const eligibleActivities = availableActivities.filter(activity => !lastSelectedIds.has(activity.id));
    const activitiesToChooseFrom = eligibleActivities.length > 0 ? eligibleActivities : availableActivities;
    
    const randomIndex = Math.floor(Math.random() * activitiesToChooseFrom.length);
    const randomActivity = activitiesToChooseFrom[randomIndex];
    
    // Immediately show the activity in the modal
    setSelectedActivity(randomActivity);
  }, [personalizedActivities, filteredActivities, selectedActivity?.id]);

  // Compose displayed list: top picks (if any) followed by rest (deduped)
  const displayedActivities = useMemo(() => {
    if (topPicks.length === 0) return filteredActivities;
    const pickIds = new Set(topPicks.map((a) => a.id));
    const rest = filteredActivities.filter((a) => !pickIds.has(a.id));
    return [...topPicks, ...rest];
  }, [topPicks, filteredActivities]);

  return (
    <div className="mobile-space-y">
      {/* Actions */}
      <ActivityLibraryActionsBar
        onChooseForMe={handleChooseForMe}
        onDiscoverNew={handleDiscoverMore}
        onShuffle={handleShuffle}
        canChoose={normalizedActivities.length > 0}
        isDiscovering={isDiscovering}
      />

      {/* Single filter bar */}
      <div className="mt-2">
        <ActivityLibraryFilters
          selectedPillar={selectedPillar}
          setSelectedPillar={setSelectedPillar}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
        />
      </div>

      {/* Unified grid (top picks are injected above automatically) */}
      <ActivityLibraryGrid activities={displayedActivities} onActivitySelect={handleActivitySelect} />

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
});

export default ActivityLibrary;

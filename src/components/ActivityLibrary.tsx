import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import { useDog } from '@/contexts/DogContext';
import { useActivityFiltering } from '@/hooks/useActivityFiltering';
import ActivityCard from '@/components/ActivityCard';
import ConsolidatedActivityModal from '@/components/modals/ConsolidatedActivityModal';
import PillarSelectionCards from '@/components/PillarSelectionCards';
import ActivityLibraryContent from '@/components/ActivityLibraryContent';
import ActivityLibraryDebug from '@/components/ActivityLibraryDebug';
import ActivityLibraryGrid from '@/components/ActivityLibraryGrid';
import { PersonalizedActivityBanner } from '@/components/PersonalizedActivityBanner';
import { QuizPromptCard } from '@/components/QuizPromptCard';
import { usePersonalizedActivities } from '@/hooks/usePersonalizedActivities';

// Energy level normalization function
const normalizeEnergyLevel = (level: string): "Low" | "Medium" | "High" => {
  if (!level) return "Medium";
  const l = level.toLowerCase();
  if (l.includes("very low")) return "Low";
  if (l.includes("low") && l.includes("moderate")) return "Medium";
  if (l.includes("low")) return "Low";
  if (l.includes("moderate") && l.includes("high")) return "High";
  if (l.includes("moderate")) return "Medium";
  if (l.includes("high")) return "High";
  return "Medium";
};

const ActivityLibrary = React.memo(() => {
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
  
  const { currentDog } = useDog();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLibraryItem | DiscoveredActivity | null>(null);
  const [currentActivities, setCurrentActivities] = useState<(ActivityLibraryItem | DiscoveredActivity)[]>([]);
  const [suggestIndex, setSuggestIndex] = useState(0);

  // Memoize normalized activities to prevent unnecessary recalculations
  const normalizedActivities = useMemo(() => {
    return getCombinedActivityLibrary().map(activity =>
      activity && typeof activity.energyLevel === 'string'
        ? { ...activity, energyLevel: normalizeEnergyLevel(activity.energyLevel) }
        : activity
    );
  }, [getCombinedActivityLibrary]);

  // Initialize activities with weighted shuffling
  useEffect(() => {
    setCurrentActivities(normalizedActivities);
  }, [normalizedActivities]);

  // Check for auto-discovery on component mount
  useEffect(() => {
    if (checkAndRunAutoDiscovery) {
      checkAndRunAutoDiscovery();
    }
  }, [checkAndRunAutoDiscovery]);

  // Use the filtering hook with dog context for personalization
  const filteredActivities = useActivityFiltering(
    searchQuery,
    selectedPillar,
    selectedDifficulty,
    currentActivities,
    discoveredActivities,
    currentDog
  );

  // Memoize callback functions to prevent unnecessary re-renders
  const handleActivitiesReorder = useCallback((reorderedActivities: (ActivityLibraryItem | DiscoveredActivity)[]) => {
    setCurrentActivities(reorderedActivities);
  }, []);

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

  const handleTakeQuiz = useCallback(() => {
    window.location.href = '/quiz';
  }, []);

  const handlePillarSelect = useCallback((pillar: string) => {
    setSelectedPillar(pillar);
  }, []);

  // Memoize computed values
  const { autoApprovedCount, curatedCount } = useMemo(() => {
    const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
      return 'source' in activity && activity.source === 'discovered';
    };

    return {
      autoApprovedCount: discoveredActivities.filter(a => a.approved).length,
      curatedCount: currentActivities.filter(a => !isDiscoveredActivity(a)).length
    };
  }, [discoveredActivities, currentActivities]);

  // Check if activities are personalized (no filters and quiz results exist)
  const isPersonalized = selectedPillar === 'all' && selectedDifficulty === 'all' && !searchQuery && !!currentDog?.quizResults;

  // Build a personalized list for "Choose For Me"
  const { personalizedActivities } = usePersonalizedActivities(currentActivities, currentDog, currentActivities.length || 20);

  const pickSuggested = useCallback(() => {
    if (personalizedActivities.length === 0) return;
    const next = personalizedActivities[suggestIndex % personalizedActivities.length];
    setSelectedActivity(next);
    setSuggestIndex((i) => i + 1);
  }, [personalizedActivities, suggestIndex]);

  return (
    <div className="mobile-space-y">
      <PillarSelectionCards
        selectedPillar={selectedPillar}
        onPillarSelect={handlePillarSelect}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
      />

      {/* Show personalization banner when appropriate */}
      {currentDog && isPersonalized && (
        <PersonalizedActivityBanner 
          currentDog={currentDog} 
          isPersonalized={isPersonalized}
        />
      )}

      {/* Show quiz prompt for dogs without quiz results */}
      {currentDog && !currentDog.quizResults && (
        <QuizPromptCard 
          currentDog={currentDog}
          onTakeQuiz={handleTakeQuiz}
        />
      )}
      
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
      />

      {/* Simple inline "Choose For Me" control */}
      <div className="flex items-center gap-3 px-2">
        <button
          type="button"
          onClick={pickSuggested}
          className="modern-button-primary px-4 py-2 rounded-xl"
          disabled={personalizedActivities.length === 0}
        >
          {personalizedActivities.length === 0 ? 'Choose For Me (needs quiz)' : 'Choose For Me'}
        </button>
        {selectedActivity && (
          <button
            type="button"
            onClick={pickSuggested}
            className="modern-button-outline px-4 py-2 rounded-xl"
          >
            Re‑spin
          </button>
        )}
      </div>

      {/* Weighted Shuffling Debug Component */}
      <ActivityLibraryDebug 
        activities={currentActivities}
        onActivitiesReorder={handleActivitiesReorder}
      />

      {/* Activity Grid */}
      <ActivityLibraryGrid
        activities={filteredActivities}
        onActivitySelect={handleActivitySelect}
      />

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


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { searchCombinedActivities } from '@/data/activityLibrary';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useActivity } from '@/contexts/ActivityContext';
import ActivityCard from '@/components/ActivityCard';
import ActivityLibraryHeader from '@/components/ActivityLibraryHeader';
import ActivityLibraryFilters from '@/components/ActivityLibraryFilters';
import ActivityLibraryStats from '@/components/ActivityLibraryStats';
import ActivityLibraryGrid from '@/components/ActivityLibraryGrid';
import SyncButton from '@/components/SyncButton';

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

const pillarOptions = [
  { id: 'mental', color: 'purple', title: 'Mental Enrichment', description: "For the thinkers and problem-solvers. Games and challenges that flex your dog's brain." },
  { id: 'physical', color: 'green', title: 'Physical Enrichment', description: "For dogs who find peace in movement. Soft walks, play, strength-building." },
  { id: 'social', color: 'blue', title: 'Social Enrichment', description: "For dogs who connect through presence. Calm co-walking, play with friends." },
  { id: 'environmental', color: 'teal', title: 'Environmental Enrichment', description: "For the sensory seekers. Sniffing, grounding, discovering the world." },
  { id: 'instinctual', color: 'orange', title: 'Instinctual Enrichment', description: "For dogs who need to shred, chew, stalk, or forage." }
];

const pillarColors: Record<string, string> = {
  mental: "from-purple-100 to-purple-50 border-purple-300 focus:ring-purple-400",
  physical: "from-green-100 to-green-50 border-green-300 focus:ring-green-400",
  social: "from-blue-100 to-blue-50 border-blue-300 focus:ring-blue-400",
  environmental: "from-teal-100 to-teal-50 border-teal-300 focus:ring-teal-400",
  instinctual: "from-orange-100 to-orange-50 border-orange-300 focus:ring-orange-400",
};

const ActivityLibrary = () => {
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

  // Normalize energyLevel for all activities before using them
  const combinedActivities = getCombinedActivityLibrary().map(activity =>
    activity && typeof activity.energyLevel === 'string'
      ? { ...activity, energyLevel: normalizeEnergyLevel(activity.energyLevel) }
      : activity
  );

  // Check for auto-discovery on component mount
  useEffect(() => {
    if (checkAndRunAutoDiscovery) {
      checkAndRunAutoDiscovery();
    }
  }, [checkAndRunAutoDiscovery]);

  const filteredActivities = React.useMemo(() => {
    let activities = searchQuery ? searchCombinedActivities(searchQuery, discoveredActivities) : combinedActivities;
    
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }
    
    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    return activities;
  }, [searchQuery, selectedPillar, selectedDifficulty, combinedActivities, discoveredActivities]);

  const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
    return 'source' in activity && activity.source === 'discovered';
  };

  const handleDiscoverMore = async () => {
    await discoverNewActivities();
  };

  const handleManualSync = async () => {
    await syncToSupabase();
  };

  const autoApprovedCount = discoveredActivities.filter(a => a.approved).length;
  const curatedCount = combinedActivities.filter(a => !isDiscoveredActivity(a)).length;

  return (
    <div className="space-y-6">
      {/* Pillar Selection Cards */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Choose Your Enrichment Pillar</h2>
          <SyncButton
            onSync={handleManualSync}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillarOptions.map(pillar => (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id)}
              className={`
                border-2 rounded-xl text-left transition shadow-sm
                bg-gradient-to-br ${pillarColors[pillar.id]}
                p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1
                focus:outline-none focus:ring-2
                ${selectedPillar === pillar.id ? "ring-4 ring-offset-2 scale-105 border-4" : "border-opacity-70"}
              `}
              tabIndex={0}
              aria-label={`Show activities for ${pillar.title}`}
            >
              <div className="font-bold text-lg mb-2 text-gray-900">{pillar.title}</div>
              <div className="text-gray-800 text-base">{pillar.description}</div>
            </button>
          ))}
          {/* All Pillars button */}
          <button
            onClick={() => setSelectedPillar('all')}
            className={`
              border-2 rounded-xl text-left transition shadow-sm
              bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300 focus:ring-gray-400
              p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1
              focus:outline-none focus:ring-2
              ${selectedPillar === 'all' ? "ring-4 ring-offset-2 scale-105 border-4" : "border-opacity-70"}
            `}
            tabIndex={0}
            aria-label="Show all activities"
          >
            <div className="font-bold text-lg mb-2 text-gray-900">All Pillars</div>
            <div className="text-gray-800 text-base">Show every activity, regardless of pillar.</div>
          </button>
        </div>
      </div>
      
      <Card>
        <ActivityLibraryHeader
          autoApprovedCount={autoApprovedCount}
          isDiscovering={isDiscovering}
          onDiscoverMore={handleDiscoverMore}
        />
        <CardContent className="space-y-4">
          <ActivityLibraryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedPillar={selectedPillar}
            setSelectedPillar={setSelectedPillar}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
          />

          <ActivityLibraryStats
            filteredActivitiesCount={filteredActivities.length}
            curatedCount={curatedCount}
            autoApprovedCount={autoApprovedCount}
            pendingReviewCount={0} // No manual review anymore
          />
        </CardContent>
      </Card>

      {/* Activity Grid */}
      <ActivityLibraryGrid
        activities={filteredActivities}
        onActivitySelect={setSelectedActivity}
      />

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityCard 
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
};

export default ActivityLibrary;

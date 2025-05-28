
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
import ActivityLibraryDebug from '@/components/ActivityLibraryDebug';
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
  { 
    id: 'mental', 
    color: 'purple', 
    title: 'Mental Enrichment', 
    description: "For the thinkers and problem-solvers. Games and challenges that flex your dog's brain.",
    gradient: "from-purple-100 to-purple-50",
    borderColor: "border-purple-300"
  },
  { 
    id: 'physical', 
    color: 'green', 
    title: 'Physical Enrichment', 
    description: "For dogs who find peace in movement. Soft walks, play, strength-building.",
    gradient: "from-emerald-100 to-emerald-50",
    borderColor: "border-emerald-300"
  },
  { 
    id: 'social', 
    color: 'blue', 
    title: 'Social Enrichment', 
    description: "For dogs who connect through presence. Calm co-walking, play with friends.",
    gradient: "from-cyan-100 to-cyan-50",
    borderColor: "border-cyan-300"
  },
  { 
    id: 'environmental', 
    color: 'teal', 
    title: 'Environmental Enrichment', 
    description: "For the sensory seekers. Sniffing, grounding, discovering the world.",
    gradient: "from-teal-100 to-teal-50",
    borderColor: "border-teal-300"
  },
  { 
    id: 'instinctual', 
    color: 'orange', 
    title: 'Instinctual Enrichment', 
    description: "For dogs who need to shred, chew, stalk, or forage.",
    gradient: "from-amber-100 to-amber-50",
    borderColor: "border-amber-300"
  }
];

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
  const [currentActivities, setCurrentActivities] = useState<(ActivityLibraryItem | DiscoveredActivity)[]>([]);

  // Initialize activities with weighted shuffling
  useEffect(() => {
    const combinedActivities = getCombinedActivityLibrary().map(activity =>
      activity && typeof activity.energyLevel === 'string'
        ? { ...activity, energyLevel: normalizeEnergyLevel(activity.energyLevel) }
        : activity
    );
    setCurrentActivities(combinedActivities);
  }, [getCombinedActivityLibrary]);

  // Check for auto-discovery on component mount
  useEffect(() => {
    if (checkAndRunAutoDiscovery) {
      checkAndRunAutoDiscovery();
    }
  }, [checkAndRunAutoDiscovery]);

  const handleActivitiesReorder = (reorderedActivities: (ActivityLibraryItem | DiscoveredActivity)[]) => {
    setCurrentActivities(reorderedActivities);
  };

  const filteredActivities = React.useMemo(() => {
    let activities = searchQuery ? searchCombinedActivities(searchQuery, discoveredActivities) : currentActivities;
    
    if (selectedPillar !== 'all') {
      activities = activities.filter(activity => activity.pillar === selectedPillar);
    }
    
    if (selectedDifficulty !== 'all') {
      activities = activities.filter(activity => activity.difficulty === selectedDifficulty);
    }
    
    return activities;
  }, [searchQuery, selectedPillar, selectedDifficulty, currentActivities, discoveredActivities]);

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
  const curatedCount = currentActivities.filter(a => !isDiscoveredActivity(a)).length;

  return (
    <div className="mobile-space-y">
      {/* Enhanced Pillar Selection Cards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-800">Choose Your Enrichment Pillar</h2>
          <SyncButton
            onSync={handleManualSync}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
          />
        </div>
        
        <div className="mobile-grid mobile-gap">
          {pillarOptions.map(pillar => (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar.id)}
              className={`
                border-2 rounded-3xl text-left transition-all duration-300 shadow-lg hover:shadow-xl
                bg-gradient-to-br ${pillar.gradient} ${pillar.borderColor}
                mobile-card cursor-pointer hover:-translate-y-2
                focus:outline-none focus:ring-4 focus:ring-purple-200
                ${selectedPillar === pillar.id ? "ring-4 ring-purple-400 ring-offset-2 scale-105 border-4" : ""}
                group
              `}
              tabIndex={0}
              aria-label={`Show activities for ${pillar.title}`}
            >
              <div className="font-bold text-lg mb-3 text-gray-900 group-hover:text-purple-800 transition-colors">
                {pillar.title}
              </div>
              <div className="text-gray-700 text-sm leading-relaxed">
                {pillar.description}
              </div>
            </button>
          ))}
          
          {/* All Pillars button */}
          <button
            onClick={() => setSelectedPillar('all')}
            className={`
              border-2 rounded-3xl text-left transition-all duration-300 shadow-lg hover:shadow-xl
              bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300 focus:ring-gray-400
              mobile-card cursor-pointer hover:-translate-y-2
              focus:outline-none focus:ring-4 focus:ring-gray-200
              ${selectedPillar === 'all' ? "ring-4 ring-gray-400 ring-offset-2 scale-105 border-4" : ""}
              group
            `}
            tabIndex={0}
            aria-label="Show all activities"
          >
            <div className="font-bold text-lg mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
              All Pillars
            </div>
            <div className="text-gray-700 text-sm leading-relaxed">
              Show every activity, regardless of pillar.
            </div>
          </button>
        </div>
      </div>
      
      <Card className="modern-card">
        <ActivityLibraryHeader
          autoApprovedCount={autoApprovedCount}
          isDiscovering={isDiscovering}
          onDiscoverMore={handleDiscoverMore}
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
            filteredActivitiesCount={filteredActivities.length}
            curatedCount={curatedCount}
            autoApprovedCount={autoApprovedCount}
            pendingReviewCount={0} // No manual review anymore
          />
        </CardContent>
      </Card>

      {/* Weighted Shuffling Debug Component */}
      <ActivityLibraryDebug 
        activities={currentActivities}
        onActivitiesReorder={handleActivitiesReorder}
      />

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

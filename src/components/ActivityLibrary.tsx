
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

const ActivityLibrary = () => {
  const { getCombinedActivityLibrary, discoveredActivities, discoverNewActivities, isDiscovering, checkAndRunAutoDiscovery } = useActivity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLibraryItem | DiscoveredActivity | null>(null);

  const combinedActivities = getCombinedActivityLibrary();

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

  const autoApprovedCount = discoveredActivities.filter(a => a.approved).length;
  const curatedCount = combinedActivities.filter(a => !isDiscoveredActivity(a)).length;

  return (
    <div className="space-y-6">
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

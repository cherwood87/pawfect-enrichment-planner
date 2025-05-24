
import { useState } from 'react';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { activityLibrary, getDiscoveredActivities, saveDiscoveredActivities, getCombinedActivities } from '@/data/activityLibrary';
import { ActivityLibraryItem } from '@/types/activity';
import { Dog } from '@/types/dog';

export const useDiscoveryOperations = (
  discoveredActivities: DiscoveredActivity[],
  setDiscoveredActivities: (activities: DiscoveredActivity[]) => void,
  discoveryConfig: ContentDiscoveryConfig,
  setDiscoveryConfig: (config: ContentDiscoveryConfig) => void,
  currentDog: Dog | null
) => {
  const [isDiscovering, setIsDiscovering] = useState(false);

  const getCombinedActivityLibrary = (): (ActivityLibraryItem | DiscoveredActivity)[] => {
    const approvedDiscovered = discoveredActivities.filter(activity => activity.approved);
    return getCombinedActivities(approvedDiscovered);
  };

  const discoverNewActivities = async (): Promise<void> => {
    if (!currentDog || isDiscovering) return;
    
    setIsDiscovering(true);
    console.log('Starting enhanced content discovery for', currentDog.name);
    
    try {
      const existingActivities = [...activityLibrary, ...discoveredActivities];
      const newActivities = await ContentDiscoveryService.discoverNewActivities(
        existingActivities,
        { ...discoveryConfig, maxActivitiesPerDiscovery: 8 }
      );
      
      if (newActivities.length > 0) {
        const updatedDiscovered = [...discoveredActivities, ...newActivities];
        setDiscoveredActivities(updatedDiscovered);
        saveDiscoveredActivities(currentDog.id, updatedDiscovered);
        
        const updatedConfig = {
          ...discoveryConfig,
          lastDiscoveryRun: new Date().toISOString()
        };
        setDiscoveryConfig(updatedConfig);
        localStorage.setItem(`discoveryConfig-${currentDog.id}`, JSON.stringify(updatedConfig));
        
        const autoApproved = newActivities.filter(a => a.approved).length;
        const needsReview = newActivities.filter(a => !a.approved && !a.rejected).length;
        
        console.log(`Discovery complete! Found ${newActivities.length} new activities for ${currentDog.name}:`);
        console.log(`- ${autoApproved} automatically added to library (high quality)`);
        console.log(`- ${needsReview} pending your review`);
      } else {
        console.log('No new unique activities found in this discovery session');
      }
    } catch (error) {
      console.error('Discovery failed:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const approveDiscoveredActivity = (activityId: string) => {
    const updated = discoveredActivities.map(activity =>
      activity.id === activityId 
        ? { ...activity, approved: true, rejected: false, verified: true }
        : activity
    );
    setDiscoveredActivities(updated);
    if (currentDog) {
      saveDiscoveredActivities(currentDog.id, updated);
    }
  };

  const rejectDiscoveredActivity = (activityId: string) => {
    const updated = discoveredActivities.map(activity =>
      activity.id === activityId 
        ? { ...activity, approved: false, rejected: true }
        : activity
    );
    setDiscoveredActivities(updated);
    if (currentDog) {
      saveDiscoveredActivities(currentDog.id, updated);
    }
  };

  const updateDiscoveryConfig = (config: Partial<ContentDiscoveryConfig>) => {
    const updated = { ...discoveryConfig, ...config };
    setDiscoveryConfig(updated);
    if (currentDog) {
      localStorage.setItem(`discoveryConfig-${currentDog.id}`, JSON.stringify(updated));
    }
  };

  return {
    isDiscovering,
    getCombinedActivityLibrary,
    discoverNewActivities,
    approveDiscoveredActivity,
    rejectDiscoveredActivity,
    updateDiscoveryConfig
  };
};

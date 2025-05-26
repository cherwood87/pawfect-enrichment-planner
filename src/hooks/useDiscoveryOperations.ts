import { useState } from 'react';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { AIContentDiscoveryService } from '@/services/AIContentDiscoveryService';
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
    // Only include approved activities (all AI activities are auto-approved)
    const approvedDiscovered = discoveredActivities.filter(activity => activity.approved);
    return getCombinedActivities(approvedDiscovered);
  };

  const discoverNewActivities = async (): Promise<void> => {
    if (!currentDog || isDiscovering) return;
    
    setIsDiscovering(true);
    console.log('Starting AI-powered content discovery for', currentDog.name);
    
    try {
      const existingActivities = [...activityLibrary, ...discoveredActivities];
      const newActivities = await AIContentDiscoveryService.discoverNewActivities(
        existingActivities,
        { ...discoveryConfig, maxActivitiesPerDiscovery: 8 },
        currentDog
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
        
        console.log(`AI Discovery complete! Found ${newActivities.length} new activities for ${currentDog.name}`);
        console.log(`All ${newActivities.length} activities automatically added to library`);
      } else {
        console.log('No new unique activities found in this AI discovery session');
      }
    } catch (error) {
      console.error('AI Discovery failed:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Auto-discovery check on load
  const checkAndRunAutoDiscovery = async () => {
    if (!currentDog) return;
    
    if (AIContentDiscoveryService.shouldRunDiscovery(discoveryConfig)) {
      console.log('Running automatic weekly discovery...');
      await discoverNewActivities();
    }
  };

  // Legacy methods kept for compatibility but simplified
  const approveDiscoveredActivity = (activityId: string) => {
    // All AI activities are already auto-approved, but keep for compatibility
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
    // Keep for compatibility but unlikely to be used with auto-approval
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
    updateDiscoveryConfig,
    checkAndRunAutoDiscovery
  };
};

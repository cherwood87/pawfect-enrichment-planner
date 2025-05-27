import { useState } from 'react';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { AIContentDiscoveryService } from '@/services/AIContentDiscoveryService';
import { ContentDiscoveryService } from '@/services/ContentDiscoveryService';
import { activityLibrary, getCombinedActivities } from '@/data/activityLibrary';
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
    if (!currentDog || isDiscovering) {
      console.log('Discovery skipped: no dog or already discovering');
      return;
    }

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

        // Save discovered activities to Supabase
        await ContentDiscoveryService.createDiscoveredActivities(updatedDiscovered, currentDog.id);

        const updatedConfig = {
          ...discoveryConfig,
          lastDiscoveryRun: new Date().toISOString()
        };
        setDiscoveryConfig(updatedConfig);

        // Save config to Supabase
        await ContentDiscoveryService.saveDiscoveryConfig(updatedConfig, currentDog.id);

        console.log(`AI Discovery complete! Found ${newActivities.length} new activities for ${currentDog.name}`);
        console.log(`All ${newActivities.length} activities automatically added to library`);
      } else {
        console.log('No new unique activities found in this AI discovery session');

        // Still update the discovery config to prevent immediate re-runs
        const updatedConfig = {
          ...discoveryConfig,
          lastDiscoveryRun: new Date().toISOString()
        };
        setDiscoveryConfig(updatedConfig);
        await ContentDiscoveryService.saveDiscoveryConfig(updatedConfig, currentDog.id);
      }
    } catch (error) {
      console.error('AI Discovery failed:', error);

      // Update config even on failure to prevent infinite retries
      const updatedConfig = {
        ...discoveryConfig,
        lastDiscoveryRun: new Date().toISOString()
      };
      setDiscoveryConfig(updatedConfig);
      if (currentDog) {
        await ContentDiscoveryService.saveDiscoveryConfig(updatedConfig, currentDog.id);
      }
    } finally {
      setIsDiscovering(false);
    }
  };

  // Auto-discovery check on load with improved logic
  const checkAndRunAutoDiscovery = async () => {
    if (!currentDog) {
      console.log('Auto-discovery skipped: no current dog');
      return;
    }

    if (isDiscovering) {
      console.log('Auto-discovery skipped: already discovering');
      return;
    }

    const shouldRun = AIContentDiscoveryService.shouldRunDiscovery(discoveryConfig);
    if (shouldRun) {
      console.log('Running automatic weekly discovery...');
      await discoverNewActivities();
    } else {
      console.log('Auto-discovery not needed at this time');
    }
  };

  // Approve discovered activity and sync with Supabase
  const approveDiscoveredActivity = async (activityId: string) => {
    const updated = discoveredActivities.map(activity =>
      activity.id === activityId
        ? { ...activity, approved: true, rejected: false, verified: true }
        : activity
    );
    setDiscoveredActivities(updated);
    if (currentDog) {
      await ContentDiscoveryService.createDiscoveredActivities(updated, currentDog.id);
    }
  };

  // Reject discovered activity and sync with Supabase
  const rejectDiscoveredActivity = async (activityId: string) => {
    const updated = discoveredActivities.map(activity =>
      activity.id === activityId
        ? { ...activity, approved: false, rejected: true }
        : activity
    );
    setDiscoveredActivities(updated);
    if (currentDog) {
      await ContentDiscoveryService.createDiscoveredActivities(updated, currentDog.id);
    }
  };

  // Update discovery config in Supabase
  const updateDiscoveryConfig = async (config: Partial<ContentDiscoveryConfig>) => {
    const updated = { ...discoveryConfig, ...config };
    setDiscoveryConfig(updated);
    if (currentDog) {
      await ContentDiscoveryService.saveDiscoveryConfig(updated, currentDog.id);
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
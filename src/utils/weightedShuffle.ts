
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface WeightedActivity {
  activity: ActivityLibraryItem | DiscoveredActivity;
  weight: number;
}

export interface ShuffleWeights {
  discoveredActivity: number;
  libraryActivity: number;
  qualityBonus: number;
  recentDiscoveryBonus: number;
}

const DEFAULT_WEIGHTS: ShuffleWeights = {
  discoveredActivity: 3.0,  // 3x more likely to appear
  libraryActivity: 1.0,     // Base weight
  qualityBonus: 2.0,        // Bonus multiplier for high-quality activities
  recentDiscoveryBonus: 1.5 // Bonus for recently discovered activities
};

const isDiscoveredActivity = (activity: ActivityLibraryItem | DiscoveredActivity): activity is DiscoveredActivity => {
  return 'source' in activity && activity.source === 'discovered';
};

const isRecentlyDiscovered = (activity: DiscoveredActivity): boolean => {
  if (!activity.discovered_at) return false;
  const discoveredDate = new Date(activity.discovered_at);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return discoveredDate > weekAgo;
};

const calculateActivityWeight = (
  activity: ActivityLibraryItem | DiscoveredActivity,
  weights: ShuffleWeights = DEFAULT_WEIGHTS
): number => {
  let weight = weights.libraryActivity; // Base weight

  if (isDiscoveredActivity(activity)) {
    // Discovered activities get higher base weight
    weight = weights.discoveredActivity;

    // Quality bonus for high-scoring activities
    if (activity.qualityScore && activity.qualityScore > 0.8) {
      weight *= weights.qualityBonus;
    }

    // Recent discovery bonus
    if (isRecentlyDiscovered(activity)) {
      weight *= weights.recentDiscoveryBonus;
    }

    // Approved activities get slight bonus
    if (activity.approved) {
      weight *= 1.2;
    }
  }

  return weight;
};

export const weightedShuffle = <T extends ActivityLibraryItem | DiscoveredActivity>(
  activities: T[],
  customWeights?: Partial<ShuffleWeights>
): T[] => {
  if (activities.length === 0) return [];
  
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  
  // Calculate weights for all activities
  const weightedActivities: WeightedActivity[] = activities.map(activity => ({
    activity,
    weight: calculateActivityWeight(activity, weights)
  }));

  // Create cumulative weight array for efficient selection
  const totalWeight = weightedActivities.reduce((sum, item) => sum + item.weight, 0);
  
  const shuffled: T[] = [];
  const remaining = [...weightedActivities];

  while (remaining.length > 0) {
    const currentTotalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * currentTotalWeight;
    
    let selectedIndex = 0;
    for (let i = 0; i < remaining.length; i++) {
      random -= remaining[i].weight;
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }
    
    shuffled.push(remaining[selectedIndex].activity as T);
    remaining.splice(selectedIndex, 1);
  }

  return shuffled;
};

// Utility function for getting top weighted activities without full shuffle
export const getTopWeightedActivities = <T extends ActivityLibraryItem | DiscoveredActivity>(
  activities: T[],
  count: number,
  customWeights?: Partial<ShuffleWeights>
): T[] => {
  if (activities.length === 0) return [];
  
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  
  const weightedActivities = activities
    .map(activity => ({
      activity,
      weight: calculateActivityWeight(activity, weights)
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, count);
    
  return weightedActivities.map(item => item.activity as T);
};

// Debug function to see activity weights
export const debugActivityWeights = (
  activities: (ActivityLibraryItem | DiscoveredActivity)[],
  customWeights?: Partial<ShuffleWeights>
): Array<{ title: string; weight: number; type: string; quality?: number }> => {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };
  
  return activities.map(activity => ({
    title: activity.title,
    weight: calculateActivityWeight(activity, weights),
    type: isDiscoveredActivity(activity) ? 'discovered' : 'library',
    quality: isDiscoveredActivity(activity) ? activity.qualityScore : undefined
  }));
};

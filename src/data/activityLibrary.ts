import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { mentalActivities } from './activities/mentalActivities';
import { physicalActivities } from './activities/physicalActivities';
import { socialActivities } from './activities/socialActivities';
import { environmentalActivities } from './activities/environmentalActivities';
import { instinctualActivities } from './activities/instinctualActivities';
import { weightedShuffle } from '@/utils/weightedShuffle';

export const activityLibrary: ActivityLibraryItem[] = [
  ...mentalActivities,
  ...physicalActivities,
  ...socialActivities,
  ...environmentalActivities,
  ...instinctualActivities
];

// Helper function to get random activities with weighted shuffling
export function getRandomActivities(count: number = 5): ActivityLibraryItem[] {
  const shuffled = weightedShuffle([...activityLibrary]);
  return shuffled.slice(0, count);
}

// Helper function to get activities by pillar
export function getActivitiesByPillar(pillar: string): ActivityLibraryItem[] {
  return activityLibrary.filter(activity => activity.pillar === pillar);
}

// Helper function to get activities by difficulty
export function getActivitiesByDifficulty(difficulty: string): ActivityLibraryItem[] {
  return activityLibrary.filter(activity => activity.difficulty === difficulty);
}

// Helper function to get activities by duration
export function getActivitiesByDuration(maxDuration: number): ActivityLibraryItem[] {
  return activityLibrary.filter(activity => activity.duration <= maxDuration);
}

// Helper function to get discovered activities (placeholder for now)
export function getDiscoveredActivities(dogId?: string): any[] {
  if (!dogId) return [];
  const saved = localStorage.getItem(`discoveredActivities-${dogId}`);
  return saved ? JSON.parse(saved) : [];
}

// Get activity by ID from library
export function getActivityById(id: string): ActivityLibraryItem | undefined {
  return activityLibrary.find(activity => activity.id === id);
}

// Get activities by pillar with weighted shuffling
export function getPillarActivities(pillar?: string | null): ActivityLibraryItem[] {
  if (!pillar || pillar === 'all') {
    return weightedShuffle([...activityLibrary]);
  }
  const pillarActivities = getActivitiesByPillar(pillar);
  return weightedShuffle(pillarActivities);
}

// Search combined activities (library + discovered + curated + database) with weighted results
export function searchCombinedActivities(query: string, discoveredActivities: DiscoveredActivity[]): (ActivityLibraryItem | DiscoveredActivity)[] {
  const combinedActivities = getCombinedActivitiesSync(discoveredActivities);
  const lowercaseQuery = query.toLowerCase();
  
  const matchingActivities = combinedActivities.filter(activity => 
    activity.title.toLowerCase().includes(lowercaseQuery) ||
    activity.pillar.toLowerCase().includes(lowercaseQuery) ||
    activity.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    activity.benefits?.toLowerCase().includes(lowercaseQuery)
  );
  
  // Apply weighted shuffling to search results to promote discovered activities
  return weightedShuffle(matchingActivities);
}

// Get combined activities (library + discovered + curated + database) with weighted shuffling
export async function getCombinedActivities(discoveredActivities: DiscoveredActivity[]): Promise<(ActivityLibraryItem | DiscoveredActivity)[]> {
  // Filter discovered activities (AI-generated)
  const approvedDiscovered = discoveredActivities.filter(activity => 
    activity.approved && activity.source === 'discovered'
  );
  
  // Start with static library activities
  let combined: (ActivityLibraryItem | DiscoveredActivity)[] = [...activityLibrary];
  
  // Add approved discovered activities
  combined.push(...approvedDiscovered);
  
  // Try to load additional activities from database if available
  try {
    const { SyncDomainService } = await import('@/services/domain/SyncDomainService');
    const dbActivities = await SyncDomainService.loadActivitiesFromSupabase();
    
    // Add curated activities from database (if not already included)
    const additionalCurated = dbActivities.curated.filter(dbActivity => 
      !activityLibrary.some(libActivity => libActivity.id === dbActivity.id)
    );
    combined.push(...additionalCurated);
    
    // Add additional discovered activities from database
    const additionalDiscovered = dbActivities.discovered.filter(dbActivity => 
      dbActivity.approved && !discoveredActivities.some(discActivity => discActivity.id === dbActivity.id)
    );
    combined.push(...additionalDiscovered);
    
    // Add user activities from database
    combined.push(...dbActivities.user);
    
  } catch (error) {
    console.log('Using static activities only - database not available:', error);
  }

  // De-duplicate by id and normalized title while preserving order (prefer library entries)
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const unique: (ActivityLibraryItem | DiscoveredActivity)[] = [];

  for (const item of combined) {
    const idKey = String(item.id);
    const titleKey = item.title.trim().toLowerCase();
    if (seenIds.has(idKey) || seenTitles.has(titleKey)) continue;
    seenIds.add(idKey);
    seenTitles.add(titleKey);
    unique.push(item);
  }
  
  // Apply weighted shuffling to promote discovered activities
  return weightedShuffle(unique);
}

// Synchronous version for backward compatibility
export function getCombinedActivitiesSync(discoveredActivities: DiscoveredActivity[]): (ActivityLibraryItem | DiscoveredActivity)[] {
  // Filter discovered activities (AI-generated)
  const approvedDiscovered = discoveredActivities.filter(activity => 
    activity.approved && activity.source === 'discovered'
  );
  
  // Combine static library + approved discovered activities
  const combined: (ActivityLibraryItem | DiscoveredActivity)[] = [
    ...activityLibrary,
    ...approvedDiscovered,
  ];

  // De-duplicate by id and normalized title while preserving order (prefer library entries)
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const unique: (ActivityLibraryItem | DiscoveredActivity)[] = [];

  for (const item of combined) {
    const idKey = String(item.id);
    const titleKey = item.title.trim().toLowerCase();
    if (seenIds.has(idKey) || seenTitles.has(titleKey)) continue;
    seenIds.add(idKey);
    seenTitles.add(titleKey);
    unique.push(item);
  }
  
  // Apply weighted shuffling to promote discovered activities
  return weightedShuffle(unique);
}
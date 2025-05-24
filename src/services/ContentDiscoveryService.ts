
import { DiscoveredActivity, ContentDiscoveryConfig, ScrapedContent } from '@/types/discovery';
import { ActivityLibraryItem } from '@/types/activity';
import { WebScrapingService } from './WebScrapingService';
import { ContentParserService } from './ContentParserService';
import { DuplicateDetectionService } from './DuplicateDetectionService';

export class ContentDiscoveryService {
  private static readonly DEFAULT_CONFIG: ContentDiscoveryConfig = {
    enabled: true,
    frequency: 'weekly',
    maxActivitiesPerDiscovery: 8, // Increased from 5
    targetSources: [],
    breedSpecific: true,
    qualityThreshold: 0.6,
  };

  static async discoverNewActivities(
    existingActivities: (ActivityLibraryItem | DiscoveredActivity)[],
    config?: Partial<ContentDiscoveryConfig>
  ): Promise<DiscoveredActivity[]> {
    
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    if (!fullConfig.enabled) {
      console.log('Content discovery is disabled');
      return [];
    }

    console.log('Starting content discovery process...');
    
    try {
      // Step 1: Scrape content from web sources
      const scrapedContent = await WebScrapingService.discoverContent(
        fullConfig.maxActivitiesPerDiscovery * 2 // Get extra to account for filtering
      );
      
      console.log(`Scraped ${scrapedContent.length} articles`);
      
      // Step 2: Parse content into activities
      const parsedActivities = await this.parseScrapedContent(scrapedContent);
      
      console.log(`Parsed ${parsedActivities.length} potential activities`);
      
      // Step 3: Filter for quality and duplicates
      const qualityActivities = await this.filterQualityActivities(
        parsedActivities,
        existingActivities,
        fullConfig
      );
      
      console.log(`${qualityActivities.length} high-quality unique activities discovered`);
      
      // Step 4: Convert to DiscoveredActivity format
      const discoveredActivities = qualityActivities.map((activity, index) => 
        this.convertToDiscoveredActivity(activity, scrapedContent[index] || scrapedContent[0])
      );
      
      // Step 5: Auto-approve high-quality activities
      const finalActivities = discoveredActivities.map(activity => ({
        ...activity,
        approved: activity.qualityScore >= 0.8, // Auto-approve high-quality activities
        rejected: false
      }));
      
      const autoApproved = finalActivities.filter(a => a.approved).length;
      const needsReview = finalActivities.filter(a => !a.approved && !a.rejected).length;
      
      console.log(`Auto-approved ${autoApproved} high-quality activities, ${needsReview} need manual review`);
      
      return finalActivities.slice(0, fullConfig.maxActivitiesPerDiscovery);
      
    } catch (error) {
      console.error('Error during content discovery:', error);
      return [];
    }
  }

  private static async parseScrapedContent(scrapedContent: ScrapedContent[]) {
    const parsedActivities = [];
    
    for (const content of scrapedContent) {
      try {
        const parsed = await ContentParserService.parseContent(content);
        if (parsed && parsed.confidence > 0.4) { // Lowered threshold to get more activities
          parsedActivities.push(parsed);
        }
      } catch (error) {
        console.error(`Error parsing content from ${content.url}:`, error);
      }
    }
    
    return parsedActivities;
  }

  private static async filterQualityActivities(
    activities: any[],
    existingActivities: (ActivityLibraryItem | DiscoveredActivity)[],
    config: ContentDiscoveryConfig
  ) {
    const filtered = [];
    
    for (const activity of activities) {
      // Quality threshold check (lowered for more activities)
      if (activity.confidence < config.qualityThreshold) {
        console.log(`Activity filtered out due to low quality: ${activity.title}`);
        continue;
      }
      
      // Create temporary DiscoveredActivity for duplicate checking
      const tempActivity: DiscoveredActivity = {
        id: `temp-${Date.now()}`,
        ...activity,
        source: 'discovered' as const,
        sourceUrl: '',
        discoveredAt: new Date().toISOString(),
        verified: false,
        qualityScore: activity.confidence
      };
      
      // More lenient duplicate check
      const isDuplicate = await DuplicateDetectionService.checkForDuplicates(
        tempActivity,
        existingActivities
      );
      
      if (!isDuplicate) {
        filtered.push(activity);
      }
    }
    
    return filtered;
  }

  private static convertToDiscoveredActivity(
    parsedActivity: any,
    scrapedContent: ScrapedContent
  ): DiscoveredActivity {
    return {
      id: `discovered-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: parsedActivity.title,
      pillar: parsedActivity.pillar as any,
      difficulty: parsedActivity.difficulty as any,
      duration: parsedActivity.duration,
      materials: parsedActivity.materials,
      emotionalGoals: parsedActivity.emotionalGoals,
      instructions: parsedActivity.instructions,
      benefits: parsedActivity.benefits,
      tags: parsedActivity.tags,
      ageGroup: parsedActivity.ageGroup as any,
      energyLevel: parsedActivity.energyLevel as any,
      source: 'discovered',
      sourceUrl: scrapedContent.url,
      discoveredAt: new Date().toISOString(),
      verified: false,
      qualityScore: parsedActivity.confidence,
      approved: false,
      rejected: false
    };
  }

  static getDefaultConfig(): ContentDiscoveryConfig {
    return { ...this.DEFAULT_CONFIG };
  }

  static shouldRunDiscovery(config: ContentDiscoveryConfig): boolean {
    // Allow discovery more frequently - every 6 hours instead of weekly
    if (!config.enabled || !config.lastDiscoveryRun) {
      return true;
    }
    
    const lastRun = new Date(config.lastDiscoveryRun);
    const now = new Date();
    const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);
    
    // Allow discovery every 6 hours instead of weekly/monthly
    return hoursSinceLastRun >= 6;
  }
}

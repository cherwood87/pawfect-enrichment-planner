
import { supabase } from '@/integrations/supabase/client';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { ActivityLibraryItem } from '@/types/activity';

export class AIContentDiscoveryService {
  private static readonly DEFAULT_CONFIG: ContentDiscoveryConfig = {
    enabled: true,
    frequency: 'weekly',
    maxActivitiesPerDiscovery: 8,
    targetSources: [],
    breedSpecific: true,
    qualityThreshold: 0.6,
  };

  private static lastDiscoveryAttempt: string | null = null;
  private static readonly MIN_DISCOVERY_INTERVAL_MS = 30000; // 30 seconds minimum between attempts

  static async discoverNewActivities(
    existingActivities: (ActivityLibraryItem | DiscoveredActivity)[],
    config?: Partial<ContentDiscoveryConfig>,
    dogProfile?: any
  ): Promise<DiscoveredActivity[]> {
    
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    if (!fullConfig.enabled) {
      console.log('AI content discovery is disabled');
      return [];
    }

    // Prevent too frequent discovery attempts
    const now = new Date().toISOString();
    if (this.lastDiscoveryAttempt) {
      const timeSinceLastAttempt = Date.now() - new Date(this.lastDiscoveryAttempt).getTime();
      if (timeSinceLastAttempt < this.MIN_DISCOVERY_INTERVAL_MS) {
        console.log('Discovery attempted too recently, skipping to prevent loops');
        return [];
      }
    }
    this.lastDiscoveryAttempt = now;

    console.log('Starting AI-powered content discovery...');
    
    try {
      // Call the Supabase AI discovery function
      const { data, error } = await supabase.functions.invoke('discover-activities-enhanced', {
        body: {
          existingActivities: existingActivities.map(a => ({
            title: a.title,
            pillar: a.pillar,
            difficulty: a.difficulty
          })),
          dogProfile: dogProfile || {},
          maxActivities: fullConfig.maxActivitiesPerDiscovery,
          qualityThreshold: fullConfig.qualityThreshold
        }
      });

      if (error) {
        console.error('AI discovery function error:', error);
        // Return empty array instead of throwing to prevent infinite loops
        return [];
      }

      if (!data?.activities || !Array.isArray(data.activities)) {
        console.log('No activities returned from AI discovery:', data);
        return [];
      }

      console.log(`AI discovered ${data.activities.length} new activities`);
      
      // Convert AI response to DiscoveredActivity format and auto-approve all
      const discoveredActivities = data.activities.map((activity: any, index: number) => 
        this.convertToDiscoveredActivity(activity, true) // Auto-approve all
      );
      
      console.log(`Auto-approved ${discoveredActivities.length} AI-discovered activities`);
      
      return discoveredActivities.slice(0, fullConfig.maxActivitiesPerDiscovery);
      
    } catch (error) {
      console.error('Error during AI content discovery:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  }

  private static convertToDiscoveredActivity(
    aiActivity: any,
    autoApprove: boolean = true
  ): DiscoveredActivity {
    return {
      id: `ai-discovered-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: aiActivity.title || 'AI Discovered Activity',
      pillar: aiActivity.pillar || 'mental',
      difficulty: aiActivity.difficulty || 'Medium',
      duration: aiActivity.duration || 15,
      materials: aiActivity.materials || [],
      emotionalGoals: aiActivity.emotionalGoals || ['Provides enrichment'],
      instructions: aiActivity.instructions || ['Follow the activity description'],
      benefits: aiActivity.benefits || 'AI-curated enrichment activity for your dog.',
      tags: aiActivity.tags || ['ai-curated'],
      ageGroup: aiActivity.ageGroup || 'All Ages',
      energyLevel: aiActivity.energyLevel || 'Medium',
      source: 'discovered',
      sourceUrl: 'https://ai-curated.enrichment-planner.com',
      discoveredAt: new Date().toISOString(),
      verified: autoApprove,
      qualityScore: aiActivity.confidence || 0.85,
      approved: autoApprove, // Auto-approve all AI activities
      rejected: false
    };
  }

  static getDefaultConfig(): ContentDiscoveryConfig {
    return { ...this.DEFAULT_CONFIG };
  }

  static shouldRunDiscovery(config: ContentDiscoveryConfig): boolean {
    if (!config.enabled) {
      return false;
    }
    
    if (!config.lastDiscoveryRun) {
      return true;
    }
    
    const lastRun = new Date(config.lastDiscoveryRun);
    const now = new Date();
    const daysSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60 * 24);
    
    // Run weekly discovery automatically
    return daysSinceLastRun >= 7;
  }

  static async scheduleWeeklyDiscovery(dogId: string, dogProfile: any): Promise<void> {
    // This would integrate with a background job system
    console.log(`Scheduled weekly AI discovery for dog: ${dogId}`);
  }
}

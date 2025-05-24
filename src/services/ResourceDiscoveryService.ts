
import { EducationalArticle, ResourceCategory, ResourceDiscoveryConfig } from '@/types/resource';
import { ResourceScrapingService } from './ResourceScrapingService';

export class ResourceDiscoveryService {
  private static readonly DEFAULT_CONFIG: ResourceDiscoveryConfig = {
    dailyLimit: 10,
    preferredSources: ['akc.org', 'petmd.com', 'vcahospitals.com'],
    excludedSources: [],
    minCredibilityScore: 6,
    focusTopics: ['mental stimulation', 'puzzle feeders', 'enrichment activities']
  };

  static async discoverNewResources(
    existingResources: EducationalArticle[],
    config: Partial<ResourceDiscoveryConfig> = {}
  ): Promise<EducationalArticle[]> {
    const fullConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    console.log('Starting resource discovery with config:', fullConfig);
    
    const categories: ResourceCategory[] = ['science', 'diy-projects', 'breed-specific', 'product-reviews', 'training-tips'];
    const newResources: EducationalArticle[] = [];
    
    for (const category of categories) {
      if (newResources.length >= fullConfig.dailyLimit) break;
      
      try {
        const categoryResources = await ResourceScrapingService.discoverResourcesByCategory(category);
        
        // Filter out duplicates and low-quality content
        const filteredResources = categoryResources.filter(resource => {
          const isDuplicate = existingResources.some(existing => 
            existing.title.toLowerCase() === resource.title.toLowerCase() ||
            existing.sourceUrl === resource.sourceUrl
          );
          
          const meetsQualityThreshold = resource.credibilityScore >= fullConfig.minCredibilityScore;
          
          return !isDuplicate && meetsQualityThreshold;
        });
        
        newResources.push(...filteredResources.slice(0, 2)); // Limit per category
        
      } catch (error) {
        console.error(`Failed to discover resources for category ${category}:`, error);
      }
    }
    
    console.log(`Discovered ${newResources.length} new resources`);
    return newResources.slice(0, fullConfig.dailyLimit);
  }

  static async searchResourcesWithFilters(
    query: string,
    category?: ResourceCategory,
    minCredibilityScore: number = 6
  ): Promise<EducationalArticle[]> {
    const results = await ResourceScrapingService.searchResources(query);
    
    return results.filter(resource => {
      const categoryMatch = !category || resource.category === category;
      const qualityMatch = resource.credibilityScore >= minCredibilityScore;
      return categoryMatch && qualityMatch;
    });
  }

  static getRecommendedSearchTerms(): Record<ResourceCategory, string[]> {
    return {
      science: ['canine cognition', 'dog behavior research', 'animal enrichment studies'],
      'diy-projects': ['homemade dog toys', 'DIY puzzle feeders', 'enrichment crafts'],
      'breed-specific': ['breed-specific needs', 'working dog enrichment', 'breed behavior'],
      'product-reviews': ['best dog toys', 'puzzle feeder reviews', 'enrichment products'],
      'training-tips': ['positive training', 'clicker training', 'enrichment training'],
      'general-enrichment': ['dog enrichment', 'mental stimulation', 'canine wellness']
    };
  }
}

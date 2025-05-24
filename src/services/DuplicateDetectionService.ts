
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

export class DuplicateDetectionService {
  static readonly SIMILARITY_THRESHOLD = 0.7;
  static readonly TITLE_THRESHOLD = 0.8;

  static async checkForDuplicates(
    newActivity: DiscoveredActivity,
    existingActivities: (ActivityLibraryItem | DiscoveredActivity)[]
  ): Promise<boolean> {
    
    for (const existing of existingActivities) {
      // Check title similarity
      const titleSimilarity = this.calculateTitleSimilarity(
        newActivity.title,
        existing.title
      );
      
      if (titleSimilarity > this.TITLE_THRESHOLD) {
        console.log(`Duplicate detected: "${newActivity.title}" similar to "${existing.title}"`);
        return true;
      }
      
      // Check content similarity
      const contentSimilarity = this.calculateContentSimilarity(newActivity, existing);
      
      if (contentSimilarity > this.SIMILARITY_THRESHOLD) {
        console.log(`Content duplicate detected for: ${newActivity.title}`);
        return true;
      }
    }
    
    return false;
  }

  private static calculateTitleSimilarity(title1: string, title2: string): number {
    const clean1 = this.normalizeTitle(title1);
    const clean2 = this.normalizeTitle(title2);
    
    return this.calculateLevenshteinSimilarity(clean1, clean2);
  }

  private static normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static calculateLevenshteinSimilarity(str1: string, str2: string): number {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(str1, str2);
    return 1 - (distance / maxLength);
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private static calculateContentSimilarity(
    activity1: DiscoveredActivity,
    activity2: ActivityLibraryItem | DiscoveredActivity
  ): number {
    // Check keyword overlap
    const keywords1 = this.extractKeywords(activity1);
    const keywords2 = this.extractKeywords(activity2);
    
    const intersection = keywords1.filter(keyword => keywords2.includes(keyword));
    const union = [...new Set([...keywords1, ...keywords2])];
    
    const jaccardSimilarity = intersection.length / union.length;
    
    // Check pillar and material similarity
    const pillarMatch = activity1.pillar === activity2.pillar ? 0.2 : 0;
    const materialOverlap = this.calculateMaterialOverlap(activity1.materials, activity2.materials);
    
    return jaccardSimilarity * 0.6 + pillarMatch + materialOverlap * 0.2;
  }

  private static extractKeywords(activity: ActivityLibraryItem | DiscoveredActivity): string[] {
    const text = `${activity.title} ${activity.benefits} ${activity.tags.join(' ')}`.toLowerCase();
    
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'dog', 'dogs'];
    
    return text
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 20);
  }

  private static calculateMaterialOverlap(materials1: string[], materials2: string[]): number {
    const normalized1 = materials1.map(m => m.toLowerCase());
    const normalized2 = materials2.map(m => m.toLowerCase());
    
    const intersection = normalized1.filter(material => 
      normalized2.some(m2 => m2.includes(material) || material.includes(m2))
    );
    
    const maxLength = Math.max(materials1.length, materials2.length);
    return maxLength > 0 ? intersection.length / maxLength : 0;
  }

  static generateContentHash(activity: DiscoveredActivity): string {
    const content = `${activity.title}-${activity.pillar}-${activity.duration}-${activity.materials.join(',')}`;
    return btoa(content).substring(0, 16);
  }
}

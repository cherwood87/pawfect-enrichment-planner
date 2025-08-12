import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { getBreedCharacteristics, BRACHYCEPHALIC_BREEDS, HIGH_DRIVE_BREEDS } from '@/data/breedCharacteristics';

interface BreedAwareActivityScore {
  activity: ActivityLibraryItem | DiscoveredActivity;
  score: number;
  reasons: string[];
  safetyFlags: string[];
  breedMatch: 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe';
}

export class BreedAwareActivityRecommendationService {
  static scoreActivitiesForBreed(
    activities: (ActivityLibraryItem | DiscoveredActivity)[],
    dog: Dog
  ): BreedAwareActivityScore[] {
    const breedCharacteristics = getBreedCharacteristics(dog.breed, dog.breedGroup);
    
    return activities.map(activity => {
      const score = this.calculateBreedAwareScore(activity, dog, breedCharacteristics);
      const reasons = this.generateBreedAwareReasons(activity, dog, score, breedCharacteristics);
      const safetyFlags = this.generateSafetyFlags(activity, dog, breedCharacteristics);
      const breedMatch = this.determineBreedMatch(score.totalScore, safetyFlags);
      
      return { 
        activity, 
        score: score.totalScore, 
        reasons, 
        safetyFlags,
        breedMatch
      };
    });
  }

  private static calculateBreedAwareScore(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog,
    breedCharacteristics: any
  ) {
    let totalScore = 0;
    const factors: Record<string, number> = {};

    // Base score
    factors.base = 0.3;
    totalScore += factors.base;

    // Breed-adjusted pillar preference scoring (50% of total weight)
    if (dog.quizResults?.ranking) {
      const pillarRank = dog.quizResults.ranking.findIndex(r => r.pillar === activity.pillar);
      const breedMultiplier = breedCharacteristics.pillarMultipliers[activity.pillar];
      
      if (pillarRank !== -1) {
        let pillarScore = 0;
        if (pillarRank === 0) pillarScore = 0.5;
        else if (pillarRank === 1) pillarScore = 0.4;
        else if (pillarRank === 2) pillarScore = 0.2;
        else pillarScore = 0.1;
        
        // Apply breed multiplier
        factors.breedPillar = pillarScore * breedMultiplier * 0.5;
        totalScore += factors.breedPillar;
      }
    }

    // Breed drive level vs activity complexity (20% weight)
    const driveScore = this.scoreDriveMatch(activity, breedCharacteristics.driveLevel, breedCharacteristics.workingComplexity);
    factors.drive = driveScore * 0.2;
    totalScore += factors.drive;

    // Physical safety and limitations (20% weight)
    const safetyScore = this.scoreBreedSafety(activity, dog, breedCharacteristics);
    factors.safety = safetyScore * 0.2;
    totalScore += factors.safety;

    // Age appropriateness with breed considerations (10% weight)
    const ageScore = this.scoreBreedAgeAppropriate(activity, dog, breedCharacteristics);
    factors.age = ageScore * 0.1;
    totalScore += factors.age;

    return { totalScore: Math.max(0, Math.min(1, totalScore)), factors };
  }

  private static scoreDriveMatch(
    activity: ActivityLibraryItem | DiscoveredActivity, 
    breedDriveLevel: string,
    workingComplexity: string
  ): number {
    const activityComplexity = this.getActivityComplexity(activity);
    const driveRequirement = this.getActivityDriveRequirement(activity);
    
    // Match breed drive to activity requirements
    const driveMap = { 'low': 1, 'moderate': 2, 'high': 3, 'very_high': 4 };
    const complexityMap = { 'basic': 1, 'intermediate': 2, 'advanced': 3, 'professional': 4 };
    
    const breedDrive = driveMap[breedDriveLevel as keyof typeof driveMap] || 2;
    const breedComplexity = complexityMap[workingComplexity as keyof typeof complexityMap] || 2;
    const activityDrive = driveMap[driveRequirement as keyof typeof driveMap] || 2;
    const activityComp = complexityMap[activityComplexity as keyof typeof complexityMap] || 2;
    
    // Score based on how well breed capabilities match activity requirements
    const driveMatch = 1 - Math.abs(breedDrive - activityDrive) / 4;
    const complexityMatch = 1 - Math.abs(breedComplexity - activityComp) / 4;
    
    return (driveMatch + complexityMatch) / 2;
  }

  private static getActivityComplexity(activity: ActivityLibraryItem | DiscoveredActivity): string {
    const title = activity.title.toLowerCase();
    const tags = activity.tags?.map(t => t.toLowerCase()) || [];
    
    if (tags.includes('advanced') || title.includes('advanced') || 
        tags.includes('professional') || title.includes('competition')) {
      return 'professional';
    }
    if (tags.includes('intermediate') || activity.difficulty === 'Hard') {
      return 'advanced';
    }
    if (activity.difficulty === 'Medium') {
      return 'intermediate';
    }
    return 'basic';
  }

  private static getActivityDriveRequirement(activity: ActivityLibraryItem | DiscoveredActivity): string {
    const title = activity.title.toLowerCase();
    const tags = activity.tags?.map(t => t.toLowerCase()) || [];
    
    if (tags.includes('high-energy') || title.includes('intense') || 
        activity.pillar === 'physical' && activity.difficulty === 'Hard') {
      return 'very_high';
    }
    if (activity.difficulty === 'Hard' || tags.includes('challenging')) {
      return 'high';
    }
    if (activity.difficulty === 'Medium') {
      return 'moderate';
    }
    return 'low';
  }

  private static scoreBreedSafety(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog,
    breedCharacteristics: any
  ): number {
    let safetyScore = 1.0;
    
    // Brachycephalic breed safety
    if (BRACHYCEPHALIC_BREEDS.includes(dog.breed)) {
      if (activity.pillar === 'physical' && activity.difficulty === 'Hard') {
        safetyScore *= 0.1; // Severely penalize high-intensity exercise
      }
      if (activity.pillar === 'physical' && activity.difficulty === 'Medium') {
        safetyScore *= 0.5; // Moderate penalty for medium intensity
      }
      if (activity.tags?.some(tag => 
          ['running', 'intense', 'cardio', 'endurance'].includes(tag.toLowerCase()))) {
        safetyScore *= 0.2;
      }
    }

    // Breed-specific physical limitations
    if (breedCharacteristics.physicalLimitations.includes('joint_monitoring_required')) {
      if (activity.tags?.some(tag => 
          ['jumping', 'agility', 'high-impact'].includes(tag.toLowerCase()))) {
        if (dog.age >= 60) {
          safetyScore *= 0.3; // Senior dogs with joint-prone breeds
        } else {
          safetyScore *= 0.7; // Younger dogs, less severe penalty
        }
      }
    }

    // Heat sensitivity
    if (breedCharacteristics.physicalLimitations.includes('heat_sensitive')) {
      if (activity.tags?.some(tag => 
          ['outdoor', 'summer', 'intense'].includes(tag.toLowerCase()))) {
        safetyScore *= 0.6;
      }
    }

    // Energy pattern mismatch
    if (breedCharacteristics.energyPattern === 'sprint' && 
        activity.tags?.some(tag => 
            ['endurance', 'long-distance', 'marathon'].includes(tag.toLowerCase()))) {
      safetyScore *= 0.4; // Greyhounds shouldn't do endurance activities
    }

    return safetyScore;
  }

  private static scoreBreedAgeAppropriate(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog,
    breedCharacteristics: any
  ): number {
    let ageScore = 0.8; // Base score
    
    if ('ageGroup' in activity && activity.ageGroup) {
      // Standard age matching
      if (activity.ageGroup === 'All Ages') ageScore = 1.0;
      else if (activity.ageGroup === 'Puppy' && dog.age < 12) ageScore = 1.0;
      else if (activity.ageGroup === 'Adult' && dog.age >= 12 && dog.age < 84) ageScore = 1.0;
      else if (activity.ageGroup === 'Senior' && dog.age >= 84) ageScore = 1.0;
      else ageScore = 0.3;
    }

    // Breed-specific age adjustments
    if (dog.age >= 84) {
      // Large breed senior considerations
      if (['German Shepherd', 'Labrador Retriever', 'Golden Retriever', 'Rottweiler'].includes(dog.breed)) {
        if (activity.pillar === 'physical' && activity.difficulty === 'Hard') {
          ageScore *= 0.3; // More severe penalty for large breed seniors
        }
      }
    }

    // High-drive breed puppy considerations
    if (dog.age < 18 && HIGH_DRIVE_BREEDS.includes(dog.breed)) {
      if (activity.pillar === 'mental' && activity.difficulty === 'Hard') {
        ageScore *= 1.2; // Bonus for mental stimulation in high-drive puppies
      }
    }

    return Math.min(1.0, ageScore);
  }

  private static generateBreedAwareReasons(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog,
    scoreData: { totalScore: number; factors: Record<string, number> },
    breedCharacteristics: any
  ): string[] {
    const reasons: string[] = [];
    const { factors } = scoreData;
    
    if (factors.breedPillar && factors.breedPillar > 0.3) {
      reasons.push(`Excellent match for ${dog.breed} enrichment needs`);
    } else if (factors.breedPillar && factors.breedPillar > 0.15) {
      reasons.push(`Good fit for ${dog.breed} characteristics`);
    }
    
    if (factors.drive > 0.15) {
      reasons.push(`Matches ${dog.breed} drive level and working complexity`);
    } else if (factors.drive < 0.1) {
      reasons.push(`May be too simple/complex for ${dog.breed} drive level`);
    }
    
    if (factors.safety < 0.7) {
      reasons.push(`Modified for ${dog.breed} safety considerations`);
    }
    
    // Add breed-specific positive reasons
    if (breedCharacteristics.driveLevel === 'very_high' && activity.pillar === 'mental') {
      reasons.push(`Essential mental stimulation for high-drive ${dog.breed}`);
    }
    
    if (BRACHYCEPHALIC_BREEDS.includes(dog.breed) && activity.pillar !== 'physical') {
      reasons.push(`Safe non-physical enrichment for ${dog.breed}`);
    }
    
    return reasons;
  }

  private static generateSafetyFlags(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog,
    breedCharacteristics: any
  ): string[] {
    const flags: string[] = [];
    
    // Brachycephalic safety flags
    if (BRACHYCEPHALIC_BREEDS.includes(dog.breed)) {
      if (activity.pillar === 'physical' && activity.difficulty === 'Hard') {
        flags.push('⚠️ HIGH RISK: Not suitable for brachycephalic breeds');
      } else if (activity.pillar === 'physical') {
        flags.push('⚠️ Monitor breathing and temperature closely');
      }
    }

    // Joint-prone breed flags
    if (breedCharacteristics.physicalLimitations.includes('joint_monitoring_required')) {
      if (activity.tags?.some(tag => 
          ['jumping', 'agility', 'high-impact'].includes(tag.toLowerCase()))) {
        flags.push('⚠️ Monitor for joint stress - consider softer alternatives');
      }
    }

    // High-drive breed mental stimulation flags
    if (HIGH_DRIVE_BREEDS.includes(dog.breed) && activity.pillar !== 'mental' && activity.difficulty === 'Easy') {
      flags.push('💡 Consider adding mental challenge for high-drive breed');
    }

    // Energy pattern mismatch flags
    if (breedCharacteristics.energyPattern === 'sprint') {
      if (activity.tags?.some(tag => 
          ['endurance', 'long-distance'].includes(tag.toLowerCase()))) {
        flags.push('⚠️ Not suitable for sprint-type breeds - prefer short bursts');
      }
    }

    return flags;
  }

  private static determineBreedMatch(score: number, safetyFlags: string[]): 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe' {
    if (safetyFlags.some(flag => flag.includes('HIGH RISK'))) {
      return 'unsafe';
    }
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'fair';
    return 'poor';
  }

  static getBreedSpecificActivities(
    activities: (ActivityLibraryItem | DiscoveredActivity)[],
    dog: Dog,
    limit: number = 20
  ): (ActivityLibraryItem | DiscoveredActivity)[] {
    const scoredActivities = this.scoreActivitiesForBreed(activities, dog);
    
    // Filter out unsafe activities and sort by score
    return scoredActivities
      .filter(scored => scored.breedMatch !== 'unsafe')
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(scored => scored.activity);
  }

  static getBreedCompatibilityExplanation(dog: Dog): string {
    const characteristics = getBreedCharacteristics(dog.breed, dog.breedGroup);
    
    let explanation = `${dog.breed}s are ${characteristics.breedGroup.toLowerCase()} dogs with ${characteristics.driveLevel} drive levels. `;
    
    if (characteristics.confidence > 0.8) {
      explanation += `These breed characteristics are well-documented and activities are tailored accordingly. `;
    } else if (characteristics.confidence < 0.5) {
      explanation += `Individual variation is especially important for this breed/mix. `;
    }
    
    if (characteristics.safetyConsiderations.length > 0) {
      explanation += `Key safety considerations: ${characteristics.safetyConsiderations.join(', ')}.`;
    }
    
    return explanation;
  }
}
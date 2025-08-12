import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { Dog } from '@/types/dog';
import { QuizResults } from '@/types/quiz';
import { BreedAwareActivityRecommendationService } from './BreedAwareActivityRecommendationService';

interface ActivityScore {
  activity: ActivityLibraryItem | DiscoveredActivity;
  score: number;
  reasons: string[];
}

export class ActivityRecommendationService {
  static scoreActivitiesForDog(
    activities: (ActivityLibraryItem | DiscoveredActivity)[],
    dog: Dog
  ): ActivityScore[] {
    return activities.map(activity => {
      const score = this.calculateActivityScore(activity, dog);
      const reasons = this.generateScoreReasons(activity, dog, score);
      return { activity, score: score.totalScore, reasons };
    });
  }

  private static calculateActivityScore(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog
  ) {
    let totalScore = 0;
    const factors: Record<string, number> = {};

    // Base score for all activities
    factors.base = 0.5;
    totalScore += factors.base;

    // Quiz pillar preference scoring (40% of total weight)
    if (dog.quizResults?.ranking) {
      const pillarRank = dog.quizResults.ranking.findIndex(r => r.pillar === activity.pillar);
      if (pillarRank !== -1) {
        // Top 2 pillars get bonus, others get penalty
        if (pillarRank === 0) {
          factors.topPillar = 0.4;
        } else if (pillarRank === 1) {
          factors.secondPillar = 0.3;
        } else if (pillarRank === 2) {
          factors.thirdPillar = 0.1;
        } else {
          factors.lowerPillar = -0.1;
        }
        totalScore += factors.topPillar || factors.secondPillar || factors.thirdPillar || factors.lowerPillar || 0;
      }
    }

    // Dog activity level vs activity difficulty (25% weight)
    const difficultyScore = this.scoreDifficultyMatch(activity.difficulty, dog.activityLevel);
    factors.difficulty = difficultyScore * 0.25;
    totalScore += factors.difficulty;

    // Age appropriateness (15% weight)
    const ageScore = this.scoreAgeAppropriate(activity, dog.age);
    factors.age = ageScore * 0.15;
    totalScore += factors.age;

    // Safety considerations (20% weight)
    const safetyScore = this.scoreSafety(activity, dog);
    factors.safety = safetyScore * 0.2;
    totalScore += factors.safety;

    // Quality bonus for discovered activities
    if ('qualityScore' in activity && activity.qualityScore) {
      factors.quality = (activity.qualityScore - 0.5) * 0.1;
      totalScore += factors.quality;
    }

    return { totalScore: Math.max(0, Math.min(1, totalScore)), factors };
  }

  private static scoreDifficultyMatch(activityDifficulty: string, dogActivityLevel: string): number {
    const difficultyMap: Record<string, number> = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    const activityLevelMap: Record<string, number> = { 'low': 1, 'moderate': 2, 'high': 3 };
    
    const activityLevel = difficultyMap[activityDifficulty] || 2;
    const dogLevel = activityLevelMap[dogActivityLevel] || 2;
    
    // Perfect match gets 1.0, one level off gets 0.7, two levels off gets 0.3
    const difference = Math.abs(activityLevel - dogLevel);
    if (difference === 0) return 1.0;
    if (difference === 1) return 0.7;
    return 0.3;
  }

  private static scoreAgeAppropriate(activity: ActivityLibraryItem | DiscoveredActivity, dogAge: number): number {
    if (!('ageGroup' in activity) || !activity.ageGroup) return 0.8; // Neutral for no age data
    
    const ageGroup = activity.ageGroup;
    
    // Age group scoring
    if (ageGroup === 'All Ages') return 1.0;
    if (ageGroup === 'Puppy' && dogAge < 12) return 1.0;
    if (ageGroup === 'Adult' && dogAge >= 12 && dogAge < 84) return 1.0;
    if (ageGroup === 'Senior' && dogAge >= 84) return 1.0;
    
    // Partial matches
    if (ageGroup === 'Puppy' && dogAge < 24) return 0.7;
    if (ageGroup === 'Adult' && (dogAge >= 6 || dogAge < 96)) return 0.6;
    if (ageGroup === 'Senior' && dogAge >= 60) return 0.7;
    
    return 0.3; // Poor age match
  }

  private static scoreSafety(activity: ActivityLibraryItem | DiscoveredActivity, dog: Dog): number {
    let safetyScore = 1.0;
    
    // Check mobility issues
    if (dog.mobilityIssues && dog.mobilityIssues.length > 0) {
      const isPhysicalActivity = activity.pillar === 'physical' || 
                                activity.difficulty === 'Hard' ||
                                activity.tags?.some(tag => 
                                  ['running', 'jumping', 'climbing', 'agility'].includes(tag.toLowerCase())
                                );
      
      if (isPhysicalActivity) {
        if (dog.mobilityIssues.includes('Arthritis') || 
            dog.mobilityIssues.includes('Hip Dysplasia') ||
            dog.mobilityIssues.includes('Joint Issues')) {
          safetyScore *= 0.3; // Significantly reduce high-impact activities
        }
        if (dog.mobilityIssues.includes('Limited Mobility')) {
          safetyScore *= 0.1; // Almost eliminate high-impact activities
        }
      }
    }
    
    // Senior dog considerations
    if (dog.age >= 84) {
      if (activity.difficulty === 'Hard') {
        safetyScore *= 0.5;
      }
      if (activity.pillar === 'physical' && 
          ('duration' in activity && activity.duration > 30)) {
        safetyScore *= 0.7; // Reduce long physical activities for seniors
      }
    }
    
    // Puppy considerations
    if (dog.age < 12) {
      if (activity.tags?.some(tag => 
          ['complex', 'advanced', 'intensive'].includes(tag.toLowerCase()))) {
        safetyScore *= 0.4; // Reduce complex activities for puppies
      }
    }
    
    return safetyScore;
  }

  private static generateScoreReasons(
    activity: ActivityLibraryItem | DiscoveredActivity,
    dog: Dog,
    scoreData: { totalScore: number; factors: Record<string, number> }
  ): string[] {
    const reasons: string[] = [];
    const { factors } = scoreData;
    
    if (factors.topPillar) {
      reasons.push(`Perfect match for ${dog.name}'s top enrichment preference`);
    } else if (factors.secondPillar) {
      reasons.push(`Great fit for ${dog.name}'s secondary preference`);
    }
    
    if (factors.difficulty > 0.2) {
      reasons.push(`Activity level matches ${dog.name}'s energy needs`);
    } else if (factors.difficulty < 0) {
      reasons.push(`May be too challenging/easy for ${dog.name}`);
    }
    
    if (factors.age > 0.8) {
      reasons.push(`Perfect age match for ${dog.name}`);
    } else if (factors.age < 0.5) {
      reasons.push(`Age consideration needed`);
    }
    
    if (factors.safety < 0.7) {
      reasons.push(`Modified for ${dog.name}'s safety needs`);
    }
    
    if (factors.quality && factors.quality > 0.05) {
      reasons.push(`High-quality AI-discovered activity`);
    }
    
    return reasons;
  }

  static getPersonalizedActivities(
    activities: (ActivityLibraryItem | DiscoveredActivity)[],
    dog: Dog,
    limit: number = 20
  ): (ActivityLibraryItem | DiscoveredActivity)[] {
    // Use breed-aware recommendations if breed information is available
    if (dog.breed && dog.breed !== 'Unknown') {
      return BreedAwareActivityRecommendationService.getBreedSpecificActivities(activities, dog, limit);
    }
    
    // Fall back to standard recommendations
    const scoredActivities = this.scoreActivitiesForDog(activities, dog);
    
    // Sort by score (highest first) and return top activities
    return scoredActivities
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(scored => scored.activity);
  }

  static getQuizPersonalityContext(dog: Dog): string {
    if (!dog.quizResults) {
      return `${dog.name} hasn't completed the personality quiz yet.`;
    }

    const { personality, ranking, recommendations } = dog.quizResults;
    const topTwo = ranking.slice(0, 2);
    
    let context = `${dog.name} is a "${personality}" type dog. `;
    context += `Their top enrichment preferences are ${topTwo.map(p => p.pillar).join(' and ')}.`;
    
    if (topTwo.length >= 2) {
      context += ` ${topTwo[0].reason} ${topTwo[1].reason}`;
    }
    
    if (recommendations && recommendations.length > 0) {
      context += ` Recommended activities include: ${recommendations.slice(0, 3).join(', ')}.`;
    }
    
    // Add breed-specific context if available
    if (dog.breed && dog.breed !== 'Unknown') {
      const breedContext = BreedAwareActivityRecommendationService.getBreedCompatibilityExplanation(dog);
      context += ` ${breedContext}`;
    }
    
    return context;
  }
}
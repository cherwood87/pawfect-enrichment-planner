import { QuizResults } from '@/types/quiz';
import { Dog } from '@/types/dog';
import { getBreedCharacteristics, BRACHYCEPHALIC_BREEDS, HIGH_DRIVE_BREEDS } from '@/data/breedCharacteristics';
import { analyzeQuizResults as baseAnalyzeQuizResults } from '@/utils/quizAnalysis';

export class BreedAwareQuizAnalysisService {
  static analyzeQuizWithBreedContext(
    answers: Record<string, string>,
    dog: Dog
  ): QuizResults & { breedAdjusted: boolean; confidence: number; breedContext: string } {
    // Get base quiz results
    const baseResults = baseAnalyzeQuizResults(answers);
    
    // Get breed characteristics
    const breedCharacteristics = getBreedCharacteristics(dog.breed, dog.breedGroup);
    
    // Apply breed-specific adjustments to pillar scores
    const adjustedRanking = baseResults.ranking.map(pillar => {
      const multiplier = breedCharacteristics.pillarMultipliers[pillar.pillar as keyof typeof breedCharacteristics.pillarMultipliers];
      const adjustedScore = pillar.score * multiplier;
      
      return {
        ...pillar,
        score: adjustedScore,
        reason: this.generateBreedAwareReason(pillar.pillar, adjustedScore, dog.breed, multiplier)
      };
    }).sort((a, b) => b.score - a.score).map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    // Generate breed-aware personality
    const breedAwarePersonality = this.determineBreedAwarePersonality(adjustedRanking, dog.breed, breedCharacteristics);
    
    // Generate breed-specific recommendations
    const breedRecommendations = this.generateBreedSpecificRecommendations(adjustedRanking, dog, breedCharacteristics);
    
    // Create breed context explanation
    const breedContext = this.generateBreedContext(dog, breedCharacteristics);

    return {
      ranking: adjustedRanking,
      personality: breedAwarePersonality,
      recommendations: breedRecommendations,
      breedAdjusted: true,
      confidence: breedCharacteristics.confidence,
      breedContext
    };
  }

  private static generateBreedAwareReason(pillar: string, score: number, breed: string, multiplier: number): string {
    const baseReasons = {
      mental: score >= 4 ? 'High problem-solving interest' : score >= 2 ? 'Moderate mental stimulation needs' : 'Prefers simple activities',
      physical: score >= 4 ? 'High energy, needs lots of exercise' : score >= 2 ? 'Moderate activity needs' : 'Low energy, gentle exercise preferred',
      social: score >= 4 ? 'Very social, loves interaction' : score >= 2 ? 'Enjoys social time with guidance' : 'Prefers quiet, familiar company',
      environmental: score >= 4 ? 'Adventurous explorer' : score >= 2 ? 'Cautious but curious' : 'Prefers familiar environments',
      instinctual: score >= 4 ? 'Strong natural instincts' : score >= 2 ? 'Some instinctual interests' : 'Limited instinctual behaviors'
    };

    let reason = baseReasons[pillar as keyof typeof baseReasons] || 'Needs assessment';
    
    // Add breed-specific context if significantly adjusted
    if (multiplier > 1.3) {
      reason += ` (${breed}s typically excel in ${pillar} enrichment)`;
    } else if (multiplier < 0.8) {
      reason += ` (${breed}s typically need less ${pillar} stimulation)`;
    }
    
    return reason;
  }

  private static determineBreedAwarePersonality(
    ranking: Array<{pillar: string; rank: number; score: number; reason: string}>, 
    breed: string, 
    characteristics: any
  ): string {
    const topPillar = ranking[0]?.pillar;
    
    // Breed-specific personality mappings
    const breedPersonalities: Record<string, Record<string, string>> = {
      'Border Collie': {
        mental: 'Genius Problem Solver',
        instinctual: 'Master Herder',
        physical: 'Athletic Perfectionist'
      },
      'Labrador Retriever': {
        social: 'Ultimate Family Companion',
        physical: 'Enthusiastic Athlete',
        instinctual: 'Natural Retriever'
      },
      'Greyhound': {
        physical: 'Elegant Sprinter',
        social: 'Gentle Giant',
        environmental: 'Calm Observer'
      },
      'Bulldog': {
        social: 'Laid-back Companion',
        mental: 'Thoughtful Observer',
        environmental: 'Content Homebody'
      }
    };

    // Check for breed-specific personality first
    if (breedPersonalities[breed] && breedPersonalities[breed][topPillar]) {
      return breedPersonalities[breed][topPillar];
    }

    // Fall back to general personalities with breed context
    const generalPersonalities = {
      mental: HIGH_DRIVE_BREEDS.includes(breed) ? 'Strategic Thinker' : 'Problem Solver',
      physical: characteristics.energyPattern === 'sprint' ? 'Sprint Specialist' : 'Active Athlete',
      social: 'Social Butterfly',
      environmental: 'Curious Explorer',
      instinctual: characteristics.driveLevel === 'very_high' ? 'Instinct-Driven Specialist' : 'Natural Hunter'
    };

    return generalPersonalities[topPillar as keyof typeof generalPersonalities] || 'Balanced Companion';
  }

  private static generateBreedSpecificRecommendations(
    ranking: Array<{pillar: string; rank: number; score: number; reason: string}>,
    dog: Dog,
    characteristics: any
  ): string[] {
    const topTwo = ranking.slice(0, 2);
    const recommendations: string[] = [];

    // Breed-specific activity recommendations
    const breedRecommendations: Record<string, Record<string, string[]>> = {
      'Border Collie': {
        mental: ['Advanced puzzle feeders', 'Agility training', 'Trick training sessions'],
        physical: ['Herding ball games', 'Frisbee', 'Long hikes'],
        instinctual: ['Sheep herding simulation', 'Moving toy games', 'Ball obsession activities']
      },
      'Labrador Retriever': {
        physical: ['Swimming', 'Fetch variations', 'Dock diving'],
        social: ['Group training classes', 'Dog park visits', 'Family outdoor activities'],
        instinctual: ['Retrieving games', 'Water sports', 'Scent tracking']
      },
      'Bulldog': {
        social: ['Gentle play sessions', 'Meet and greets', 'Relaxed walks'],
        mental: ['Simple food puzzles', 'Short training sessions', 'Indoor games'],
        environmental: ['Climate-controlled activities', 'Gentle exploration', 'Comfort zones']
      },
      'Greyhound': {
        physical: ['Short sprint sessions', 'Lure coursing', 'Gentle exercise'],
        social: ['Calm socialization', 'Quiet companionship', 'Gentle meetups'],
        environmental: ['Comfortable spaces', 'Temperature-controlled areas', 'Soft surfaces']
      }
    };

    // Get breed-specific recommendations if available
    if (breedRecommendations[dog.breed]) {
      topTwo.forEach(pillar => {
        const breedRecs = breedRecommendations[dog.breed][pillar.pillar];
        if (breedRecs) {
          recommendations.push(...breedRecs.slice(0, 2));
        }
      });
    }

    // Add safety-based recommendations
    if (BRACHYCEPHALIC_BREEDS.includes(dog.breed)) {
      recommendations.push('Climate-controlled gentle activities', 'Short-duration exercises');
    }

    if (characteristics.driveLevel === 'very_high') {
      recommendations.push('High-intensity mental challenges', 'Extended exercise sessions');
    }

    // Fall back to general recommendations if needed
    if (recommendations.length < 4) {
      const generalRecs = {
        mental: ['Puzzle feeders', 'Training sessions'],
        physical: ['Daily walks', 'Fetch games'],
        social: ['Playdates', 'Group activities'],
        environmental: ['New routes', 'Outdoor adventures'],
        instinctual: ['Scent games', 'Natural behaviors']
      };

      topTwo.forEach(pillar => {
        const general = generalRecs[pillar.pillar as keyof typeof generalRecs];
        if (general) {
          recommendations.push(...general);
        }
      });
    }

    return [...new Set(recommendations)].slice(0, 6); // Remove duplicates and limit
  }

  private static generateBreedContext(dog: Dog, characteristics: any): string {
    let context = `${dog.breed}s are ${characteristics.breedGroup.toLowerCase()} dogs `;
    
    if (characteristics.driveLevel === 'very_high') {
      context += 'with exceptionally high drive and energy needs. ';
    } else if (characteristics.driveLevel === 'high') {
      context += 'with high energy and working drive. ';
    } else if (characteristics.driveLevel === 'low') {
      context += 'with lower energy requirements. ';
    } else {
      context += 'with moderate energy needs. ';
    }

    // Add safety considerations
    if (characteristics.safetyConsiderations.length > 0) {
      context += `Important considerations: ${characteristics.safetyConsiderations.join(', ')}. `;
    }

    // Add confidence level
    if (characteristics.confidence < 0.5) {
      context += 'Individual variation is especially important for this breed/mix.';
    } else if (characteristics.confidence > 0.8) {
      context += 'These characteristics are well-documented for this breed.';
    }

    return context;
  }

  static getBreedSafetyWarnings(dog: Dog): string[] {
    const warnings: string[] = [];
    const characteristics = getBreedCharacteristics(dog.breed, dog.breedGroup);

    // Brachycephalic warnings
    if (BRACHYCEPHALIC_BREEDS.includes(dog.breed)) {
      warnings.push('⚠️ Avoid high-intensity exercise due to breathing limitations');
      warnings.push('🌡️ Monitor for overheating in warm weather');
    }

    // Age-specific breed warnings
    if (dog.age >= 84) {
      if (['German Shepherd', 'Labrador Retriever', 'Golden Retriever'].includes(dog.breed)) {
        warnings.push('🦴 Monitor for hip/joint issues common in senior ' + dog.breed + 's');
      }
    }

    // High-drive breed warnings
    if (HIGH_DRIVE_BREEDS.includes(dog.breed) && dog.age < 18) {
      warnings.push('🧠 High mental stimulation essential to prevent destructive behavior');
    }

    return warnings;
  }
}
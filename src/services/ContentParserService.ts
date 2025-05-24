
import { ScrapedContent, ParsedActivity } from '@/types/discovery';

export class ContentParserService {
  private static readonly PILLAR_KEYWORDS = {
    mental: ['puzzle', 'brain', 'thinking', 'problem-solving', 'cognitive', 'memory', 'training'],
    physical: ['exercise', 'running', 'jumping', 'agility', 'fetch', 'walking', 'cardio'],
    social: ['playdate', 'dog park', 'socialization', 'other dogs', 'interaction', 'friends'],
    environmental: ['new places', 'exploration', 'outside', 'different', 'novel', 'adventure'],
    instinctual: ['sniffing', 'hunting', 'foraging', 'digging', 'chasing', 'scent', 'natural']
  };

  static async parseContent(content: ScrapedContent): Promise<ParsedActivity | null> {
    try {
      // Simulate AI parsing with rule-based extraction
      const parsed = await this.extractActivityDetails(content);
      
      if (parsed.confidence < 0.6) {
        console.log(`Low confidence activity skipped: ${parsed.title}`);
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error parsing content:', error);
      return null;
    }
  }

  private static async extractActivityDetails(content: ScrapedContent): Promise<ParsedActivity> {
    const text = content.content.toLowerCase();
    
    // Extract title (use existing title or extract from content)
    const title = content.title || this.extractTitle(content.content);
    
    // Determine pillar based on keywords
    const pillar = this.determinePillar(text);
    
    // Extract duration
    const duration = this.extractDuration(text);
    
    // Extract difficulty
    const difficulty = this.extractDifficulty(text);
    
    // Extract materials
    const materials = this.extractMaterials(content.content);
    
    // Extract instructions
    const instructions = this.extractInstructions(content.content);
    
    // Extract benefits
    const benefits = this.extractBenefits(content.content);
    
    // Extract emotional goals
    const emotionalGoals = this.extractEmotionalGoals(text);
    
    // Generate tags
    const tags = this.generateTags(text, pillar);
    
    // Determine age group and energy level
    const ageGroup = this.determineAgeGroup(text);
    const energyLevel = this.determineEnergyLevel(text, pillar);
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(materials, instructions, benefits);
    
    return {
      title,
      description: benefits,
      pillar,
      difficulty,
      duration,
      materials,
      instructions,
      benefits,
      emotionalGoals,
      tags,
      ageGroup,
      energyLevel,
      confidence
    };
  }

  private static extractTitle(content: string): string {
    const lines = content.split('\n');
    return lines[0]?.substring(0, 60) || 'Discovered Activity';
  }

  private static determinePillar(text: string): string {
    const scores: Record<string, number> = {};
    
    Object.entries(this.PILLAR_KEYWORDS).forEach(([pillar, keywords]) => {
      scores[pillar] = keywords.reduce((score, keyword) => {
        return score + (text.includes(keyword) ? 1 : 0);
      }, 0);
    });
    
    const topPillar = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
    return topPillar[0];
  }

  private static extractDuration(text: string): number {
    const durationMatch = text.match(/(\d+)[-\s]*(minutes?|mins?|hours?)/i);
    if (durationMatch) {
      const num = parseInt(durationMatch[1]);
      return durationMatch[2].startsWith('hour') ? num * 60 : num;
    }
    return 15; // Default duration
  }

  private static extractDifficulty(text: string): string {
    if (text.includes('easy') || text.includes('simple') || text.includes('beginner')) return 'Easy';
    if (text.includes('hard') || text.includes('advanced') || text.includes('challenging')) return 'Hard';
    return 'Medium';
  }

  private static extractMaterials(content: string): string[] {
    const materialSection = content.match(/materials?[:\s]*(.*?)(?:\n\n|\. [A-Z]|$)/i);
    if (materialSection) {
      return materialSection[1]
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, 6);
    }
    
    // Fallback: extract common materials mentioned
    const commonMaterials = ['treats', 'toys', 'balls', 'rope', 'mat', 'bowl', 'kong', 'tennis ball'];
    return commonMaterials.filter(material => 
      content.toLowerCase().includes(material)
    ).slice(0, 4);
  }

  private static extractInstructions(content: string): string[] {
    const instructionPatterns = [
      /instructions?[:\s]*(.*?)(?:\n\n|benefits?|$)/is,
      /steps?[:\s]*(.*?)(?:\n\n|benefits?|$)/is,
      /how to[:\s]*(.*?)(?:\n\n|benefits?|$)/is
    ];
    
    for (const pattern of instructionPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1]
          .split(/\d+\.|[•\-\n]/)
          .map(step => step.trim())
          .filter(step => step.length > 10)
          .slice(0, 6);
      }
    }
    
    return ['Follow the activity description to complete this enrichment exercise'];
  }

  private static extractBenefits(content: string): string {
    const benefitMatch = content.match(/benefits?[:\s]*(.*?)(?:\n\n|\. [A-Z]|instructions|materials|$)/i);
    if (benefitMatch) {
      return benefitMatch[1].trim().substring(0, 200);
    }
    
    return 'Provides mental and physical stimulation for your dog.';
  }

  private static extractEmotionalGoals(text: string): string[] {
    const goals = [];
    
    if (text.includes('anxiety') || text.includes('calm')) goals.push('Reduces anxiety');
    if (text.includes('confidence') || text.includes('builds')) goals.push('Builds confidence');
    if (text.includes('boredom') || text.includes('stimulation')) goals.push('Reduces boredom');
    if (text.includes('bond') || text.includes('relationship')) goals.push('Strengthens bond');
    if (text.includes('focus') || text.includes('attention')) goals.push('Improves focus');
    
    return goals.length > 0 ? goals : ['Provides enrichment'];
  }

  private static generateTags(text: string, pillar: string): string[] {
    const tags = [pillar];
    
    if (text.includes('diy') || text.includes('homemade')) tags.push('DIY');
    if (text.includes('indoor')) tags.push('indoor');
    if (text.includes('outdoor')) tags.push('outdoor');
    if (text.includes('puzzle')) tags.push('puzzle');
    if (text.includes('treat')) tags.push('food-based');
    if (text.includes('scent')) tags.push('scent-work');
    
    return tags.slice(0, 5);
  }

  private static determineAgeGroup(text: string): string {
    if (text.includes('puppy') || text.includes('young')) return 'Puppy';
    if (text.includes('senior') || text.includes('old')) return 'Senior';
    return 'All Ages';
  }

  private static determineEnergyLevel(text: string, pillar: string): string {
    if (pillar === 'physical' || text.includes('high energy') || text.includes('active')) return 'High';
    if (text.includes('calm') || text.includes('gentle') || text.includes('low energy')) return 'Low';
    return 'Medium';
  }

  private static calculateConfidence(materials: string[], instructions: string[], benefits: string): number {
    let confidence = 0.5;
    
    if (materials.length >= 2) confidence += 0.2;
    if (instructions.length >= 3) confidence += 0.2;
    if (benefits.length > 50) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }
}

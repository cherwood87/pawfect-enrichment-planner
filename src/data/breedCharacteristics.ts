/**
 * Research-backed breed characteristics database
 * Sources: AKC breed standards, veterinary behavioral literature, 
 * Dr. Stanley Coren's "The Intelligence of Dogs", breed-specific studies
 */

export interface BreedCharacteristics {
  breedGroup: string;
  pillarMultipliers: {
    mental: number;
    physical: number;
    social: number;
    environmental: number;
    instinctual: number;
  };
  driveLevel: 'low' | 'moderate' | 'high' | 'very_high';
  workingComplexity: 'basic' | 'intermediate' | 'advanced' | 'professional';
  safetyConsiderations: string[];
  physicalLimitations: string[];
  energyPattern: 'steady' | 'burst' | 'endurance' | 'sprint';
  confidence: number; // 0-1 scale for how well-documented this breed's needs are
}

export const BREED_CHARACTERISTICS: Record<string, BreedCharacteristics> = {
  // HERDING GROUP - High mental, moderate to high physical, strong instinctual
  'Border Collie': {
    breedGroup: 'Herding',
    pillarMultipliers: { mental: 1.8, physical: 1.4, social: 1.2, environmental: 1.3, instinctual: 1.6 },
    driveLevel: 'very_high',
    workingComplexity: 'professional',
    safetyConsiderations: ['high_exercise_requirements', 'mental_stimulation_critical'],
    physicalLimitations: [],
    energyPattern: 'endurance',
    confidence: 0.95
  },
  'Australian Shepherd': {
    breedGroup: 'Herding',
    pillarMultipliers: { mental: 1.6, physical: 1.5, social: 1.3, environmental: 1.2, instinctual: 1.4 },
    driveLevel: 'very_high',
    workingComplexity: 'advanced',
    safetyConsiderations: ['high_exercise_requirements'],
    physicalLimitations: [],
    energyPattern: 'endurance',
    confidence: 0.9
  },
  'German Shepherd': {
    breedGroup: 'Herding',
    pillarMultipliers: { mental: 1.7, physical: 1.3, social: 1.1, environmental: 1.2, instinctual: 1.5 },
    driveLevel: 'high',
    workingComplexity: 'professional',
    safetyConsiderations: ['hip_dysplasia_prone'],
    physicalLimitations: ['joint_monitoring_required'],
    energyPattern: 'steady',
    confidence: 0.95
  },

  // WORKING GROUP - High mental and physical, task-oriented
  'Siberian Husky': {
    breedGroup: 'Working',
    pillarMultipliers: { mental: 1.3, physical: 1.8, social: 1.4, environmental: 1.5, instinctual: 1.2 },
    driveLevel: 'very_high',
    workingComplexity: 'advanced',
    safetyConsiderations: ['high_exercise_requirements', 'escape_artist'],
    physicalLimitations: ['heat_sensitive'],
    energyPattern: 'endurance',
    confidence: 0.9
  },
  'Rottweiler': {
    breedGroup: 'Working',
    pillarMultipliers: { mental: 1.4, physical: 1.2, social: 0.9, environmental: 1.0, instinctual: 1.3 },
    driveLevel: 'moderate',
    workingComplexity: 'advanced',
    safetyConsiderations: ['socialization_critical', 'size_considerations'],
    physicalLimitations: ['joint_monitoring_required'],
    energyPattern: 'burst',
    confidence: 0.85
  },

  // SPORTING GROUP - High physical, moderate mental, social
  'Labrador Retriever': {
    breedGroup: 'Sporting',
    pillarMultipliers: { mental: 1.2, physical: 1.6, social: 1.7, environmental: 1.3, instinctual: 1.3 },
    driveLevel: 'high',
    workingComplexity: 'intermediate',
    safetyConsiderations: ['water_activities_suitable', 'food_motivated'],
    physicalLimitations: ['obesity_prone'],
    energyPattern: 'steady',
    confidence: 0.95
  },
  'Golden Retriever': {
    breedGroup: 'Sporting',
    pillarMultipliers: { mental: 1.3, physical: 1.5, social: 1.8, environmental: 1.2, instinctual: 1.2 },
    driveLevel: 'high',
    workingComplexity: 'intermediate',
    safetyConsiderations: ['gentle_temperament', 'water_activities_suitable'],
    physicalLimitations: ['hip_dysplasia_prone'],
    energyPattern: 'steady',
    confidence: 0.95
  },

  // HOUND GROUP - High instinctual, moderate physical
  'Beagle': {
    breedGroup: 'Hound',
    pillarMultipliers: { mental: 1.1, physical: 1.3, social: 1.5, environmental: 1.4, instinctual: 1.8 },
    driveLevel: 'moderate',
    workingComplexity: 'basic',
    safetyConsiderations: ['scent_driven', 'escape_risk_when_tracking'],
    physicalLimitations: ['obesity_prone'],
    energyPattern: 'steady',
    confidence: 0.9
  },
  'Greyhound': {
    breedGroup: 'Hound',
    pillarMultipliers: { mental: 0.8, physical: 1.2, social: 1.3, environmental: 1.0, instinctual: 1.4 },
    driveLevel: 'moderate',
    workingComplexity: 'basic',
    safetyConsiderations: ['sprint_not_endurance', 'gentle_temperament'],
    physicalLimitations: ['thin_skin', 'cold_sensitive', 'short_bursts_only'],
    energyPattern: 'sprint',
    confidence: 0.85
  },

  // TOY GROUP - Lower physical, higher social
  'Chihuahua': {
    breedGroup: 'Toy',
    pillarMultipliers: { mental: 1.2, physical: 0.6, social: 1.4, environmental: 0.8, instinctual: 1.1 },
    driveLevel: 'moderate',
    workingComplexity: 'basic',
    safetyConsiderations: ['small_size_safety', 'temperature_sensitive'],
    physicalLimitations: ['fragile_bones', 'limited_exercise_tolerance'],
    energyPattern: 'burst',
    confidence: 0.8
  },
  'Pug': {
    breedGroup: 'Toy',
    pillarMultipliers: { mental: 1.0, physical: 0.7, social: 1.6, environmental: 1.0, instinctual: 0.9 },
    driveLevel: 'low',
    workingComplexity: 'basic',
    safetyConsiderations: ['brachycephalic', 'heat_sensitive', 'breathing_limitations'],
    physicalLimitations: ['exercise_intolerance', 'overheating_risk'],
    energyPattern: 'burst',
    confidence: 0.9
  },

  // TERRIER GROUP - High instinctual, moderate to high mental
  'Jack Russell Terrier': {
    breedGroup: 'Terrier',
    pillarMultipliers: { mental: 1.5, physical: 1.6, social: 1.1, environmental: 1.3, instinctual: 1.7 },
    driveLevel: 'very_high',
    workingComplexity: 'advanced',
    safetyConsiderations: ['high_prey_drive', 'escape_artist'],
    physicalLimitations: [],
    energyPattern: 'burst',
    confidence: 0.85
  },
  'Bull Terrier': {
    breedGroup: 'Terrier',
    pillarMultipliers: { mental: 1.3, physical: 1.4, social: 1.2, environmental: 1.1, instinctual: 1.5 },
    driveLevel: 'high',
    workingComplexity: 'intermediate',
    safetyConsiderations: ['strong_prey_drive', 'socialization_important'],
    physicalLimitations: [],
    energyPattern: 'burst',
    confidence: 0.8
  },

  // NON-SPORTING GROUP - Varied characteristics
  'Bulldog': {
    breedGroup: 'Non-Sporting',
    pillarMultipliers: { mental: 1.0, physical: 0.5, social: 1.4, environmental: 0.8, instinctual: 0.8 },
    driveLevel: 'low',
    workingComplexity: 'basic',
    safetyConsiderations: ['brachycephalic', 'heat_sensitive', 'exercise_limitations'],
    physicalLimitations: ['severe_exercise_intolerance', 'breathing_issues', 'overheating_risk'],
    energyPattern: 'burst',
    confidence: 0.95
  },
  'Poodle': {
    breedGroup: 'Non-Sporting',
    pillarMultipliers: { mental: 1.7, physical: 1.3, social: 1.4, environmental: 1.2, instinctual: 1.1 },
    driveLevel: 'high',
    workingComplexity: 'advanced',
    safetyConsiderations: ['intelligent_requires_stimulation'],
    physicalLimitations: [],
    energyPattern: 'steady',
    confidence: 0.9
  }
};

// Breed group defaults for breeds not in the specific list
export const BREED_GROUP_DEFAULTS: Record<string, Partial<BreedCharacteristics>> = {
  'Herding': {
    pillarMultipliers: { mental: 1.5, physical: 1.3, social: 1.2, environmental: 1.2, instinctual: 1.4 },
    driveLevel: 'high',
    workingComplexity: 'advanced',
    confidence: 0.7
  },
  'Working': {
    pillarMultipliers: { mental: 1.4, physical: 1.4, social: 1.1, environmental: 1.1, instinctual: 1.3 },
    driveLevel: 'high',
    workingComplexity: 'advanced',
    confidence: 0.7
  },
  'Sporting': {
    pillarMultipliers: { mental: 1.2, physical: 1.5, social: 1.4, environmental: 1.3, instinctual: 1.2 },
    driveLevel: 'high',
    workingComplexity: 'intermediate',
    confidence: 0.7
  },
  'Hound': {
    pillarMultipliers: { mental: 1.0, physical: 1.2, social: 1.3, environmental: 1.3, instinctual: 1.6 },
    driveLevel: 'moderate',
    workingComplexity: 'basic',
    confidence: 0.6
  },
  'Terrier': {
    pillarMultipliers: { mental: 1.3, physical: 1.4, social: 1.1, environmental: 1.2, instinctual: 1.6 },
    driveLevel: 'high',
    workingComplexity: 'intermediate',
    confidence: 0.6
  },
  'Toy': {
    pillarMultipliers: { mental: 1.1, physical: 0.7, social: 1.4, environmental: 1.0, instinctual: 1.0 },
    driveLevel: 'moderate',
    workingComplexity: 'basic',
    confidence: 0.6
  },
  'Non-Sporting': {
    pillarMultipliers: { mental: 1.2, physical: 1.1, social: 1.3, environmental: 1.1, instinctual: 1.1 },
    driveLevel: 'moderate',
    workingComplexity: 'intermediate',
    confidence: 0.5
  },
  'Mixed Breed': {
    pillarMultipliers: { mental: 1.0, physical: 1.0, social: 1.0, environmental: 1.0, instinctual: 1.0 },
    driveLevel: 'moderate',
    workingComplexity: 'intermediate',
    confidence: 0.3
  }
};

export const BRACHYCEPHALIC_BREEDS = [
  'Bulldog', 'French Bulldog', 'Pug', 'Boston Terrier', 'Boxer',
  'Shih Tzu', 'Cavalier King Charles Spaniel', 'Brussels Griffon',
  'Pekingese', 'Japanese Chin'
];

export const HIGH_DRIVE_BREEDS = [
  'Border Collie', 'Belgian Malinois', 'German Shepherd', 'Australian Shepherd',
  'Jack Russell Terrier', 'Siberian Husky', 'Weimaraner', 'Vizsla'
];

export const getBreedCharacteristics = (breed: string, breedGroup?: string): BreedCharacteristics => {
  // First check for specific breed
  if (BREED_CHARACTERISTICS[breed]) {
    return BREED_CHARACTERISTICS[breed];
  }
  
  // Fall back to breed group defaults
  const groupDefaults = BREED_GROUP_DEFAULTS[breedGroup || 'Mixed Breed'];
  
  return {
    breedGroup: breedGroup || 'Mixed Breed',
    pillarMultipliers: groupDefaults?.pillarMultipliers || { mental: 1.0, physical: 1.0, social: 1.0, environmental: 1.0, instinctual: 1.0 },
    driveLevel: groupDefaults?.driveLevel || 'moderate',
    workingComplexity: groupDefaults?.workingComplexity || 'intermediate',
    safetyConsiderations: [],
    physicalLimitations: [],
    energyPattern: 'steady',
    confidence: groupDefaults?.confidence || 0.3
  };
};
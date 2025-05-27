
import { ActivityLibraryItem } from '@/types/activity';

export const environmentalActivities: ActivityLibraryItem[] = [
  {
    id: 'environmental-new-route',
    title: 'Explore New Walking Route',
    pillar: 'environmental',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Leash', 'Waste bags', 'Map/GPS'],
    emotionalGoals: ['Curiosity', 'Adventure'],
    instructions: [
      'Choose safe, dog-friendly areas',
      'Allow extra sniffing time',
      'Take photos of interesting spots',
      'Note your dog\'s reactions to new sights'
    ],
    benefits: 'Mental stimulation from new smells, sights, and sounds',
    tags: ['exploration', 'walking', 'outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'environmental-texture-walk',
    title: 'Different Surfaces Walk',
    pillar: 'environmental',
    difficulty: 'Easy',
    duration: 20,
    materials: ['Leash', 'Treats for encouragement'],
    emotionalGoals: ['Confidence', 'Adaptability'],
    instructions: [
      'Plan route with varied surfaces (grass, gravel, concrete)',
      'Encourage exploration of new textures',
      'Reward brave behavior',
      'Go at your dog\'s pace'
    ],
    benefits: 'Builds confidence and desensitizes to different textures',
    tags: ['textures', 'confidence', 'outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'environmental-car-ride',
    title: 'Car Ride Adventure',
    pillar: 'environmental',
    difficulty: 'Medium',
    duration: 45,
    materials: ['Car harness/crate', 'Water', 'Destination plan'],
    emotionalGoals: ['Excitement', 'Confidence'],
    instructions: [
      'Secure dog safely in vehicle',
      'Start with short trips',
      'Choose interesting destinations',
      'Take breaks for bathroom and water'
    ],
    benefits: 'Exposure to vehicle travel and new destinations',
    tags: ['travel', 'car', 'adventure'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'environmental-weather-walk',
    title: 'Weather Experience Walk',
    pillar: 'environmental',
    difficulty: 'Medium',
    duration: 25,
    materials: ['Weather-appropriate gear', 'Leash', 'Towel'],
    emotionalGoals: ['Resilience', 'Adaptability'],
    instructions: [
      'Dress appropriately for weather conditions',
      'Start with mild weather variations',
      'Keep sessions positive',
      'Dry off thoroughly if wet'
    ],
    benefits: 'Builds resilience and comfort in various weather conditions',
    tags: ['weather', 'resilience', 'outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'environmental-beach-visit',
    title: 'Beach or Lake Visit',
    pillar: 'environmental',
    difficulty: 'Medium',
    duration: 60,
    materials: ['Leash', 'Water', 'Towels', 'Sun protection'],
    emotionalGoals: ['Wonder', 'Adventure'],
    instructions: [
      'Check if dogs are allowed',
      'Let dog explore at their pace',
      'Provide fresh water frequently',
      'Rinse off salt water or sand'
    ],
    benefits: 'Rich sensory experience with water, sand, and new smells',
    tags: ['beach', 'water', 'outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'environmental-city-sounds',
    title: 'Urban Sound Exposure',
    pillar: 'environmental',
    difficulty: 'Medium',
    duration: 30,
    materials: ['Leash', 'Treats', 'Urban environment'],
    emotionalGoals: ['Confidence', 'Adaptability'],
    instructions: [
      'Start in quieter urban areas',
      'Gradually expose to city sounds',
      'Reward calm behavior',
      'Use counter-conditioning with treats'
    ],
    benefits: 'Builds confidence around urban environments',
    tags: ['city', 'sounds', 'confidence'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'environmental-elevator-ride',
    title: 'Elevator Training',
    pillar: 'environmental',
    difficulty: 'Medium',
    duration: 20,
    materials: ['Leash', 'Treats', 'Elevator access'],
    emotionalGoals: ['Confidence', 'Calm'],
    instructions: [
      'Start by just approaching elevator',
      'Reward calm behavior near elevator',
      'Gradually work up to riding',
      'Keep initial rides short'
    ],
    benefits: 'Prepares dog for urban living and vet visits',
    tags: ['elevator', 'urban', 'confidence'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  }
];

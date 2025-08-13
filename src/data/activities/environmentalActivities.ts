
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
      'Choose safe, dog-friendly areas with sidewalks/paths - avoid busy roads or construction zones',
      'Allow extra sniffing time (2-3 minutes per interesting spot) - this is mental enrichment',
      'Walk at slower pace than usual to let dog process new sights, sounds, and smells',
      'Take photos of spots your dog shows high interest in to revisit later',
      'Note your dog\'s reactions: confident exploration vs. hesitation, and adjust accordingly',
      'If dog seems overwhelmed, take breaks in quiet areas until they relax',
      'Complete route when dog shows familiarity with new area and walks confidently'
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
      'Plan 20-minute route including: grass, concrete, gravel, sand, wooden decks, or metal grates',
      'Start with textures dog knows, then introduce one new surface at a time',
      'Encourage exploration by walking confidently onto new surface first, then calling dog',
      'Reward brave behavior immediately with treats and praise when dog steps on new texture',
      'If dog refuses surface, don\'t force - try smaller steps like just front paws first',
      'Go at your dog\'s pace - some may need 2-3 exposures to feel comfortable',
      'Complete when dog willingly walks on 4-5 different surfaces without hesitation'
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
      'SAFETY FIRST: Secure dog with crash-tested harness or crate - never loose in car',
      'Start with 5-10 minute trips to build positive association before longer adventures',
      'Choose interesting destinations: new parks, pet stores, or dog-friendly businesses',
      'Take bathroom and water breaks every 30-45 minutes on longer trips',
      'If dog shows car sickness (drooling, whining), try shorter trips and gradual increase',
      'Keep car well-ventilated and at comfortable temperature - never leave dog alone in car',
      'Complete trip successfully when dog remains calm and comfortable throughout journey'
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
      'Dress dog appropriately: coat for cold (under 45°F), booties for hot pavement or snow',
      'Start with mild weather variations before extreme conditions (light rain vs. thunderstorm)',
      'Keep initial exposure short (10-15 minutes) and gradually increase as dog adapts',
      'Watch for signs of discomfort: shivering, excessive panting, lifting paws, or seeking shelter',
      'Keep sessions positive with treats and encouragement - never force dog to continue if distressed',
      'Dry off thoroughly if wet, especially paws and ears to prevent issues',
      'Complete when dog shows confidence walking in various weather conditions'
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
      'ESSENTIAL: Check if dogs are allowed, leash requirements, and any seasonal restrictions',
      'Let dog explore at their own pace - many are initially cautious around waves and sand',
      'Provide fresh drinking water every 15-20 minutes - salt water can cause dehydration',
      'Watch for signs of overheating or fatigue: excessive panting, slowing down, seeking shade',
      'Prevent dogs from drinking salt water or eating sand, which can cause digestive issues',
      'Take breaks in shade and limit exposure to 45-60 minutes to prevent sunburn on nose/ears',
      'Rinse off salt water and sand thoroughly, especially between toes and in ears'
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
      'Start in quieter urban areas during off-peak hours (mid-morning or mid-afternoon)',
      'Gradually expose to city sounds: cars, sirens, construction, crowds - one type at a time',
      'Reward calm behavior immediately with treats when dog remains relaxed around new sounds',
      'Use counter-conditioning: give treats the moment dog hears concerning sound, before they react',
      'If dog shows fear (trembling, trying to hide), move farther from sound source and try again',
      'Keep sessions to 20-30 minutes to prevent overwhelming your dog with too much stimulation',
      'Complete when dog can walk calmly through moderate urban environment without stress signs'
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
      'Week 1: Just approach elevator doors and reward calm behavior - don\'t enter yet',
      'Week 2: Stand inside stationary elevator with doors open, giving treats for calm behavior',
      'Week 3: Take one-floor ride up and immediately back down with lots of treats',
      'If dog shows anxiety (panting, trembling), go back to previous step for a few more days',
      'Keep initial rides very short (1-2 floors) and always have treats ready',
      'Practice during low-traffic times to avoid crowded, stressful situations',
      'Complete when dog can ride elevator calmly for 5+ floors without stress signs'
    ],
    benefits: 'Prepares dog for urban living and vet visits',
    tags: ['elevator', 'urban', 'confidence'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  }
];

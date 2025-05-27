import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

export const activityLibrary: ActivityLibraryItem[] = [
  // Mental Activities
  {
    id: 'mental-puzzle-feeder',
    title: 'Puzzle Feeder Challenge',
    pillar: 'mental',
    difficulty: 'Easy',
    duration: 15,
    materials: ['Puzzle feeder', 'Kibble or treats'],
    emotionalGoals: ['Focus', 'Problem-solving'],
    instructions: [
      'Fill puzzle feeder with your dog\'s regular kibble',
      'Place it in their usual feeding area',
      'Let your dog figure out how to get the food out',
      'Supervise and encourage without helping initially'
    ],
    benefits: 'Slows down eating, provides mental stimulation, and builds problem-solving skills',
    tags: ['feeding', 'problem-solving', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'mental-hide-treats',
    title: 'Hide & Seek Treats',
    pillar: 'mental',
    difficulty: 'Easy',
    duration: 10,
    materials: ['Small treats', 'Various hiding spots'],
    emotionalGoals: ['Excitement', 'Focus'],
    instructions: [
      'Start with easy hiding spots your dog can see',
      'Hide 5-10 small treats around the room',
      'Use the "find it" command',
      'Gradually increase difficulty of hiding spots'
    ],
    benefits: 'Engages natural foraging instincts and provides mental exercise',
    tags: ['treats', 'foraging', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'mental-training-session',
    title: 'Basic Training Session',
    pillar: 'mental',
    difficulty: 'Medium',
    duration: 15,
    materials: ['Treats', 'Clicker (optional)'],
    emotionalGoals: ['Focus', 'Bonding'],
    instructions: [
      'Choose 2-3 commands to work on',
      'Keep sessions short and positive',
      'Use high-value treats for motivation',
      'End on a successful note'
    ],
    benefits: 'Strengthens bond, improves obedience, and provides mental stimulation',
    tags: ['training', 'obedience', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'mental-trick-training',
    title: 'Fun Trick Training',
    pillar: 'mental',
    difficulty: 'Medium',
    duration: 20,
    materials: ['Treats', 'Props (optional)'],
    emotionalGoals: ['Confidence', 'Bonding'],
    instructions: [
      'Choose a fun trick like "shake", "roll over", or "play dead"',
      'Break the trick down into small steps',
      'Reward each small success',
      'Practice in short, frequent sessions'
    ],
    benefits: 'Builds confidence, strengthens bond, and provides mental challenge',
    tags: ['tricks', 'training', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'mental-snuffle-mat',
    title: 'Snuffle Mat Foraging',
    pillar: 'mental',
    difficulty: 'Easy',
    duration: 15,
    materials: ['Snuffle mat', 'Small treats or kibble'],
    emotionalGoals: ['Calm focus', 'Satisfaction'],
    instructions: [
      'Scatter treats throughout the snuffle mat',
      'Let your dog sniff and forage naturally',
      'Supervise to ensure they don\'t eat the mat',
      'Clean mat regularly'
    ],
    benefits: 'Provides natural foraging behavior and mental stimulation',
    tags: ['foraging', 'calm', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },

  // Physical Activities
  {
    id: 'physical-morning-walk',
    title: 'Morning Walk',
    pillar: 'physical',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Leash', 'Waste bags', 'Water'],
    emotionalGoals: ['Energy release', 'Bonding'],
    instructions: [
      'Start with a 5-minute warm-up at slow pace',
      'Allow sniffing breaks every few minutes',
      'Maintain steady pace for main walk',
      'Cool down with slow walk home'
    ],
    benefits: 'Essential exercise, bathroom breaks, and bonding time',
    tags: ['walking', 'routine', 'outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'physical-fetch',
    title: 'Fetch Game',
    pillar: 'physical',
    difficulty: 'Easy',
    duration: 20,
    materials: ['Ball or favorite toy', 'Open space'],
    emotionalGoals: ['Excitement', 'Energy release'],
    instructions: [
      'Start with short throws to warm up',
      'Use enthusiastic voice commands',
      'Reward when dog brings toy back',
      'Gradually increase throwing distance'
    ],
    benefits: 'High-intensity exercise and reinforces retrieve training',
    tags: ['fetch', 'exercise', 'outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'High'
  },
  {
    id: 'physical-indoor-obstacles',
    title: 'Indoor Obstacle Course',
    pillar: 'physical',
    difficulty: 'Medium',
    duration: 15,
    materials: ['Household items', 'Treats', 'Space'],
    emotionalGoals: ['Confidence', 'Achievement'],
    instructions: [
      'Set up simple obstacles using pillows, chairs, boxes',
      'Guide dog through course with treats',
      'Start simple and add complexity gradually',
      'Always end with praise and rewards'
    ],
    benefits: 'Physical exercise and mental stimulation in limited space',
    tags: ['obstacles', 'indoor', 'agility'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'physical-swimming',
    title: 'Swimming Session',
    pillar: 'physical',
    difficulty: 'Hard',
    duration: 30,
    materials: ['Water access', 'Life vest (if needed)', 'Towels'],
    emotionalGoals: ['Joy', 'Confidence'],
    instructions: [
      'Start in shallow water',
      'Let dog enter at their own pace',
      'Stay close for safety',
      'Dry thoroughly after swimming'
    ],
    benefits: 'Low-impact, full-body exercise excellent for joint health',
    tags: ['swimming', 'water', 'outdoor'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },
  {
    id: 'physical-running',
    title: 'Jogging Together',
    pillar: 'physical',
    difficulty: 'Hard',
    duration: 45,
    materials: ['Running leash', 'Water', 'Proper footwear'],
    emotionalGoals: ['Endurance', 'Bonding'],
    instructions: [
      'Build up distance gradually',
      'Watch for signs of fatigue',
      'Bring water for both of you',
      'Cool down with walking'
    ],
    benefits: 'High-intensity cardio exercise for both dog and owner',
    tags: ['running', 'cardio', 'outdoor'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },

  // Social Activities
  {
    id: 'social-dog-park',
    title: 'Dog Park Visit',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 45,
    materials: ['Leash', 'Water', 'Waste bags'],
    emotionalGoals: ['Socialization', 'Excitement'],
    instructions: [
      'Observe other dogs before entering',
      'Keep initial visit short',
      'Watch your dog\'s body language',
      'Intervene if play gets too rough'
    ],
    benefits: 'Socialization with other dogs and people',
    tags: ['socialization', 'outdoor', 'dogs'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'social-puppy-class',
    title: 'Puppy Training Class',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 60,
    materials: ['Treats', 'Leash', 'Enrollment fee'],
    emotionalGoals: ['Confidence', 'Learning'],
    instructions: [
      'Research reputable training facilities',
      'Bring high-value treats',
      'Stay positive and patient',
      'Practice lessons at home'
    ],
    benefits: 'Structured socialization and basic training',
    tags: ['training', 'class', 'socialization'],
    ageGroup: 'Puppy',
    energyLevel: 'Medium'
  },
  {
    id: 'social-neighborhood-walk',
    title: 'Social Neighborhood Walk',
    pillar: 'social',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Leash', 'Treats', 'Waste bags'],
    emotionalGoals: ['Confidence', 'Curiosity'],
    instructions: [
      'Choose busy but safe neighborhood areas',
      'Allow greetings with friendly people',
      'Practice loose leash walking',
      'Reward calm behavior around distractions'
    ],
    benefits: 'Real-world socialization practice',
    tags: ['walking', 'socialization', 'training'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'social-playdate',
    title: 'Dog Playdate',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 60,
    materials: ['Toys', 'Water', 'Safe space'],
    emotionalGoals: ['Joy', 'Friendship'],
    instructions: [
      'Choose compatible dogs of similar size/energy',
      'Meet in neutral territory first',
      'Supervise all interactions',
      'Have backup plan if dogs don\'t get along'
    ],
    benefits: 'One-on-one socialization and play',
    tags: ['playdate', 'socialization', 'friends'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'social-pet-store',
    title: 'Pet Store Visit',
    pillar: 'social',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Leash', 'Treats', 'Shopping list'],
    emotionalGoals: ['Confidence', 'Curiosity'],
    instructions: [
      'Choose dog-friendly pet stores',
      'Keep visit short initially',
      'Reward calm behavior',
      'Allow positive interactions with staff'
    ],
    benefits: 'Exposure to new environments and people',
    tags: ['outing', 'socialization', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },

  // Environmental Activities
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

  // Instinctual Activities
  {
    id: 'instinctual-digging-box',
    title: 'Digging Box',
    pillar: 'instinctual',
    difficulty: 'Easy',
    duration: 20,
    materials: ['Large box or sandbox', 'Sand/dirt', 'Hidden toys/treats'],
    emotionalGoals: ['Satisfaction', 'Natural expression'],
    instructions: [
      'Fill box with dog-safe digging material',
      'Hide treats and toys in the material',
      'Encourage digging behavior',
      'Supervise to ensure safety'
    ],
    benefits: 'Satisfies natural digging instincts in appropriate way',
    tags: ['digging', 'natural', 'indoor/outdoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'instinctual-scent-work',
    title: 'Basic Scent Work',
    pillar: 'instinctual',
    difficulty: 'Medium',
    duration: 25,
    materials: ['Cotton swabs', 'Essential oils', 'Containers', 'Treats'],
    emotionalGoals: ['Focus', 'Achievement'],
    instructions: [
      'Start with one scent (like vanilla)',
      'Place scented cotton swab in container',
      'Reward when dog sniffs the correct container',
      'Gradually add difficulty'
    ],
    benefits: 'Engages powerful sense of smell for mental stimulation',
    tags: ['scent', 'nose work', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'instinctual-tracking',
    title: 'Tracking Game',
    pillar: 'instinctual',
    difficulty: 'Hard',
    duration: 40,
    materials: ['Treats', 'Long line', 'Tracking area'],
    emotionalGoals: ['Determination', 'Natural satisfaction'],
    instructions: [
      'Create a simple scent trail with treats',
      'Start with short, straight trails',
      'Use encouraging voice',
      'Gradually increase trail complexity'
    ],
    benefits: 'Develops natural tracking abilities and provides mental challenge',
    tags: ['tracking', 'scent', 'outdoor'],
    ageGroup: 'Adult',
    energyLevel: 'Medium'
  },
  {
    id: 'instinctual-herding-play',
    title: 'Herding Ball Game',
    pillar: 'instinctual',
    difficulty: 'Medium',
    duration: 30,
    materials: ['Large herding ball', 'Open space'],
    emotionalGoals: ['Focus', 'Control'],
    instructions: [
      'Introduce ball gradually',
      'Allow natural herding behaviors',
      'Set boundaries for play area',
      'Supervise to prevent overexertion'
    ],
    benefits: 'Satisfies herding instincts in controlled environment',
    tags: ['herding', 'ball', 'instinct'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },
  {
    id: 'instinctual-tug-war',
    title: 'Tug of War',
    pillar: 'instinctual',
    difficulty: 'Easy',
    duration: 15,
    materials: ['Rope toy or tug toy'],
    emotionalGoals: ['Playfulness', 'Competition'],
    instructions: [
      'Use a designated tug toy',
      'Teach "take it" and "drop it" commands',
      'Let dog win sometimes',
      'Stop if dog gets overexcited'
    ],
    benefits: 'Satisfies prey drive and builds jaw strength',
    tags: ['tug', 'play', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },

  // Additional Mental Activities
  {
    id: 'mental-shape-sorting',
    title: 'Shape Sorting Game',
    pillar: 'mental',
    difficulty: 'Hard',
    duration: 25,
    materials: ['Different shaped objects', 'Containers', 'Treats'],
    emotionalGoals: ['Problem-solving', 'Focus'],
    instructions: [
      'Start with simple shape differentiation',
      'Reward correct choices',
      'Gradually increase complexity',
      'Keep sessions short and positive'
    ],
    benefits: 'Advanced cognitive training and problem-solving skills',
    tags: ['cognitive', 'advanced', 'indoor'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  },
  {
    id: 'mental-name-learning',
    title: 'Toy Name Learning',
    pillar: 'mental',
    difficulty: 'Medium',
    duration: 20,
    materials: ['3-5 different toys', 'Treats'],
    emotionalGoals: ['Achievement', 'Focus'],
    instructions: [
      'Start with one toy name',
      'Repeat name frequently during play',
      'Ask dog to "get [toy name]"',
      'Reward correct identification'
    ],
    benefits: 'Builds vocabulary and listening skills',
    tags: ['vocabulary', 'learning', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'mental-memory-game',
    title: 'Memory Challenge',
    pillar: 'mental',
    difficulty: 'Hard',
    duration: 15,
    materials: ['3 cups', 'Treat', 'Table or floor space'],
    emotionalGoals: ['Concentration', 'Achievement'],
    instructions: [
      'Place treat under one cup while dog watches',
      'Mix up cups slowly',
      'Let dog choose',
      'Gradually increase mixing speed'
    ],
    benefits: 'Develops memory and observation skills',
    tags: ['memory', 'observation', 'indoor'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  },

  // Additional Physical Activities
  {
    id: 'physical-stairs-workout',
    title: 'Stair Climbing Exercise',
    pillar: 'physical',
    difficulty: 'Medium',
    duration: 15,
    materials: ['Safe staircase', 'Leash if needed'],
    emotionalGoals: ['Endurance', 'Strength'],
    instructions: [
      'Start with a few steps',
      'Go up and down slowly',
      'Watch for signs of fatigue',
      'Build repetitions gradually'
    ],
    benefits: 'Builds leg strength and cardiovascular fitness',
    tags: ['stairs', 'strength', 'indoor'],
    ageGroup: 'Adult',
    energyLevel: 'Medium'
  },
  {
    id: 'physical-balance-work',
    title: 'Balance Training',
    pillar: 'physical',
    difficulty: 'Medium',
    duration: 20,
    materials: ['Balance disc or wobbly surface', 'Treats'],
    emotionalGoals: ['Confidence', 'Focus'],
    instructions: [
      'Introduce wobbly surface gradually',
      'Support dog initially',
      'Reward brave attempts',
      'Build up duration slowly'
    ],
    benefits: 'Improves core strength and proprioception',
    tags: ['balance', 'core', 'rehabilitation'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  },

  // Additional Social Activities
  {
    id: 'social-therapy-visit',
    title: 'Therapy Dog Practice',
    pillar: 'social',
    difficulty: 'Hard',
    duration: 45,
    materials: ['Therapy dog vest', 'Grooming supplies'],
    emotionalGoals: ['Calm confidence', 'Service'],
    instructions: [
      'Ensure dog is well-trained and calm',
      'Practice gentle interactions',
      'Visit nursing homes or hospitals',
      'Follow facility guidelines'
    ],
    benefits: 'Provides service to community while socializing dog',
    tags: ['therapy', 'service', 'advanced'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  },
  {
    id: 'social-dog-cafe',
    title: 'Dog-Friendly Cafe Visit',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 60,
    materials: ['Leash', 'Water bowl', 'Mat for dog'],
    emotionalGoals: ['Calm confidence', 'Socialization'],
    instructions: [
      'Choose dog-friendly establishments',
      'Bring a mat for dog to lie on',
      'Practice "stay" and "quiet" commands',
      'Allow positive interactions with patrons'
    ],
    benefits: 'Real-world manners practice in busy environments',
    tags: ['cafe', 'manners', 'socialization'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  },

  // Additional Environmental Activities
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
  },

  // Additional Instinctual Activities
  {
    id: 'instinctual-prey-simulation',
    title: 'Flirt Pole Play',
    pillar: 'instinctual',
    difficulty: 'Medium',
    duration: 20,
    materials: ['Flirt pole', 'Open space'],
    emotionalGoals: ['Excitement', 'Chase satisfaction'],
    instructions: [
      'Move toy to trigger chase instinct',
      'Let dog "catch" toy periodically',
      'Use as reward for good behavior',
      'End while dog is still interested'
    ],
    benefits: 'Satisfies prey drive in controlled manner',
    tags: ['prey drive', 'chase', 'exercise'],
    ageGroup: 'All Ages',
    energyLevel: 'High'
  },
  {
    id: 'instinctual-den-building',
    title: 'Cozy Den Creation',
    pillar: 'instinctual',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Blankets', 'Pillows', 'Quiet space'],
    emotionalGoals: ['Security', 'Comfort'],
    instructions: [
      'Create a cozy enclosed space',
      'Use familiar blankets',
      'Place in quiet area of home',
      'Let dog arrange bedding to their liking'
    ],
    benefits: 'Satisfies denning instincts and provides security',
    tags: ['den', 'comfort', 'security'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  }
];

// Helper function to get random activities
export function getRandomActivities(count: number = 5): ActivityLibraryItem[] {
  const shuffled = [...activityLibrary].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get activities by pillar
export function getActivitiesByPillar(pillar: string): ActivityLibraryItem[] {
  return activityLibrary.filter(activity => activity.pillar === pillar);
}

// Helper function to get activities by difficulty
export function getActivitiesByDifficulty(difficulty: string): ActivityLibraryItem[] {
  return activityLibrary.filter(activity => activity.difficulty === difficulty);
}

// Helper function to get activities by duration
export function getActivitiesByDuration(maxDuration: number): ActivityLibraryItem[] {
  return activityLibrary.filter(activity => activity.duration <= maxDuration);
}

// Helper function to get discovered activities (placeholder for now)
export function getDiscoveredActivities(dogId?: string): any[] {
  if (!dogId) return [];
  const saved = localStorage.getItem(`discoveredActivities-${dogId}`);
  return saved ? JSON.parse(saved) : [];
}

// NEW EXPORTS - Adding the missing functions that are being imported

// Get activity by ID from library
export function getActivityById(id: string): ActivityLibraryItem | undefined {
  return activityLibrary.find(activity => activity.id === id);
}

// Get activities by pillar (alias for getActivitiesByPillar)
export function getPillarActivities(pillar?: string | null): ActivityLibraryItem[] {
  if (!pillar || pillar === 'all') {
    return activityLibrary;
  }
  return getActivitiesByPillar(pillar);
}

// Search combined activities (library + discovered)
export function searchCombinedActivities(query: string, discoveredActivities: DiscoveredActivity[]): (ActivityLibraryItem | DiscoveredActivity)[] {
  const combinedActivities = getCombinedActivities(discoveredActivities);
  const lowercaseQuery = query.toLowerCase();
  
  return combinedActivities.filter(activity => 
    activity.title.toLowerCase().includes(lowercaseQuery) ||
    activity.pillar.toLowerCase().includes(lowercaseQuery) ||
    activity.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    activity.benefits?.toLowerCase().includes(lowercaseQuery)
  );
}

// Get combined activities (library + discovered)
export function getCombinedActivities(discoveredActivities: DiscoveredActivity[]): (ActivityLibraryItem | DiscoveredActivity)[] {
  const approvedDiscovered = discoveredActivities.filter(activity => activity.approved);
  return [...activityLibrary, ...approvedDiscovered];
}

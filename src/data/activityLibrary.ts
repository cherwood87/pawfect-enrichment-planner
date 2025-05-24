
import { ActivityLibraryItem } from '@/types/activity';

export const activityLibrary: ActivityLibraryItem[] = [
  // Mental Activities
  {
    id: 'mental-puzzle-feeder',
    title: 'Puzzle Feeder Challenge',
    pillar: 'mental',
    difficulty: 'Easy',
    duration: 15,
    materials: ['Puzzle feeder toy', 'Dog kibble or treats'],
    emotionalGoals: ['Builds confidence', 'Reduces boredom', 'Promotes patience'],
    instructions: [
      'Fill puzzle feeder with your dog\'s favorite treats',
      'Show your dog the toy and let them sniff it',
      'Place on the ground and encourage exploration',
      'Let your dog work at their own pace',
      'Praise when they successfully get treats out'
    ],
    benefits: 'Stimulates problem-solving skills and provides mental enrichment while slowing down eating.',
    tags: ['problem-solving', 'feeding', 'independent'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'mental-hide-seek-treats',
    title: 'Hide & Seek Treats',
    pillar: 'mental',
    difficulty: 'Easy',
    duration: 10,
    materials: ['High-value treats', 'Various hiding spots'],
    emotionalGoals: ['Builds hunting confidence', 'Provides mental stimulation'],
    instructions: [
      'Start with easy hiding spots your dog can see',
      'Hide treats around the room while dog watches',
      'Say "find it" and encourage searching',
      'Gradually make hiding spots more challenging',
      'Celebrate each successful find'
    ],
    benefits: 'Engages natural foraging instincts and improves focus and concentration.',
    tags: ['foraging', 'scent-work', 'hunting'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'mental-training-session',
    title: 'New Command Training',
    pillar: 'mental',
    difficulty: 'Medium',
    duration: 20,
    materials: ['High-value treats', 'Clicker (optional)', 'Training space'],
    emotionalGoals: ['Builds confidence', 'Strengthens bond', 'Provides structure'],
    instructions: [
      'Choose one new command to focus on',
      'Break the behavior into small steps',
      'Use positive reinforcement and treats',
      'Keep sessions short and positive',
      'End on a successful note'
    ],
    benefits: 'Strengthens the human-dog bond while providing cognitive challenge and structure.',
    tags: ['training', 'bonding', 'obedience'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },

  // Physical Activities
  {
    id: 'physical-morning-walk',
    title: 'Energizing Morning Walk',
    pillar: 'physical',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Leash', 'Collar/harness', 'Waste bags', 'Water'],
    emotionalGoals: ['Releases energy', 'Reduces anxiety', 'Provides routine'],
    instructions: [
      'Attach leash and check equipment',
      'Start with a moderate pace',
      'Allow brief sniffing breaks',
      'Maintain consistent walking rhythm',
      'Cool down with slower pace at end'
    ],
    benefits: 'Provides essential physical exercise and mental stimulation through environmental exploration.',
    tags: ['cardio', 'routine', 'exploration'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'physical-fetch-park',
    title: 'High-Energy Fetch Session',
    pillar: 'physical',
    difficulty: 'Easy',
    duration: 25,
    materials: ['Fetch toy (ball, frisbee)', 'Open space', 'Water bowl'],
    emotionalGoals: ['Burns excess energy', 'Builds joy and excitement'],
    instructions: [
      'Warm up with gentle play',
      'Throw toy at moderate distance',
      'Encourage return with enthusiasm',
      'Gradually increase distance',
      'Cool down with calm walking'
    ],
    benefits: 'Excellent cardiovascular exercise that satisfies natural chase instincts.',
    tags: ['cardio', 'chase', 'high-energy'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },
  {
    id: 'physical-agility-course',
    title: 'Backyard Agility Course',
    pillar: 'physical',
    difficulty: 'Hard',
    duration: 20,
    materials: ['Cones or markers', 'Jump obstacles', 'Tunnel or boxes', 'Treats'],
    emotionalGoals: ['Builds confidence', 'Provides accomplishment', 'Enhances focus'],
    instructions: [
      'Set up simple obstacle course',
      'Lead dog through course slowly first',
      'Use treats and encouragement',
      'Gradually increase speed and complexity',
      'Always end with praise and rewards'
    ],
    benefits: 'Combines physical exercise with mental challenge, improving coordination and confidence.',
    tags: ['agility', 'coordination', 'confidence'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },

  // Social Activities
  {
    id: 'social-dog-park',
    title: 'Dog Park Socialization',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 45,
    materials: ['Leash', 'Water bowl', 'Toys (optional)', 'Waste bags'],
    emotionalGoals: ['Improves social skills', 'Reduces isolation', 'Builds confidence'],
    instructions: [
      'Observe park dynamics before entering',
      'Enter during less crowded times initially',
      'Stay near your dog for support',
      'Watch for signs of stress or overstimulation',
      'Leave on a positive note'
    ],
    benefits: 'Essential for developing appropriate social behaviors with other dogs.',
    tags: ['socialization', 'play', 'community'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },
  {
    id: 'social-playdate',
    title: 'Structured Dog Playdate',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 60,
    materials: ['Known friendly dog', 'Toys', 'Treats', 'Water bowls'],
    emotionalGoals: ['Builds friendships', 'Reduces social anxiety', 'Provides joy'],
    instructions: [
      'Choose a neutral location for first meeting',
      'Allow dogs to meet on-leash initially',
      'Supervise all interactions closely',
      'Provide breaks if play gets too intense',
      'End while both dogs are still happy'
    ],
    benefits: 'Controlled socialization helps dogs learn appropriate play behaviors.',
    tags: ['friendship', 'play', 'controlled-social'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },

  // Environmental Activities
  {
    id: 'environmental-new-route',
    title: 'Novel Walking Route',
    pillar: 'environmental',
    difficulty: 'Easy',
    duration: 35,
    materials: ['Leash', 'Harness', 'Treats for encouragement', 'Water'],
    emotionalGoals: ['Builds adaptability', 'Reduces fear of new places', 'Increases curiosity'],
    instructions: [
      'Choose a safe, new neighborhood or trail',
      'Allow extra time for exploration',
      'Let your dog sniff and investigate',
      'Provide encouragement for nervous moments',
      'Take mental notes of your dog\'s preferences'
    ],
    benefits: 'Exposes dogs to new sights, sounds, and smells, promoting adaptability.',
    tags: ['exploration', 'adaptability', 'sensory'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'environmental-beach-visit',
    title: 'Beach or Water Exploration',
    pillar: 'environmental',
    difficulty: 'Medium',
    duration: 60,
    materials: ['Towels', 'Fresh water', 'Leash', 'Shade/umbrella'],
    emotionalGoals: ['Builds confidence with water', 'Provides sensory enrichment'],
    instructions: [
      'Start away from water if dog is nervous',
      'Allow gradual approach to water\'s edge',
      'Let dog explore at their own pace',
      'Bring fresh water for drinking',
      'Watch for signs of fatigue or overheating'
    ],
    benefits: 'Unique sensory experience with new textures, sounds, and smells.',
    tags: ['water', 'sensory', 'adventure'],
    ageGroup: 'Adult',
    energyLevel: 'Medium'
  },

  // Instinctual Activities
  {
    id: 'instinctual-digging-box',
    title: 'Sandbox Digging Fun',
    pillar: 'instinctual',
    difficulty: 'Easy',
    duration: 15,
    materials: ['Large container or designated area', 'Sand or dirt', 'Buried toys/treats'],
    emotionalGoals: ['Satisfies natural instincts', 'Reduces destructive digging'],
    instructions: [
      'Create or designate a digging area',
      'Bury treats or toys in the sand',
      'Encourage your dog to "find it"',
      'Praise enthusiastic digging',
      'Refresh with new buried treasures regularly'
    ],
    benefits: 'Provides outlet for natural digging instincts in an appropriate location.',
    tags: ['digging', 'natural-behavior', 'enrichment'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'instinctual-scent-trail',
    title: 'Backyard Scent Trail',
    pillar: 'instinctual',
    difficulty: 'Medium',
    duration: 20,
    materials: ['High-value treats', 'Spray bottle with scented water (optional)'],
    emotionalGoals: ['Engages hunting instincts', 'Builds confidence', 'Provides focus'],
    instructions: [
      'Create a trail of treat crumbs or scent',
      'Start with short, obvious trails',
      'Say "find it" and encourage following',
      'Gradually make trails longer and more complex',
      'End with a jackpot of treats'
    ],
    benefits: 'Utilizes dogs\' incredible scenting abilities for mental and physical exercise.',
    tags: ['scent-work', 'tracking', 'hunting'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  },
  {
    id: 'instinctual-tug-of-war',
    title: 'Structured Tug of War',
    pillar: 'instinctual',
    difficulty: 'Easy',
    duration: 10,
    materials: ['Rope toy or tug toy', 'Space to play safely'],
    emotionalGoals: ['Satisfies prey drive', 'Builds confidence', 'Provides bonding'],
    instructions: [
      'Use a designated tug toy only',
      'Start the game with a cue like "tug"',
      'Let your dog win sometimes',
      'End the game with a "drop it" command',
      'Always end on a positive note'
    ],
    benefits: 'Safe outlet for natural pulling and prey drive instincts while building impulse control.',
    tags: ['prey-drive', 'bonding', 'impulse-control'],
    ageGroup: 'All Ages',
    energyLevel: 'Medium'
  }
];

export const getPillarActivities = (pillar: string) => {
  return activityLibrary.filter(activity => activity.pillar === pillar);
};

export const getActivityById = (id: string) => {
  return activityLibrary.find(activity => activity.id === id);
};

export const getActivitiesByDifficulty = (difficulty: string) => {
  return activityLibrary.filter(activity => activity.difficulty === difficulty);
};

export const searchActivities = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return activityLibrary.filter(activity => 
    activity.title.toLowerCase().includes(lowercaseQuery) ||
    activity.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    activity.benefits.toLowerCase().includes(lowercaseQuery)
  );
};

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
  id: 'instinctual-victory-parade',
  title: 'Victory Parade',
  pillar: 'instinctual',
  difficulty: 'Easy',
  duration: 10,
  materials: ['Safe, holdable item (ball, toy, soft cloth)', 'Calm walking path'],
  emotionalGoals: ['Supports self-expression', 'Promotes emotional fulfillment'],
  instructions: [
    'Offer the toy and let your dog carry it on the walk.',
    'Don’t ask for drops or trade — just admire.',
    'Reflect with soft glances or slow pacing.',
    'End when your dog drops the item or loses interest.',
    'Close with a quiet sit or soft praise.',
  ],
  benefits: 'Encourages natural carrying behavior and emotional self-expression in a relaxed setting.',
  tags: ['self-expression', 'emotional', 'instinctual'],
  ageGroup: 'All Ages',
  energyLevel: 'Low to Moderate',
},
  {
  id: 'instinctual-find-it-wild-hunts',
  title: 'Find It: Wild Hunts',
  pillar: 'instinctual',
  difficulty: 'Easy',
  duration: 10,
  materials: ['Small treats or dry food', 'Patch of grass, leaves, or brush'],
  emotionalGoals: ['Encourages independent problem-solving', 'Builds confidence in outdoor spaces'],
  instructions: [
    'Without fanfare, scatter the food loosely.',
    'Step back and say, “Find it.”',
    'Let your dog forage, sniff, and problem-solve.',
    'End with a pause or praise once interest fades.',
  ],
  benefits: 'Stimulates natural foraging instincts and builds outdoor confidence.',
  tags: ['foraging', 'independence', 'sniffing'],
  ageGroup: 'All Ages',
  energyLevel: 'Moderate',
},
{
  id: 'instinctual-scent-hide-and-seek',
  title: 'Scent-Based Hide and Seek',
  pillar: 'instinctual',
  difficulty: 'Medium',
  duration: 10,
  materials: ['A treat or toy with scent', 'Optional: boxes, blankets, or furniture'],
  emotionalGoals: ['Creates a focused challenge', 'Builds confidence without pressure'],
  instructions: [
    'Hide the item while your dog waits or watches.',
    'Say, “Find it!” and let them explore.',
    'Avoid pointing or guiding.',
    'Praise any effort — especially sniffing and pausing.',
    'End with a soft touch or reset cue.',
  ],
  benefits: 'Builds scent tracking and confidence through independent discovery.',
  tags: ['scent', 'focus', 'confidence'],
  ageGroup: 'All Ages',
  energyLevel: 'Moderate',
},
{
  id: 'instinctual-sniff-and-find-adventure',
  title: 'Sniff & Find Adventure',
  pillar: 'instinctual',
  difficulty: 'Medium',
  duration: 15,
  materials: ['Treats', 'Optional: scent-marked items', 'Relaxed walking route'],
  emotionalGoals: ['Encourages shared sensory exploration', 'Builds connection through sniffing'],
  instructions: [
    'Pre-place a few treats along your path.',
    'Cue “What’s that?” or “Go sniff” at each pause.',
    'Let your dog investigate without direction.',
    'Observe how they move — is it curious, cautious, excited?',
    'End with a sit-together moment.',
  ],
  benefits: 'Fosters mindful walking and nose-led discovery.',
  tags: ['sniffing', 'shared-experience', 'exploration'],
  ageGroup: 'All Ages',
  energyLevel: 'Low to Moderate',
},
{
  id: 'instinctual-what-s-this-discovery',
  title: 'What’s This? Co-Discovery Game',
  pillar: 'instinctual',
  difficulty: 'Easy',
  duration: 10,
  materials: ['New object, scent patch, or leaf pile', 'Calm body language', 'Your curiosity'],
  emotionalGoals: ['Encourages safe novelty', 'Supports shared attention'],
  instructions: [
    'Crouch near the object and softly say, “What’s this?”',
    'Let your dog approach and sniff without pressure.',
    'Mirror their curiosity — don’t lead, just join.',
    'Celebrate eye contact, sniffing, or gentle engagement.',
    'End with a short pause or reset cue.',
  ],
  benefits: 'Promotes trust through mutual curiosity and exploration.',
  tags: ['discovery', 'trust', 'co-play'],
  ageGroup: 'All Ages',
  energyLevel: 'Low to Moderate',
},
{
  id: 'instinctual-what-did-you-find',
  title: 'What Did You Find?',
  pillar: 'instinctual',
  difficulty: 'Easy',
  duration: 7,
  materials: ['An open heart', 'Quiet observation', 'Gentle curiosity'],
  emotionalGoals: ['Affirms autonomy', 'Deepens relational safety'],
  instructions: [
    'When your dog stops to sniff, pause beside them.',
    'Gently ask, “What did you find?” with soft tone.',
    'Let them continue sniffing or mark the moment with a smile.',
    'Resist cueing or hurrying.',
    'End with mutual stillness or soft praise.',
  ],
  benefits: 'Strengthens connection by honoring your dog’s sensory world.',
  tags: ['sniffing', 'connection', 'presence'],
  ageGroup: 'All Ages',
  energyLevel: 'Low',
},
{
  id: 'instinctual-dig-zone-invitation',
  title: 'Dig Zone Invitation',
  pillar: 'instinctual',
  difficulty: 'Medium',
  duration: 15,
  materials: ['Sandbox, dirt pile, or leaf pile', 'Treats or toys to bury', 'Long line (optional)'],
  emotionalGoals: ['Supports natural digging behavior', 'Provides stress relief'],
  instructions: [
    'Lightly bury a toy or treat while your dog watches.',
    'Crouch nearby and dig a little yourself.',
    'Say “Want to dig?” and let them approach.',
    'Celebrate sniffing, pawing, or full digging.',
    'End with a soft scatter or resting spot.',
  ],
  benefits: 'Offers a safe outlet for natural digging instincts.',
  tags: ['digging', 'stress-relief', 'natural-behavior'],
  ageGroup: 'All Ages',
  energyLevel: 'Moderate',
},
{
  id: 'instinctual-tug-chase-wrestle',
  title: 'Tug, Chase, Wrestle',
  pillar: 'instinctual',
  difficulty: 'Medium',
  duration: 10,
  materials: ['Long line', 'Soft tug or fetch toy', 'Open space'],
  emotionalGoals: ['Honors play style', 'Builds emotional rhythm and safety'],
  instructions: [
    'Let your dog lead the play: tug, chase, or gentle body play.',
    'Add pauses every 20–30 seconds to reset arousal.',
    'Mirror their style: wrestle if they initiate, chase if they run.',
    'Use clear off-switches (pause, crouch, turn).',
    'End with a scatter or chew.',
  ],
  benefits: 'Supports instinctual play styles and healthy arousal cycles.',
  tags: ['play', 'physical', 'instinctual'],
  ageGroup: 'All Ages',
  energyLevel: 'Moderate to High',
},
{
  id: 'instinctual-pause-point-game',
  title: 'The Pause Point Game',
  pillar: 'instinctual',
  difficulty: 'Easy',
  duration: 5,
  materials: ['Treats', 'Walk route with natural stops', 'Calm tone'],
  emotionalGoals: ['Encourages recovery', 'Supports regulation during engagement'],
  instructions: [
    'As your dog pauses to sniff, step slightly behind or beside them.',
    'Say “pause point” softly.',
    'Let them linger. Offer a treat near the ground if they stay.',
    'Repeat at 2–3 stops.',
    'End the walk with a longer rest or recovery moment.',
  ],
  benefits: 'Teaches your dog to find peace and presence through pausing.',
  tags: ['pause', 'regulation', 'calm'],
  ageGroup: 'All Ages',
  energyLevel: 'Low to Moderate',
},
{
  id: 'instinctual-sniff-and-show',
  title: 'The Sniff & Show Game',
  pillar: 'instinctual',
  difficulty: 'Easy',
  duration: 10,
  materials: ['Long line', 'A curious tone', 'Optional: “Show me!” cue'],
  emotionalGoals: ['Builds self-esteem', 'Encourages relational communication'],
  instructions: [
    'Let your dog explore off-leash or on a long line.',
    'When they stop, ask softly, “Show me!”',
    'Walk to them. Crouch, acknowledge, maybe gently sniff with them.',
    'Celebrate without redirecting.',
    'End with a co-pause or soft pet.',
  ],
  benefits: 'Encourages dogs to share discoveries and feel seen.',
  tags: ['communication', 'sniffing', 'confidence'],
  ageGroup: 'All Ages',
  energyLevel: 'Low',
},
{
  id: 'instinctual-two-trail-tracker',
  title: 'The Two-Trail Tracker',
  pillar: 'instinctual',
  difficulty: 'Medium',
  duration: 15,
  materials: ['Scent drag (treats, toy)', 'Path or park with natural trails'],
  emotionalGoals: ['Supports curiosity and decision-making', 'Builds scent confidence'],
  instructions: [
    'Lay a short scent trail with a hidden reward.',
    'Let your dog discover that, or pick a natural trail nearby.',
    'Watch which they choose. Don’t prompt.',
    'Reflect on what they followed and why.',
    'End with praise and recovery — the nose has worked hard.',
  ],
  benefits: 'Fosters choice-making and scent-work confidence in a natural setting.',
  tags: ['scent', 'choice', 'exploration'],
  ageGroup: 'All Ages',
  energyLevel: 'Moderate',
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

export const getCombinedActivities = (
  discoveredActivities: DiscoveredActivity[] = []
): (ActivityLibraryItem | DiscoveredActivity)[] => {
  return [...activityLibrary, ...discoveredActivities];
};

export const getDiscoveredActivities = (dogId?: string): DiscoveredActivity[] => {
  if (!dogId) return [];
  
  const saved = localStorage.getItem(`discoveredActivities-${dogId}`);
  return saved ? JSON.parse(saved) : [];
};

export const saveDiscoveredActivities = (dogId: string, activities: DiscoveredActivity[]) => {
  localStorage.setItem(`discoveredActivities-${dogId}`, JSON.stringify(activities));
};

export const searchCombinedActivities = (
  query: string,
  discoveredActivities: DiscoveredActivity[] = []
): (ActivityLibraryItem | DiscoveredActivity)[] => {
  const combined = getCombinedActivities(discoveredActivities);
  const lowercaseQuery = query.toLowerCase();
  
  return combined.filter(activity => 
    activity.title.toLowerCase().includes(lowercaseQuery) ||
    activity.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    activity.benefits.toLowerCase().includes(lowercaseQuery)
  );
};

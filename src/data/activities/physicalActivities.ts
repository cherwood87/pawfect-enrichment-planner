
import { ActivityLibraryItem } from '@/types/activity';

export const physicalActivities: ActivityLibraryItem[] = [
  {
    id: 'physical-morning-walk',
    title: 'Morning Walk',
    pillar: 'physical',
    difficulty: 'Easy',
    duration: 30,
    materials: ['Leash', 'Waste bags', 'Water'],
    emotionalGoals: ['Energy release', 'Bonding'],
    instructions: [
      'Start with 5-minute warm-up at slow pace to let dog adjust and relieve themselves',
      'Allow 30-60 second sniffing breaks every 5 minutes - this is mental enrichment too',
      'Maintain steady walking pace for 15-20 minutes, adjusting to your dog\'s natural rhythm',
      'Watch for signs of fatigue: excessive panting, lagging behind, or stopping frequently',
      'If dog seems tired, take a 2-3 minute rest in shade with water if available',
      'Cool down with slow 5-minute walk home, allowing final bathroom break',
      'Check paws for cuts, thorns, or hot pavement after walk - especially in summer'
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
      'Begin with 3-4 short throws (10-15 feet) to warm up dog\'s muscles and joints',
      'Use enthusiastic voice: "Get it!" when throwing, "Good fetch!" when returning',
      'Reward with treats and praise when dog brings toy back - even if they don\'t drop it immediately',
      'If dog doesn\'t return toy, try running away or kneeling down to encourage return',
      'Gradually increase distance to 30-50 feet as dog warms up and shows enthusiasm',
      'Take 30-second water breaks every 5-7 throws to prevent overheating',
      'End session while dog is still interested (before they get tired) to maintain positive association'
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
      'Set up 3-4 simple obstacles: tunnel (chairs with blanket), jump (low pillow), weave (books 3 feet apart)',
      'Guide dog through course with treats, moving slowly and encouraging each step',
      'Start with dog on leash for control, removing leash once they understand the pattern',
      'If dog refuses obstacle, lower difficulty (make tunnel wider, jump lower) and try again',
      'Complete one full course successfully, then add complexity or speed',
      'Keep obstacles low (under 12 inches) to prevent injury from jumping or falling',
      'End with enthusiastic praise and extra treats, then safely store all items'
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
      'SAFETY FIRST: Only use calm, clean water areas - avoid strong currents, cold water (under 60°F), or algae blooms',
      'Start in water shallow enough for dog to stand comfortably (chest-deep maximum)',
      'Let dog enter at their own pace - never force or throw them in',
      'Stay within arm\'s reach at all times, even if dog is a strong swimmer',
      'Watch for signs of fatigue: head lower in water, slower paddling, or distress',
      'Swimming sessions should be 10-15 minutes maximum for beginners, building up gradually',
      'Dry thoroughly with towels immediately after swimming, especially ears to prevent infection'
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
      'IMPORTANT: Dogs under 18 months should NOT jog regularly - stick to walks for growing joints',
      'Start with 10-15 minute jog/walk intervals: 2 minutes jogging, 3 minutes walking',
      'Watch for fatigue signs: excessive panting, slowing down, tongue very red, stumbling',
      'Bring water for both of you and offer to dog every 10-15 minutes',
      'Stop immediately if dog shows distress - they can\'t sweat and overheat quickly',
      'Avoid hot pavement (over 77°F) - test with back of your hand for 5 seconds',
      'Cool down with 10-minute slow walk, allowing dog to gradually return to normal breathing'
    ],
    benefits: 'High-intensity cardio exercise for both dog and owner',
    tags: ['running', 'cardio', 'outdoor'],
    ageGroup: 'Adult',
    energyLevel: 'High'
  },
  {
    id: 'physical-stairs-workout',
    title: 'Stair Climbing Exercise',
    pillar: 'physical',
    difficulty: 'Medium',
    duration: 15,
    materials: ['Safe staircase', 'Leash if needed'],
    emotionalGoals: ['Endurance', 'Strength'],
    instructions: [
      'SAFETY: Avoid with dogs under 12 months, senior dogs, or those with joint issues',
      'Start with 3-4 steps up and down, moving slowly to prevent slipping',
      'Keep dog on leash for control and safety - they shouldn\'t rush or jump',
      'Watch for heavy panting, reluctance to continue, or favoring any leg',
      'Take 1-2 minute rest breaks between sets if dog shows any fatigue',
      'Build to maximum 8-10 step repetitions over several weeks',
      'Stop immediately if dog slips, seems unsteady, or shows any discomfort'
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
      'Start with balance disc on carpet for stability, not on hard floors',
      'Let dog sniff and investigate disc first, rewarding calm curiosity',
      'Support dog gently by holding their side/chest as they step onto disc',
      'Reward any attempt to step on disc, even just front paws for first few tries',
      'If dog seems scared, practice with disc turned upside down (stable side) first',
      'Build up to 10-30 seconds of standing on disc before asking for movement',
      'Complete when dog can stand confidently for 30 seconds without support'
    ],
    benefits: 'Improves core strength and proprioception',
    tags: ['balance', 'core', 'rehabilitation'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  }
];


import { ActivityLibraryItem } from '@/types/activity';

export const mentalActivities: ActivityLibraryItem[] = [
  {
    id: 'mental-puzzle-feeder',
    title: 'Puzzle Feeder Challenge',
    pillar: 'mental',
    difficulty: 'Easy',
    duration: 15,
    materials: ['Puzzle feeder', 'Kibble or treats'],
    emotionalGoals: ['Focus', 'Problem-solving'],
    instructions: [
      'Fill puzzle feeder with your dog\'s regular kibble or small treats (2-3 minutes setup)',
      'Place it in their usual feeding area where they feel comfortable',
      'Let your dog figure out how to get the food out - resist the urge to help for first 5 minutes',
      'Supervise closely and encourage with verbal praise, but avoid physical assistance',
      'If dog struggles after 10 minutes, briefly show them one piece coming out, then let them continue',
      'Complete when all food is retrieved or dog loses interest (typically 10-15 minutes)',
      'Clean feeder after use to maintain hygiene and prevent food buildup'
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
      'Start with 3-5 visible hiding spots your dog can see you place treats (1 minute setup)',
      'Hide small, high-value treats around one room - under cushions, behind furniture legs, in corners',
      'Use enthusiastic "find it!" command and point toward general areas if needed',
      'If dog finds treats quickly (under 3 minutes), increase difficulty by hiding in new locations',
      'If dog seems confused, return to easier spots and gradually build confidence',
      'Complete when all treats are found or dog loses interest after searching',
      'Always count treats hidden to ensure all are found for safety'
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
      'Choose 2-3 commands to focus on (sit, stay, come) - avoid overwhelming with too many',
      'Start with 5-minute sessions, building to 15 minutes maximum to maintain attention',
      'Use high-value treats (small pieces) and deliver within 1-2 seconds of correct behavior',
      'Practice each command 5-8 times before moving to the next one',
      'If dog struggles with a command, break it into smaller steps or return to easier version',
      'End session immediately after a successful attempt, even if time isn\'t up',
      'Give dog 10-15 minutes break before any additional training to process learning'
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
      'Choose one trick to master: "shake" (easiest), "roll over" (medium), or "play dead" (advanced)',
      'Break trick into 3-4 small steps - for "shake": lift paw, hold paw, shake motion, release',
      'Reward each small step with treats and praise within 2 seconds of the action',
      'Practice 5-7 repetitions per step, then move to next step only when current step is consistent',
      'If dog gets frustrated or stops responding, take a 5-minute play break and return',
      'Complete when dog can perform full trick on command 3 times in a row',
      'End with extra treats and enthusiastic praise to build positive association'
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
      'Scatter 10-15 small treats or pieces of kibble throughout the snuffle mat fibers (2 minutes setup)',
      'Place mat on floor in quiet area and let your dog sniff and forage naturally at their own pace',
      'Supervise closely to ensure they don\'t bite, chew, or eat the mat material',
      'If dog tries to flip or shake mat, guide them back to gentle sniffing behavior',
      'Activity is complete when most treats are found or dog naturally stops searching (usually 10-15 minutes)',
      'Remove mat when finished and shake out any remaining treats outside',
      'Wash mat weekly or when visibly dirty to prevent bacteria buildup'
    ],
    benefits: 'Provides natural foraging behavior and mental stimulation',
    tags: ['foraging', 'calm', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'mental-shape-sorting',
    title: 'Shape Sorting Game',
    pillar: 'mental',
    difficulty: 'Hard',
    duration: 25,
    materials: ['Different shaped objects', 'Containers', 'Treats'],
    emotionalGoals: ['Problem-solving', 'Focus'],
    instructions: [
      'Begin with 2 clearly different shapes (circle vs square) placed 2 feet apart',
      'Show dog the "correct" shape, then ask them to "find circle" - reward immediately when they touch it',
      'If dog chooses wrong shape, simply say "try again" and guide them to correct one without punishment',
      'Practice with same 2 shapes for 8-10 successful attempts before adding a third shape',
      'If dog seems confused, increase distance between shapes or make them more visually different',
      'Complete when dog can identify correct shape 5 times in a row without guidance',
      'End session after 20 minutes maximum to prevent mental fatigue and frustration'
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
      'Choose one distinctive toy and use its name consistently during 5-minute play sessions',
      'Repeat the toy name 8-10 times during play: "Good job with your BALL! Bring me the BALL!"',
      'After 3-4 play sessions, place toy 3 feet away and ask dog to "get BALL"',
      'If dog brings correct toy, reward immediately with treats and enthusiastic praise',
      'If dog brings wrong item or seems confused, walk with them to correct toy and repeat name',
      'Add second toy only after dog consistently identifies first toy 8 out of 10 times',
      'Complete daily session when dog successfully identifies the toy 3 times in a row'
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
      'Place treat under middle cup while ensuring dog is watching intently (make eye contact)',
      'Slowly slide cups around for 3-5 seconds, keeping movements visible and deliberate',
      'Stop and encourage dog to "find it" - let them sniff and indicate their choice',
      'If correct, immediately reward with the hidden treat plus an extra treat for success',
      'If incorrect, show them the correct cup, let them have the treat, and start over',
      'Gradually increase mixing time to 8-10 seconds as dog improves',
      'Complete when dog succeeds 4 out of 5 attempts, or after 15 minutes to prevent frustration'
    ],
    benefits: 'Develops memory and observation skills',
    tags: ['memory', 'observation', 'indoor'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  }
];

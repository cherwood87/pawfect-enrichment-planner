
import { ActivityLibraryItem } from '@/types/activity';

export const socialActivities: ActivityLibraryItem[] = [
  {
    id: 'social-dog-park',
    title: 'Dog Park Visit',
    pillar: 'social',
    difficulty: 'Medium',
    duration: 45,
    materials: ['Leash', 'Water', 'Waste bags'],
    emotionalGoals: ['Socialization', 'Excitement'],
    instructions: [
      'Observe park activity for 2-3 minutes before entering - check for aggressive dogs or overcrowding',
      'Keep initial visit short (15-20 minutes) to prevent overstimulation',
      'Watch your dog\'s body language: tail position, ear posture, play bow vs. stiff posture',
      'Signs of good play: bouncy movements, play bows, brief pauses, relaxed mouth',
      'Signs to intervene: constant mounting, pinning down, yelping, stiff body language',
      'If your dog seems overwhelmed, take a break outside the fence for 5 minutes',
      'Leave on a positive note - before your dog gets tired or overstimulated'
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
      'Research facilities that use positive reinforcement methods - avoid "dominance" or punishment-based training',
      'Bring small, high-value treats (pea-sized) that your dog doesn\'t get at home',
      'Arrive 10 minutes early to let your dog adjust to the environment before class starts',
      'Stay positive and patient - puppies have short attention spans and may need multiple attempts',
      'If your dog seems overwhelmed, ask instructor for a brief break or easier exercise',
      'Practice lessons at home for 5-10 minutes daily between classes for better retention',
      'Focus on progress, not perfection - celebrate small wins and keep sessions positive'
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
      'Choose moderately busy areas: residential streets with foot traffic, not crowded downtown areas',
      'Allow greetings with friendly people who ask permission first - teach dog to sit for greetings',
      'Practice loose leash walking by stopping when dog pulls, only moving when leash is loose',
      'Reward calm behavior around distractions (cars, bicycles, other dogs) with treats within 2 seconds',
      'If dog becomes overstimulated, find a quiet spot to sit and let them observe until calm',
      'Keep treats handy and reward frequently for attention and good behavior',
      'End when dog shows improvement with distractions - progress takes time and patience'
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
      'Choose dogs of similar size and energy level - avoid pairing calm dog with highly energetic one',
      'Meet in neutral territory (park, street) first for 5-10 minute walk together before going to either home',
      'Supervise all interactions closely - dogs should take breaks from play every 10-15 minutes',
      'Watch for signs of stress: excessive panting, trying to hide, mounting, or resource guarding',
      'Have backup plan ready: if dogs don\'t click, separate calmly and try a different dog another time',
      'Provide separate water bowls and toys to prevent resource guarding conflicts',
      'End playdate while dogs are still having fun, before any signs of overstimulation appear'
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
      'Choose pet stores that explicitly welcome dogs and have wide aisles for easy navigation',
      'Keep initial visit to 10-15 minutes to prevent overwhelming your dog with new sights and smells',
      'Reward calm behavior near automatic doors, shopping carts, and other dogs with treats',
      'Allow positive interactions with staff who offer to greet your dog, but ensure dog sits first',
      'If dog seems nervous or excited, take breaks in quieter sections of store',
      'Practice basic commands (sit, stay) while in store to reinforce training in new environment',
      'End when dog shows calm behavior - success is measured by comfort, not perfection'
    ],
    benefits: 'Exposure to new environments and people',
    tags: ['outing', 'socialization', 'indoor'],
    ageGroup: 'All Ages',
    energyLevel: 'Low'
  },
  {
    id: 'social-therapy-visit',
    title: 'Therapy Dog Practice',
    pillar: 'social',
    difficulty: 'Hard',
    duration: 45,
    materials: ['Therapy dog vest', 'Grooming supplies'],
    emotionalGoals: ['Calm confidence', 'Service'],
    instructions: [
      'REQUIREMENT: Dog must be certified therapy dog or practicing for certification with professional guidance',
      'Ensure dog is well-trained in basic commands and has calm, gentle temperament around strangers',
      'Practice gentle interactions at home: soft touches, not jumping on people, settling quietly',
      'Contact facilities in advance - nursing homes, hospitals, schools often have specific requirements',
      'Follow ALL facility guidelines: vaccination records, health certificates, specific visitation times',
      'Keep visits to 30-45 minutes maximum to prevent dog fatigue and maintain positive interactions',
      'Always have facility supervisor present and be prepared to leave if dog shows any stress signs'
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
      'Call ahead to confirm establishment is dog-friendly and check any size/breed restrictions',
      'Bring a mat or towel for dog to lie on beside your chair, creating a defined "place"',
      'Practice "stay" and "quiet" commands for 10-15 minutes before visiting, using high-value treats',
      'Choose off-peak hours initially (mid-afternoon) to avoid crowds and noise',
      'Allow positive interactions with patrons who approach calmly and ask permission first',
      'If dog becomes restless or anxious, take a brief walk outside and return when calm',
      'End when dog shows calm settling behavior - duration matters less than comfort level'
    ],
    benefits: 'Real-world manners practice in busy environments',
    tags: ['cafe', 'manners', 'socialization'],
    ageGroup: 'Adult',
    energyLevel: 'Low'
  }
];

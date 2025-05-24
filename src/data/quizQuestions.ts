
import { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'mental_puzzles',
    question: 'Does your dog enjoy puzzle toys or problem-solving games?',
    pillar: 'mental',
    options: [
      { value: 'loves', label: 'Absolutely loves them!', weight: 3 },
      { value: 'likes', label: 'Enjoys them sometimes', weight: 2 },
      { value: 'neutral', label: 'Not particularly interested', weight: 1 },
      { value: 'dislikes', label: 'Gets frustrated or ignores them', weight: 0 }
    ]
  },
  {
    id: 'physical_energy',
    question: 'How energetic is your dog throughout the day?',
    pillar: 'physical',
    options: [
      { value: 'very_high', label: 'Extremely active, needs lots of exercise', weight: 3 },
      { value: 'high', label: 'Pretty active, enjoys daily walks/play', weight: 2 },
      { value: 'moderate', label: 'Moderate energy, content with short walks', weight: 1 },
      { value: 'low', label: 'Low energy, prefers relaxing', weight: 0 }
    ]
  },
  {
    id: 'social_interaction',
    question: 'How does your dog react to meeting new dogs or people?',
    pillar: 'social',
    options: [
      { value: 'excited', label: 'Gets very excited and wants to play', weight: 3 },
      { value: 'friendly', label: 'Friendly and approaches calmly', weight: 2 },
      { value: 'cautious', label: 'Cautious but warms up eventually', weight: 1 },
      { value: 'avoids', label: 'Prefers to avoid or hide', weight: 0 }
    ]
  },
  {
    id: 'environmental_exploration',
    question: 'Does your dog get excited about exploring new places?',
    pillar: 'environmental',
    options: [
      { value: 'loves', label: 'Loves new adventures and exploring', weight: 3 },
      { value: 'enjoys', label: 'Enjoys new places but takes time', weight: 2 },
      { value: 'mixed', label: 'Sometimes interested, sometimes not', weight: 1 },
      { value: 'prefers_familiar', label: 'Prefers familiar environments', weight: 0 }
    ]
  },
  {
    id: 'instinctual_behaviors',
    question: 'Does your dog love digging, sniffing, or hunting-type games?',
    pillar: 'instinctual',
    options: [
      { value: 'constantly', label: 'Always sniffing, digging, or hunting', weight: 3 },
      { value: 'often', label: 'Shows these behaviors regularly', weight: 2 },
      { value: 'sometimes', label: 'Occasional interest in these activities', weight: 1 },
      { value: 'rarely', label: 'Rarely shows these behaviors', weight: 0 }
    ]
  },
  {
    id: 'learning_motivation',
    question: 'How motivated is your dog to learn new tricks or commands?',
    pillar: 'mental',
    options: [
      { value: 'eager', label: 'Eager learner, picks up quickly', weight: 3 },
      { value: 'willing', label: 'Willing to learn with treats/praise', weight: 2 },
      { value: 'stubborn', label: 'Can be stubborn but eventually learns', weight: 1 },
      { value: 'difficult', label: 'Finds learning challenging', weight: 0 }
    ]
  },
  {
    id: 'play_preferences',
    question: 'What type of play does your dog prefer most?',
    pillar: 'physical',
    options: [
      { value: 'fetch', label: 'Running games like fetch or chase', weight: 3 },
      { value: 'tug', label: 'Tug-of-war or wrestling', weight: 2 },
      { value: 'gentle', label: 'Gentle play or short bursts', weight: 1 },
      { value: 'minimal', label: 'Prefers minimal physical play', weight: 0 }
    ]
  },
  {
    id: 'routine_flexibility',
    question: 'How does your dog handle changes to their routine?',
    pillar: 'environmental',
    options: [
      { value: 'adaptable', label: 'Very adaptable, goes with the flow', weight: 3 },
      { value: 'adjusts', label: 'Adjusts well after initial hesitation', weight: 2 },
      { value: 'stressed', label: 'Gets a bit stressed but manages', weight: 1 },
      { value: 'difficult', label: 'Really struggles with changes', weight: 0 }
    ]
  }
];


import { Heart, Zap, Brain, Users, TreePine } from 'lucide-react';
import { MoodRating } from '@/types/journal';

export const DAILY_PROMPTS = [
  "What new activity did your dog enjoy most today?",
  "How did your dog respond to social interactions today?",
  "What signs of mental stimulation did you notice?",
  "Describe your dog's energy levels throughout the day.",
  "What environmental changes did your dog encounter?",
  "How did your dog use their natural instincts today?",
  "What made your dog happiest today?"
];

export const MOOD_RATINGS: MoodRating[] = [
  { mood: 'Energetic', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { mood: 'Calm', icon: Heart, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { mood: 'Playful', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100' },
  { mood: 'Curious', icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { mood: 'Relaxed', icon: TreePine, color: 'text-teal-600', bgColor: 'bg-teal-100' }
];

export const COMMON_BEHAVIORS = [
  'Active play', 'Restful sleep', 'Good appetite', 'Social interaction',
  'Training focus', 'Exploration', 'Affectionate', 'Alert/watchful',
  'Vocal communication', 'Problem solving'
];

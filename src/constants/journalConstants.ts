import { Heart, Zap, Brain, Users, TreePine } from "lucide-react";
import { MoodRating } from "@/types/journal";

export const DAILY_PROMPTS = [
  // Morning prompts
  "How did your dog start the day? What was their energy level like this morning?",
  "What new activity did your dog enjoy most today?",
  "How did your dog respond to social interactions today?",
  "What signs of mental stimulation did you notice in your dog?",
  "Describe your dog's energy levels throughout the day.",
  "What environmental changes did your dog encounter today?",
  "How did your dog use their natural instincts today?",
  // Evening prompts
  "What made your dog happiest today?",
  "How well did your dog handle any challenges or new experiences today?",
  "What moments of connection did you share with your dog today?",
  "How did your dog's behavior change throughout the day?",
  "What progress did you notice in your dog's training or learning today?",
  "How did your dog interact with their environment and surroundings?",
  "What unique personality traits did your dog display today?",
];

export const MOOD_RATINGS: MoodRating[] = [
  {
    mood: "Energetic",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  { mood: "Calm", icon: Heart, color: "text-blue-600", bgColor: "bg-blue-100" },
  {
    mood: "Playful",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    mood: "Curious",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    mood: "Relaxed",
    icon: TreePine,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
];

export const COMMON_BEHAVIORS = [
  "Active play",
  "Restful sleep",
  "Good appetite",
  "Social interaction",
  "Training focus",
  "Exploration",
  "Affectionate",
  "Alert/watchful",
  "Vocal communication",
  "Problem solving",
];

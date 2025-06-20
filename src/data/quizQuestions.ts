import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  // MENTAL PILLAR
  {
    id: "mental_puzzles",
    question: "Does your dog enjoy puzzle toys or learning new tricks?",
    pillar: "mental",
    options: [
      { value: "loves", label: "Absolutely loves them!", weight: 3 },
      { value: "likes", label: "Enjoys them sometimes", weight: 2 },
      { value: "neutral", label: "Not particularly interested", weight: 1 },
      {
        value: "dislikes",
        label: "Gets frustrated or ignores them",
        weight: 0,
      },
    ],
  },
  {
    id: "mental_learning_style",
    question: "When learning something new, how does your dog behave?",
    pillar: "mental",
    options: [
      {
        value: "eager",
        label: "Can’t wait to try and figure it out",
        weight: 3,
      },
      { value: "guided", label: "Waits for cues or guidance", weight: 2 },
      {
        value: "needs_encouragement",
        label: "Needs a lot of encouragement",
        weight: 1,
      },
      {
        value: "disinterested",
        label: "Gets overwhelmed or disinterested",
        weight: 0,
      },
    ],
  },
  {
    id: "mental_problem_solving",
    question:
      "What does your dog do if a toy or treat is stuck under something?",
    pillar: "mental",
    options: [
      {
        value: "problem_solves",
        label: "Actively tries to figure it out",
        weight: 3,
      },
      { value: "looks_for_help", label: "Looks to me for help", weight: 2 },
      { value: "gives_up", label: "Gives up quickly", weight: 1 },
      { value: "ignores", label: "Doesn’t care or notice", weight: 0 },
    ],
  },

  // PHYSICAL PILLAR
  {
    id: "physical_energy",
    question: "Which best describes your dog’s movement throughout the day?",
    pillar: "physical",
    options: [
      {
        value: "very_high",
        label: "Constantly on the go, zoomies often",
        weight: 3,
      },
      {
        value: "high",
        label: "Moves around frequently, loves walks",
        weight: 2,
      },
      { value: "moderate", label: "Has active bursts, then naps", weight: 1 },
      { value: "low", label: "Mostly sleeps or lounges", weight: 0 },
    ],
  },
  {
    id: "physical_play",
    question: "What kind of physical activities does your dog enjoy the most?",
    pillar: "physical",
    options: [
      {
        value: "running",
        label: "Games with walking, running or jumping",
        weight: 3,
      },
      {
        value: "roughhouse",
        label: "Tug, wrestling, or roughhousing",
        weight: 2,
      },
      {
        value: "obstacles",
        label: "Climbing or crawling under things",
        weight: 1,
      },
      {
        value: "minimal",
        label: "Prefers minimal or no physical games",
        weight: 0,
      },
    ],
  },

  // SOCIAL PILLAR
  {
    id: "social_interaction",
    question: "How does your dog behave when they see another dog or person?",
    pillar: "social",
    options: [
      {
        value: "excited",
        label: "Runs over excitedly and wants to interact",
        weight: 3,
      },
      { value: "friendly", label: "Calm and friendly approach", weight: 2 },
      { value: "cautious", label: "Hesitant but curious", weight: 1 },
      { value: "avoidant", label: "Avoids or becomes reactive", weight: 0 },
    ],
  },
  {
    id: "social_shared_experience",
    question: "Does your dog seem to enjoy doing things with you?",
    pillar: "social",
    options: [
      { value: "loves", label: "Loves being included and engaged", weight: 3 },
      { value: "chill", label: "Follows me often but stays chill", weight: 2 },
      { value: "sometimes", label: "Sometimes joins in", weight: 1 },
      { value: "independent", label: "Prefers their own space", weight: 0 },
    ],
  },
  {
    id: "social_touch",
    question: "How does your dog respond to physical touch or cuddles?",
    pillar: "social",
    options: [
      {
        value: "loves",
        label: "Loves being petted, touched, or snuggled",
        weight: 3,
      },
      { value: "likes", label: "Enjoys some touch", weight: 2 },
      { value: "tolerates", label: "Tolerates brief contact", weight: 1 },
      { value: "dislikes", label: "Avoids or dislikes handling", weight: 0 },
    ],
  },

  // ENVIRONMENTAL PILLAR
  {
    id: "environmental_exploration",
    question: "Does your dog get excited about exploring new places?",
    pillar: "environmental",
    options: [
      {
        value: "loves",
        label: "Loves new adventures and exploring",
        weight: 3,
      },
      { value: "enjoys", label: "Enjoys new places but takes time", weight: 2 },
      {
        value: "mixed",
        label: "Sometimes interested, sometimes not",
        weight: 1,
      },
      {
        value: "prefers_familiar",
        label: "Prefers familiar environments",
        weight: 0,
      },
    ],
  },
  {
    id: "environmental_change",
    question: "How does your dog handle changes to their routine?",
    pillar: "environmental",
    options: [
      {
        value: "adaptable",
        label: "Very adaptable, goes with the flow",
        weight: 3,
      },
      {
        value: "adjusts",
        label: "Adjusts well after initial hesitation",
        weight: 2,
      },
      {
        value: "stressed",
        label: "Gets a bit stressed but manages",
        weight: 1,
      },
      { value: "rigid", label: "Really struggles with changes", weight: 0 },
    ],
  },
  {
    id: "environmental_sensory",
    question:
      "How interested is your dog in smells, textures, or objects in the environment?",
    pillar: "environmental",
    options: [
      {
        value: "obsessed",
        label: "Sniffs and investigates everything",
        weight: 3,
      },
      { value: "curious", label: "Explores some things", weight: 2 },
      { value: "occasional", label: "Only occasionally curious", weight: 1 },
      {
        value: "uninterested",
        label: "Avoids or ignores most sensory things",
        weight: 0,
      },
    ],
  },

  // INSTINCTUAL PILLAR
  {
    id: "instinctual_drive",
    question: "Does your dog enjoy sniffing, digging, chewing, or shredding?",
    pillar: "instinctual",
    options: [
      { value: "constantly", label: "Always does all of these", weight: 3 },
      { value: "often", label: "Shows these behaviors regularly", weight: 2 },
      { value: "sometimes", label: "Occasionally shows interest", weight: 1 },
      { value: "rarely", label: "Rarely shows these behaviors", weight: 0 },
    ],
  },
  {
    id: "instinctual_toys",
    question: "What kind of toys does your dog like most?",
    pillar: "instinctual",
    options: [
      { value: "chew_shred", label: "Chew toys or ones to shred", weight: 3 },
      {
        value: "puzzle_food",
        label: "Food puzzles or treat-dispensing toys",
        weight: 2,
      },
      { value: "softies", label: "Cuddly toys or soft stuffies", weight: 1 },
      { value: "no_interest", label: "Doesn’t really like toys", weight: 0 },
    ],
  },
  {
    id: "instinctual_behaviors",
    question:
      "Have you ever seen your dog stalk, pounce, or dig instinctively?",
    pillar: "instinctual",
    options: [
      {
        value: "frequently",
        label: "All the time, it’s their favorite",
        weight: 3,
      },
      { value: "sometimes", label: "Occasionally when outside", weight: 2 },
      { value: "rarely", label: "Rarely, maybe once in a while", weight: 1 },
      { value: "never", label: "Never", weight: 0 },
    ],
  },
];

export interface DiscoveredActivity {
  id: string;
  title: string;
  pillar: "mental" | "physical" | "social" | "environmental" | "instinctual";
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  materials: string[];
  emotionalGoals: string[];
  instructions: string[];
  benefits: string;
  tags: string[];
  ageGroup: "Puppy" | "Adult" | "Senior" | "All Ages";
  energyLevel: "Low" | "Medium" | "High";
  source: "discovered";
  sourceUrl: string;
  discoveredAt: string;
  verified: boolean;
  qualityScore: number;
  approved?: boolean;
  rejected?: boolean;
}

export interface ContentDiscoveryConfig {
  enabled: boolean;
  frequency: "weekly" | "monthly";
  maxActivitiesPerDiscovery: number;
  targetSources: string[];
  breedSpecific: boolean;
  qualityThreshold: number;
  lastDiscoveryRun?: string;
}

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  author?: string;
  publishDate?: string;
  credibilityScore: number;
}

export interface ParsedActivity {
  title: string;
  description: string;
  pillar: string;
  difficulty: string;
  duration: number;
  materials: string[];
  instructions: string[];
  benefits: string;
  emotionalGoals: string[];
  tags: string[];
  ageGroup: string;
  energyLevel: string;
  confidence: number;
}

export interface UserInteraction {
  id: string;
  userId: string;
  dogId: string;
  interactionType:
    | "activity_view"
    | "activity_schedule"
    | "activity_complete"
    | "activity_skip"
    | "search"
    | "filter"
    | "discovery_trigger"
    | "feedback_submit";
  activityId?: string;
  activityType?: "library" | "user" | "discovered";
  pillar?: "mental" | "physical" | "social" | "environmental" | "instinctual";
  contextData?: Record<string, any>;
  sessionId?: string;
  createdAt: string;
}

export interface ActivityFeedback {
  id: string;
  userId: string;
  dogId: string;
  activityId: string;
  activityType: "library" | "user" | "discovered";
  rating?: number; // 1-5
  difficultyRating?: number; // 1-5
  engagementRating?: number; // 1-5
  enjoymentRating?: number; // 1-5
  feedbackText?: string;
  wouldRecommend?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  dogId: string;
  preferenceType:
    | "pillar_weights"
    | "difficulty_preference"
    | "duration_preference"
    | "material_preferences"
    | "time_preferences"
    | "weather_preferences";
  preferenceData: Record<string, any>;
  confidenceScore: number; // 0-1
  lastUpdated: string;
}

export interface RecommendationLog {
  id: string;
  userId: string;
  dogId: string;
  recommendationType:
    | "daily"
    | "weekly"
    | "weather_based"
    | "mood_based"
    | "discovery";
  recommendedActivities: string[];
  algorithmVersion: string;
  contextData?: Record<string, any>;
  userAction?: "accepted" | "rejected" | "ignored" | "modified";
  createdAt: string;
}

export interface LearningMetric {
  id: string;
  userId: string;
  dogId: string;
  metricType:
    | "pillar_preference"
    | "difficulty_adaptation"
    | "engagement_score"
    | "completion_rate"
    | "discovery_success";
  metricValue: number;
  confidenceLevel: number; // 0-1
  calculationData?: Record<string, any>;
  calculatedAt: string;
}

export interface SmartRecommendation {
  activityId: string;
  recommendationScore: number;
  reason: string;
}

export interface PillarPreference {
  pillar: string;
  preferenceScore: number;
  confidence: number;
}

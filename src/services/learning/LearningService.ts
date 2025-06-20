import { InteractionTrackingService } from "./InteractionTrackingService";
import { FeedbackService } from "./FeedbackService";
import { PreferencesService } from "./PreferencesService";
import { MetricsService } from "./MetricsService";
import {
  UserInteraction,
  ActivityFeedback,
  UserPreference,
  LearningMetric,
  PillarPreference,
} from "@/types/learning";

/**
 * Main learning service that orchestrates all learning-related functionality
 * Acts as a facade for the specialized services
 */
export class LearningService {
  // Interaction tracking methods
  static async trackInteraction(
    interaction: Omit<UserInteraction, "id" | "createdAt">,
  ): Promise<void> {
    return InteractionTrackingService.trackInteraction(interaction);
  }

  // Feedback methods
  static async submitFeedback(
    feedback: Omit<ActivityFeedback, "id" | "createdAt" | "updatedAt">,
  ): Promise<ActivityFeedback> {
    return FeedbackService.submitFeedback(feedback);
  }

  static async getFeedback(
    userId: string,
    dogId: string,
    activityId?: string,
  ): Promise<ActivityFeedback[]> {
    return FeedbackService.getFeedback(userId, dogId, activityId);
  }

  // Preferences methods
  static async updatePreference(
    preference: Omit<UserPreference, "id" | "lastUpdated">,
  ): Promise<void> {
    return PreferencesService.updatePreference(preference);
  }

  static async getPreferences(
    userId: string,
    dogId: string,
    preferenceType?: string,
  ): Promise<UserPreference[]> {
    return PreferencesService.getPreferences(userId, dogId, preferenceType);
  }

  static async calculatePillarPreferences(
    userId: string,
    dogId: string,
  ): Promise<PillarPreference[]> {
    return PreferencesService.calculatePillarPreferences(userId, dogId);
  }

  // Metrics methods
  static async storeLearningMetric(
    metric: Omit<LearningMetric, "id" | "calculatedAt">,
  ): Promise<void> {
    return MetricsService.storeLearningMetric(metric);
  }

  static async getLearningMetrics(
    userId: string,
    dogId: string,
    metricType?: string,
  ): Promise<LearningMetric[]> {
    return MetricsService.getLearningMetrics(userId, dogId, metricType);
  }
}

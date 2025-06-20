import { supabase } from "@/integrations/supabase/client";
import { LearningMetric } from "@/types/learning";

export class MetricsService {
  // Store learning metrics
  static async storeLearningMetric(
    metric: Omit<LearningMetric, "id" | "calculatedAt">,
  ): Promise<void> {
    const { error } = await supabase.from("learning_metrics").insert({
      user_id: metric.userId,
      dog_id: metric.dogId,
      metric_type: metric.metricType,
      metric_value: metric.metricValue,
      confidence_level: metric.confidenceLevel,
      calculation_data: metric.calculationData || {},
    });

    if (error) throw error;
  }

  // Get learning metrics
  static async getLearningMetrics(
    userId: string,
    dogId: string,
    metricType?: string,
  ): Promise<LearningMetric[]> {
    let query = supabase
      .from("learning_metrics")
      .select("*")
      .eq("user_id", userId)
      .eq("dog_id", dogId);

    if (metricType) {
      query = query.eq("metric_type", metricType);
    }

    const { data, error } = await query.order("calculated_at", {
      ascending: false,
    });

    if (error) throw error;

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      dogId: item.dog_id,
      metricType: item.metric_type as
        | "pillar_preference"
        | "difficulty_adaptation"
        | "engagement_score"
        | "completion_rate"
        | "discovery_success",
      metricValue: item.metric_value,
      confidenceLevel: item.confidence_level,
      calculationData: (item.calculation_data || {}) as Record<string, any>,
      calculatedAt: item.calculated_at,
    }));
  }
}

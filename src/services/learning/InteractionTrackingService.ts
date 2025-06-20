import { supabase } from "@/integrations/supabase/client";
import { UserInteraction } from "@/types/learning";

export class InteractionTrackingService {
  // Track user interactions
  static async trackInteraction(
    interaction: Omit<UserInteraction, "id" | "createdAt">,
  ): Promise<void> {
    try {
      const { error } = await supabase.from("user_interactions").insert({
        user_id: interaction.userId,
        dog_id: interaction.dogId,
        interaction_type: interaction.interactionType,
        activity_id: interaction.activityId,
        activity_type: interaction.activityType,
        pillar: interaction.pillar,
        context_data: interaction.contextData || {},
        session_id: interaction.sessionId,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Failed to track interaction:", error);
      // Don't throw - tracking failures shouldn't break user experience
    }
  }
}

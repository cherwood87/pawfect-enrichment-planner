
import { supabase } from '@/integrations/supabase/client';
import { ActivityFeedback } from '@/types/learning';

export class FeedbackService {
  // Submit activity feedback
  static async submitFeedback(feedback: Omit<ActivityFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActivityFeedback> {
    const { data, error } = await supabase
      .from('activity_feedback')
      .insert({
        user_id: feedback.userId,
        dog_id: feedback.dogId,
        activity_id: feedback.activityId,
        activity_type: feedback.activityType,
        rating: feedback.rating,
        difficulty_rating: feedback.difficultyRating,
        engagement_rating: feedback.engagementRating,
        enjoyment_rating: feedback.enjoymentRating,
        feedback_text: feedback.feedbackText,
        would_recommend: feedback.wouldRecommend,
        tags: feedback.tags || []
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      dogId: data.dog_id,
      activityId: data.activity_id,
      activityType: data.activity_type as 'library' | 'user' | 'discovered',
      rating: data.rating,
      difficultyRating: data.difficulty_rating,
      engagementRating: data.engagement_rating,
      enjoymentRating: data.enjoyment_rating,
      feedbackText: data.feedback_text,
      wouldRecommend: data.would_recommend,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // Get user feedback for an activity
  static async getFeedback(userId: string, dogId: string, activityId?: string): Promise<ActivityFeedback[]> {
    let query = supabase
      .from('activity_feedback')
      .select('*')
      .eq('user_id', userId)
      .eq('dog_id', dogId);

    if (activityId) {
      query = query.eq('activity_id', activityId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      dogId: item.dog_id,
      activityId: item.activity_id,
      activityType: item.activity_type as 'library' | 'user' | 'discovered',
      rating: item.rating,
      difficultyRating: item.difficulty_rating,
      engagementRating: item.engagement_rating,
      enjoymentRating: item.enjoyment_rating,
      feedbackText: item.feedback_text,
      wouldRecommend: item.would_recommend,
      tags: item.tags || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  }
}

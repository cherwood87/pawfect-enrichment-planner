
import { ScheduledActivity, UserActivity } from '@/types/activity';

export class ActivityDataMapper {
  static mapToScheduledActivity(dbActivity: any): ScheduledActivity {
    return {
      id: dbActivity.id,
      dogId: dbActivity.dog_id,
      activityId: dbActivity.activity_id,
      scheduledDate: dbActivity.scheduled_date,
      completed: dbActivity.completed,
      notes: dbActivity.notes || '',
      completionNotes: dbActivity.completion_notes || '',
      reminderEnabled: dbActivity.reminder_enabled || false,
      weekNumber: dbActivity.week_number,
      dayOfWeek: dbActivity.day_of_week
    };
  }

  static mapToUserActivity(dbActivity: any): UserActivity {
    return {
      id: dbActivity.id,
      dogId: dbActivity.dog_id,
      title: dbActivity.title,
      pillar: dbActivity.pillar,
      difficulty: dbActivity.difficulty,
      duration: dbActivity.duration,
      materials: dbActivity.materials || [],
      emotionalGoals: dbActivity.emotional_goals || [],
      instructions: dbActivity.instructions || [],
      benefits: dbActivity.benefits || '',
      tags: dbActivity.tags || [],
      ageGroup: dbActivity.age_group,
      energyLevel: dbActivity.energy_level,
      isCustom: dbActivity.is_custom,
      createdAt: dbActivity.created_at
    };
  }
}

import type { ScheduledActivity, UserActivity } from "@/types/activity";

export interface DatabaseScheduledActivity {
	id: string;
	dog_id: string;
	activity_id: string;
	scheduled_time: string;
	user_selected_time: string;
	scheduled_date: string;
	completed: boolean;
	notes: string;
	completion_notes: string;
	reminder_enabled: boolean;
	completed_at: string;
	created_at: string;
	updated_at: string;
	week_number: number | null;
	day_of_week: number | null;
}

export interface DatabaseUserActivity {
	id: string;
	dog_id: string;
	title: string;
	pillar: "mental" | "physical" | "social" | "environmental" | "instinctual";
	difficulty: "Easy" | "Medium" | "Hard";
	duration: number;
	materials: string[];
	emotional_goals: string[];
	instructions: string[];
	benefits: string;
	tags: string[];
	age_group: "Puppy" | "Adult" | "Senior" | "All Ages";
	energy_level: "Low" | "Medium" | "High";
	is_custom: boolean;
	created_at: string;
	updated_at: string;
}

export class ActivityMappers {
	static toScheduledActivity(
		dbActivity: DatabaseScheduledActivity,
	): ScheduledActivity {
		return {
			id: dbActivity.id,
			dogId: dbActivity.dog_id,
			activityId: dbActivity.activity_id,
			scheduledTime: dbActivity.scheduled_time,
			userSelectedTime: dbActivity.user_selected_time,
			scheduledDate: dbActivity.scheduled_date,
			completed: dbActivity.completed,
			notes: dbActivity.notes,
			completionNotes: dbActivity.completion_notes,
			reminderEnabled: dbActivity.reminder_enabled,
			completedAt: dbActivity.completed_at,
			weekNumber: dbActivity.week_number,
			dayOfWeek: dbActivity.day_of_week,
		};
	}

	static toUserActivity(dbActivity: DatabaseUserActivity): UserActivity {
		return {
			id: dbActivity.id,
			dogId: dbActivity.dog_id,
			title: dbActivity.title,
			pillar: dbActivity.pillar,
			difficulty: dbActivity.difficulty,
			duration: dbActivity.duration,
			materials: dbActivity.materials,
			emotionalGoals: dbActivity.emotional_goals,
			instructions: dbActivity.instructions,
			benefits: dbActivity.benefits,
			tags: dbActivity.tags,
			ageGroup: dbActivity.age_group,
			energyLevel: dbActivity.energy_level,
			isCustom: dbActivity.is_custom,
			createdAt: dbActivity.created_at,
		};
	}

	static fromScheduledActivity(activity: Omit<ScheduledActivity, "id">) {
		return {
			dog_id: activity.dogId,
			activity_id: activity.activityId,
			scheduled_time: activity.scheduledTime,
			user_selected_time: activity.userSelectedTime || activity.scheduledTime,
			scheduled_date: activity.scheduledDate,
			completed: activity.completed,
			notes: activity.notes || "",
			completion_notes: activity.completionNotes || "",
			reminder_enabled: activity.reminderEnabled || false,
			completed_at: activity.completedAt,
			week_number: activity.weekNumber || null,
			day_of_week: activity.dayOfWeek !== undefined ? activity.dayOfWeek : null,
		};
	}

	static fromUserActivity(activity: Omit<UserActivity, "id" | "createdAt">) {
		return {
			dog_id: activity.dogId,
			title: activity.title,
			pillar: activity.pillar,
			difficulty: activity.difficulty,
			duration: activity.duration,
			materials: activity.materials,
			emotional_goals: activity.emotionalGoals,
			instructions: activity.instructions,
			benefits: activity.benefits,
			tags: activity.tags,
			age_group: activity.ageGroup,
			energy_level: activity.energyLevel,
			is_custom: activity.isCustom,
		};
	}
}

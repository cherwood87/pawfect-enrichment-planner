import type {
	ActivityLibraryItem,
	PillarGoals,
	ScheduledActivity,
	StreakData,
	UserActivity,
	WeeklyProgress,
} from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";
import type { Dog } from "@/types/dog";
import { ActivityDomainService } from "../domain/ActivityDomainService";

export class ActivityService {
	// Core activity operations
	static async getScheduledActivities(
		dogId: string,
	): Promise<ScheduledActivity[]> {
		return ActivityDomainService.getScheduledActivitiesForDog(dogId);
	}

	static async createScheduledActivity(
		activity: Omit<ScheduledActivity, "id">,
	): Promise<ScheduledActivity> {
		return ActivityDomainService.createScheduledActivity(activity);
	}

	static async updateScheduledActivity(
		activityId: string,
		dogId: string,
		updates: Partial<ScheduledActivity>,
	): Promise<ScheduledActivity> {
		return ActivityDomainService.updateScheduledActivity(
			activityId,
			dogId,
			updates,
		);
	}

	static async toggleActivityCompletion(
		activityId: string,
		dogId: string,
		completionNotes?: string,
	): Promise<ScheduledActivity> {
		return ActivityDomainService.toggleActivityCompletion(
			activityId,
			dogId,
			completionNotes,
		);
	}

	static async createUserActivity(
		activity: Omit<UserActivity, "id" | "createdAt" | "dogId">,
		dogId: string,
	): Promise<UserActivity> {
		return ActivityDomainService.createUserActivity(activity, dogId);
	}

	// Analytics operations
	static getTodaysActivities(
		scheduledActivities: ScheduledActivity[],
		currentDog: Dog | null,
	): ScheduledActivity[] {
		return ActivityDomainService.getTodaysActivities(
			scheduledActivities,
			currentDog,
		);
	}

	static getActivityDetails(
		activityId: string,
		userActivities: UserActivity[],
		discoveredActivities: DiscoveredActivity[],
		currentDog: Dog | null,
	): ActivityLibraryItem | UserActivity | DiscoveredActivity | undefined {
		return ActivityDomainService.getActivityDetails(
			activityId,
			userActivities,
			discoveredActivities,
			currentDog,
		);
	}

	static calculateStreakData(
		scheduledActivities: ScheduledActivity[],
		currentDog: Dog | null,
	): StreakData {
		return ActivityDomainService.calculateStreakData(
			scheduledActivities,
			currentDog,
		);
	}

	static calculateWeeklyProgress(
		scheduledActivities: ScheduledActivity[],
		currentDog: Dog,
	): WeeklyProgress[] {
		return ActivityDomainService.calculateWeeklyProgress(
			scheduledActivities,
			currentDog,
		);
	}

	static calculatePillarBalance(
		scheduledActivities: ScheduledActivity[],
		userActivities: UserActivity[],
		discoveredActivities: DiscoveredActivity[],
		currentDog: Dog | null,
	): Record<string, number> {
		return ActivityDomainService.calculatePillarBalance(
			scheduledActivities,
			userActivities,
			discoveredActivities,
			currentDog,
		);
	}

	static getDailyGoals(currentDog: Dog | null): PillarGoals {
		return ActivityDomainService.getDailyGoals(currentDog);
	}
}

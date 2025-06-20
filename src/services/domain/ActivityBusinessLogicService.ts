import type { ScheduledActivity, UserActivity } from "@/types/activity";
import { AppError, handleError } from "@/utils/errorUtils";
import { ActivityRepository } from "../data/ActivityRepository";
import { ActivityValidationService } from "./ActivityValidationService";

export class ActivityBusinessLogicService {
	static async getScheduledActivitiesForDog(
		dogId: string,
	): Promise<ScheduledActivity[]> {
		try {
			if (!dogId?.trim()) {
				throw new AppError("Dog ID is required", "INVALID_DOG_ID");
			}

			return await ActivityRepository.getScheduledActivities(dogId);
		} catch (error) {
			handleError(error as Error, {
				operation: "getScheduledActivitiesForDog",
				dogId,
			});
			throw error;
		}
	}

	static async createScheduledActivity(
		activity: Omit<ScheduledActivity, "id">,
	): Promise<ScheduledActivity> {
		try {
			// Enhanced validation
			ActivityValidationService.validateScheduledActivityData(activity);

			// Check for duplicates
			await ActivityValidationService.checkForDuplicateActivity(activity);

			const newActivity: ScheduledActivity = {
				...activity,
				id: `scheduled-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				notes: activity.notes || "",
				completionNotes: activity.completionNotes || "",
				reminderEnabled: activity.reminderEnabled ?? false,
			};

			return await ActivityRepository.createScheduledActivity(newActivity);
		} catch (error) {
			handleError(error as Error, {
				operation: "createScheduledActivity",
				activity,
			});
			throw error;
		}
	}

	static async toggleActivityCompletion(
		activityId: string,
		dogId: string,
		completionNotes?: string,
	): Promise<ScheduledActivity> {
		try {
			if (!activityId?.trim() || !dogId?.trim()) {
				throw new AppError(
					"Activity ID and Dog ID are required",
					"MISSING_REQUIRED_FIELDS",
				);
			}

			const activities = await ActivityRepository.getScheduledActivities(dogId);
			const activity = activities.find((a) => a.id === activityId);

			if (!activity) {
				throw new AppError("Activity not found", "ACTIVITY_NOT_FOUND", {
					activityId,
					dogId,
				});
			}

			const updatedActivity: ScheduledActivity = {
				...activity,
				completed: !activity.completed,
				completedAt: !activity.completed ? new Date().toISOString() : undefined,
				completionNotes: !activity.completed
					? completionNotes || ""
					: activity.completionNotes,
			};

			return await ActivityRepository.updateScheduledActivity(updatedActivity);
		} catch (error) {
			handleError(error as Error, {
				operation: "toggleActivityCompletion",
				activityId,
				dogId,
			});
			throw error;
		}
	}

	static async updateScheduledActivity(
		activityId: string,
		dogId: string,
		updates: Partial<ScheduledActivity>,
	): Promise<ScheduledActivity> {
		try {
			if (!activityId?.trim() || !dogId?.trim()) {
				throw new AppError(
					"Activity ID and Dog ID are required",
					"MISSING_REQUIRED_FIELDS",
				);
			}

			const activities = await ActivityRepository.getScheduledActivities(dogId);
			const activity = activities.find((a) => a.id === activityId);

			if (!activity) {
				throw new AppError("Activity not found", "ACTIVITY_NOT_FOUND", {
					activityId,
					dogId,
				});
			}

			// Validate updates
			if (updates.scheduledDate) {
				ActivityValidationService.validateScheduledDate(updates.scheduledDate);
			}

			const updatedActivity = { ...activity, ...updates };
			return await ActivityRepository.updateScheduledActivity(updatedActivity);
		} catch (error) {
			handleError(error as Error, {
				operation: "updateScheduledActivity",
				activityId,
				dogId,
				updates,
			});
			throw error;
		}
	}

	static async createUserActivity(
		activity: Omit<UserActivity, "id" | "createdAt" | "dogId">,
		dogId: string,
	): Promise<UserActivity> {
		try {
			if (!dogId?.trim()) {
				throw new AppError("Dog ID is required", "INVALID_DOG_ID");
			}

			ActivityValidationService.validateUserActivityData(activity);

			const newActivity: UserActivity = {
				...activity,
				id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				dogId,
				createdAt: new Date().toISOString(),
			};

			return await ActivityRepository.createUserActivity(newActivity);
		} catch (error) {
			handleError(error as Error, {
				operation: "createUserActivity",
				activity,
				dogId,
			});
			throw error;
		}
	}
}

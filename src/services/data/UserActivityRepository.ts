import type { UserActivity } from "@/types/activity";
import { AppError, handleError } from "@/utils/errorUtils";
import { LocalStorageAdapter } from "../integration/LocalStorageAdapter";
import { SupabaseAdapter } from "../integration/SupabaseAdapter";
import { BaseRepository } from "./BaseRepository";

export class UserActivityRepository extends BaseRepository {
	static async getUserActivities(
		dogId: string,
		fallbackToLocalStorage = true,
	): Promise<UserActivity[]> {
		try {
			UserActivityRepository.validateDogId(dogId);

			return await SupabaseAdapter.getUserActivities(dogId);
		} catch (error) {
			console.error(
				"Failed to fetch from Supabase, falling back to localStorage:",
				error,
			);
			handleError(
				error as Error,
				{ operation: "getUserActivities", dogId },
				false,
			);

			if (fallbackToLocalStorage) {
				try {
					return LocalStorageAdapter.getUserActivities(dogId);
				} catch (localError) {
					console.error("LocalStorage fallback also failed:", localError);
					handleError(
						localError as Error,
						{ operation: "getUserActivities_localStorage", dogId },
						false,
					);
					return []; // Return empty array as last resort
				}
			}
			throw error;
		}
	}

	static async createUserActivity(
		activity: UserActivity,
	): Promise<UserActivity> {
		try {
			UserActivityRepository.validateUserActivity(activity);

			const created = await SupabaseAdapter.createUserActivity(activity);

			// Update localStorage as backup
			try {
				const existing = LocalStorageAdapter.getUserActivities(activity.dogId);
				LocalStorageAdapter.saveUserActivities(activity.dogId, [
					...existing,
					created,
				]);
			} catch (localError) {
				console.warn("Failed to update localStorage backup:", localError);
			}

			return created;
		} catch (error) {
			console.error("Failed to create in Supabase:", error);
			handleError(error as Error, {
				operation: "createUserActivity",
				activity,
			});
			throw error;
		}
	}

	private static validateUserActivity(activity: UserActivity): void {
		UserActivityRepository.validateId(activity.id, "Activity ID");
		UserActivityRepository.validateRequiredString(
			activity.title,
			"Activity title",
		);
		UserActivityRepository.validateDogId(activity.dogId);

		if (!activity.pillar) {
			throw new AppError("Activity pillar is required", "VALIDATION_ERROR");
		}

		UserActivityRepository.validatePositiveNumber(
			activity.duration,
			"Duration",
		);
	}
}

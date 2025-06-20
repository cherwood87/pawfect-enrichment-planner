import type { ScheduledActivity } from "@/types/activity";
import { AppError, handleError } from "@/utils/errorUtils";
import { LocalStorageAdapter } from "../integration/LocalStorageAdapter";
import { SupabaseAdapter } from "../integration/SupabaseAdapter";
import { BaseRepository } from "./BaseRepository";
import { OptimizedQueryService } from "./OptimizedQueryService";

export class ScheduledActivityRepository extends BaseRepository {
	private static optimizedQuery = OptimizedQueryService.getInstance();

	static async getScheduledActivities(
		dogId: string,
		fallbackToLocalStorage = true,
	): Promise<ScheduledActivity[]> {
		try {
			ScheduledActivityRepository.validateDogId(dogId);

			console.log(
				"🔍 [ScheduledActivityRepository] Fetching scheduled activities for dog:",
				dogId,
			);

			// Try optimized query service first for better performance
			const today = new Date();
			const oneMonthFromNow = new Date();
			oneMonthFromNow.setMonth(today.getMonth() + 1);

			try {
				const activities =
					await ScheduledActivityRepository.optimizedQuery.getWeeklyPlannerData(
						dogId,
						today,
						oneMonthFromNow,
					);
				console.log(
					"✅ [ScheduledActivityRepository] Retrieved via optimized query:",
					activities.length,
					"activities",
				);
				return activities;
			} catch (optimizedError) {
				console.warn(
					"⚠️ [ScheduledActivityRepository] Optimized query failed, falling back to standard adapter:",
					optimizedError,
				);
				// Fall back to standard adapter
				const activities = await SupabaseAdapter.getScheduledActivities(dogId);
				console.log(
					"✅ [ScheduledActivityRepository] Retrieved via standard adapter:",
					activities.length,
					"activities",
				);
				return activities;
			}
		} catch (error) {
			console.error(
				"❌ [ScheduledActivityRepository] Failed to fetch from Supabase, falling back to localStorage:",
				error,
			);
			handleError(
				error as Error,
				{ operation: "getScheduledActivities", dogId },
				false,
			);

			if (fallbackToLocalStorage) {
				try {
					const localActivities =
						LocalStorageAdapter.getScheduledActivities(dogId);
					console.log(
						"📱 [ScheduledActivityRepository] Retrieved from localStorage:",
						localActivities.length,
						"activities",
					);
					return localActivities;
				} catch (localError) {
					console.error(
						"❌ [ScheduledActivityRepository] LocalStorage fallback also failed:",
						localError,
					);
					handleError(
						localError as Error,
						{ operation: "getScheduledActivities_localStorage", dogId },
						false,
					);
					return []; // Return empty array as last resort
				}
			}
			throw error;
		}
	}

	static async createScheduledActivity(
		activity: ScheduledActivity,
	): Promise<ScheduledActivity> {
		try {
			console.log(
				"💾 [ScheduledActivityRepository] Creating scheduled activity with enhanced duplicate handling:",
				{
					activityId: activity.activityId,
					dogId: activity.dogId,
					scheduledDate: activity.scheduledDate,
					weekNumber: activity.weekNumber,
					dayOfWeek: activity.dayOfWeek,
				},
			);

			ScheduledActivityRepository.validateScheduledActivity(activity);

			// The SupabaseAdapter now uses the safe upsert function
			const created = await SupabaseAdapter.createScheduledActivity(activity);

			console.log(
				"✅ [ScheduledActivityRepository] Created/Updated in Supabase:",
				{
					id: created.id,
					activityId: created.activityId,
					scheduledDate: created.scheduledDate,
					weekNumber: created.weekNumber,
					dayOfWeek: created.dayOfWeek,
				},
			);

			// Clear optimized query cache for this dog
			ScheduledActivityRepository.optimizedQuery.clearDogCache(activity.dogId);

			// Update localStorage as backup
			if (activity.dogId) {
				try {
					const existing = LocalStorageAdapter.getScheduledActivities(
						activity.dogId,
					);
					// Remove any existing entry for the same activity/date combo before adding the new one
					const filtered = existing.filter(
						(a) =>
							!(
								a.activityId === created.activityId &&
								a.scheduledDate === created.scheduledDate &&
								a.dogId === created.dogId
							),
					);
					LocalStorageAdapter.saveScheduledActivities(activity.dogId, [
						...filtered,
						created,
					]);
					console.log(
						"📱 [ScheduledActivityRepository] Updated localStorage backup",
					);
				} catch (localError) {
					console.warn(
						"⚠️ [ScheduledActivityRepository] Failed to update localStorage backup:",
						localError,
					);
				}
			}

			return created;
		} catch (error) {
			console.error(
				"❌ [ScheduledActivityRepository] Failed to create in Supabase:",
				error,
			);

			// Enhanced error handling for different types of failures
			if (error instanceof Error) {
				if (
					error.message.includes("duplicate") ||
					error.message.includes("already scheduled")
				) {
					// This is actually a successful upsert, but we should inform the user
					console.log(
						"ℹ️ [ScheduledActivityRepository] Activity was already scheduled, upsert successful",
					);
				} else {
					handleError(error, {
						operation: "createScheduledActivity",
						activity,
					});
				}
			}

			throw error;
		}
	}

	// Batch creation using optimized service
	static async createScheduledActivitiesBatch(
		activities: Omit<ScheduledActivity, "id" | "created_at" | "updated_at">[],
	): Promise<ScheduledActivity[]> {
		try {
			console.log(
				"💾 [ScheduledActivityRepository] Creating batch of",
				activities.length,
				"scheduled activities",
			);

			// Validate all activities
			activities.forEach((activity) =>
				ScheduledActivityRepository.validateScheduledActivityForBatch(activity),
			);

			// Use optimized query service for batch operations
			const created =
				await ScheduledActivityRepository.optimizedQuery.createScheduledActivitiesBatch(
					activities,
				);

			console.log(
				"✅ [ScheduledActivityRepository] Batch created successfully:",
				created.length,
				"activities",
			);
			return created;
		} catch (error) {
			console.error(
				"❌ [ScheduledActivityRepository] Failed to create batch:",
				error,
			);
			handleError(error as Error, {
				operation: "createScheduledActivitiesBatch",
				count: activities.length,
			});
			throw error;
		}
	}

	static async updateScheduledActivity(
		activity: ScheduledActivity,
	): Promise<ScheduledActivity> {
		try {
			ScheduledActivityRepository.validateScheduledActivity(activity);

			const updated = await SupabaseAdapter.updateScheduledActivity(activity);

			// Clear optimized query cache for this dog
			ScheduledActivityRepository.optimizedQuery.clearDogCache(activity.dogId);

			// Update localStorage as backup
			try {
				const existing = LocalStorageAdapter.getScheduledActivities(
					activity.dogId,
				);
				const updatedList = existing.map((a) =>
					a.id === activity.id ? updated : a,
				);
				LocalStorageAdapter.saveScheduledActivities(
					activity.dogId,
					updatedList,
				);
			} catch (localError) {
				console.warn("Failed to update localStorage backup:", localError);
			}

			return updated;
		} catch (error) {
			console.error("Failed to update in Supabase:", error);
			handleError(error as Error, {
				operation: "updateScheduledActivity",
				activity,
			});
			throw error;
		}
	}

	static async deleteScheduledActivity(
		id: string,
		dogId: string,
	): Promise<void> {
		try {
			ScheduledActivityRepository.validateId(id, "ID");
			ScheduledActivityRepository.validateDogId(dogId);

			await SupabaseAdapter.deleteScheduledActivity(id);

			// Clear optimized query cache for this dog
			ScheduledActivityRepository.optimizedQuery.clearDogCache(dogId);

			// Update localStorage as backup
			try {
				const existing = LocalStorageAdapter.getScheduledActivities(dogId);
				const filtered = existing.filter((a) => a.id !== id);
				LocalStorageAdapter.saveScheduledActivities(dogId, filtered);
			} catch (localError) {
				console.warn("Failed to update localStorage backup:", localError);
			}
		} catch (error) {
			console.error("Failed to delete from Supabase:", error);
			handleError(error as Error, {
				operation: "deleteScheduledActivity",
				id,
				dogId,
			});
			throw error;
		}
	}

	private static validateScheduledActivity(activity: ScheduledActivity): void {
		ScheduledActivityRepository.validateId(activity.id, "Activity ID");
		ScheduledActivityRepository.validateRequiredString(
			activity.activityId,
			"Activity reference ID",
		);
		ScheduledActivityRepository.validateDogId(activity.dogId);

		if (!activity.scheduledDate) {
			throw new AppError("Scheduled date is required", "VALIDATION_ERROR");
		}

		ScheduledActivityRepository.validateDate(
			activity.scheduledDate,
			"Scheduled date",
		);
	}

	private static validateScheduledActivityForBatch(
		activity: Omit<ScheduledActivity, "id" | "created_at" | "updated_at">,
	): void {
		ScheduledActivityRepository.validateRequiredString(
			activity.activityId,
			"Activity reference ID",
		);
		ScheduledActivityRepository.validateDogId(activity.dogId);

		if (!activity.scheduledDate) {
			throw new AppError("Scheduled date is required", "VALIDATION_ERROR");
		}

		ScheduledActivityRepository.validateDate(
			activity.scheduledDate,
			"Scheduled date",
		);
	}
}

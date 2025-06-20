import type { ScheduledActivity, UserActivity } from "@/types/activity";
import type { Dog } from "@/types/dog";
import { CacheService } from "../network/CacheService";
import {
	type CircuitBreakerState,
	RetryService,
} from "../network/RetryService";
import { ActivitySupabaseAdapter } from "./ActivitySupabaseAdapter";
import { DogSupabaseAdapter } from "./DogSupabaseAdapter";

// Facade to maintain backwards compatibility with existing EnhancedSupabaseAdapter API
export class EnhancedSupabaseAdapter {
	// Dog operations
	static async getDogs(userId: string, useCache = true): Promise<Dog[]> {
		return DogSupabaseAdapter.getDogs(userId, useCache);
	}

	static async createDog(
		dogData: Omit<Dog, "id" | "dateAdded" | "lastUpdated">,
	): Promise<Dog> {
		return DogSupabaseAdapter.createDog(dogData);
	}

	static async updateDog(dog: Dog): Promise<Dog> {
		return DogSupabaseAdapter.updateDog(dog);
	}

	static async deleteDog(id: string): Promise<void> {
		return DogSupabaseAdapter.deleteDog(id);
	}

	// Activity operations
	static async getScheduledActivities(
		dogId: string,
		useCache = true,
	): Promise<ScheduledActivity[]> {
		return ActivitySupabaseAdapter.getScheduledActivities(dogId, useCache);
	}

	static async getUserActivities(
		dogId: string,
		useCache = true,
	): Promise<UserActivity[]> {
		return ActivitySupabaseAdapter.getUserActivities(dogId, useCache);
	}

	static async createScheduledActivity(
		activity: Omit<ScheduledActivity, "id">,
	): Promise<ScheduledActivity> {
		return ActivitySupabaseAdapter.createScheduledActivity(activity);
	}

	// Utility methods
	static getNetworkHealth(): {
		dogs: CircuitBreakerState | null;
		scheduledActivities: CircuitBreakerState | null;
		userActivities: CircuitBreakerState | null;
	} {
		return {
			dogs: RetryService.getCircuitBreakerState("dogs_query"),
			scheduledActivities: RetryService.getCircuitBreakerState(
				"scheduled_activities_query",
			),
			userActivities: RetryService.getCircuitBreakerState(
				"user_activities_query",
			),
		};
	}

	static clearCache(): void {
		CacheService.clear();
		console.log("🧹 Enhanced adapter cache cleared");
	}
}

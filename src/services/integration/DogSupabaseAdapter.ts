import type { Dog } from "@/types/dog";
import { CacheService } from "../network/CacheService";
import { BaseSupabaseAdapter } from "./BaseSupabaseAdapter";
import { DogDataMapper } from "./mappers/DogDataMapper";

export class DogSupabaseAdapter extends BaseSupabaseAdapter {
	private static readonly CACHE_KEY_PREFIX = "enhanced_dogs";

	static async getDogs(userId: string, useCache = true): Promise<Dog[]> {
		console.log("🐕 Loading dogs with enhanced adapter for user:", userId);

		// Try cache first if enabled
		if (useCache) {
			const cached = CacheService.getCachedDogs(userId);
			if (cached) {
				console.log("📋 Returning cached dogs:", cached.length);
				return cached;
			}
		}

		// Use retry with circuit breaker
		const dogs = await DogSupabaseAdapter.executeWithRetry(
			async () => {
				console.log("🔍 Querying dogs from Supabase...");
				const { data, error } = await DogSupabaseAdapter.getSupabaseClient()
					.from("dogs")
					.select("*")
					.eq("user_id", userId)
					.order("created_at", { ascending: false });

				if (error) {
					console.error("❌ Supabase dogs query error:", error);
					throw new Error(`Failed to fetch dogs: ${error.message}`);
				}

				return (data || []).map(DogDataMapper.mapToDog);
			},
			{
				maxAttempts: 3,
				baseDelay: 1000,
				maxDelay: 5000,
				backoffFactor: 2,
				timeout: 10000,
			},
			"dogs_query",
		);

		// Cache successful result
		if (dogs.length > 0) {
			CacheService.cacheDogs(userId, dogs);
		}

		console.log("✅ Enhanced dogs loaded:", dogs.length);
		return dogs;
	}

	static async createDog(
		dogData: Omit<Dog, "id" | "dateAdded" | "lastUpdated">,
	): Promise<Dog> {
		console.log("➕ Creating dog with enhanced adapter:", dogData.name);

		const dog = await DogSupabaseAdapter.executeWithRetry(
			async () => {
				const { data, error } = await DogSupabaseAdapter.getSupabaseClient()
					.from("dogs")
					.insert([DogDataMapper.mapToDatabase(dogData)])
					.select()
					.single();

				if (error) {
					console.error("❌ Dog creation error:", error);
					throw new Error(`Failed to create dog: ${error.message}`);
				}

				return data;
			},
			{
				maxAttempts: 2,
				baseDelay: 1000,
				maxDelay: 3000,
				backoffFactor: 2,
				timeout: 10000,
			},
			"dog_create",
		);

		// Invalidate dogs cache for this user
		if (dogData.userId) {
			CacheService.delete(`dogs_${dogData.userId}`);
		}

		console.log("✅ Enhanced dog created:", dog.id);
		return DogDataMapper.mapToDog(dog);
	}

	static async updateDog(dog: Dog): Promise<Dog> {
		console.log("✏️ Updating dog with enhanced adapter:", dog.name);

		const updatedDog = await DogSupabaseAdapter.executeWithRetry(
			async () => {
				const { data, error } = await DogSupabaseAdapter.getSupabaseClient()
					.from("dogs")
					.update(DogDataMapper.mapToUpdatePayload(dog))
					.eq("id", dog.id)
					.eq("user_id", dog.userId)
					.select()
					.single();

				if (error) {
					console.error("❌ Dog update error:", error);
					throw new Error(`Failed to update dog: ${error.message}`);
				}

				return data;
			},
			{
				maxAttempts: 2,
				baseDelay: 1000,
				maxDelay: 3000,
				backoffFactor: 2,
				timeout: 10000,
			},
			"dog_update",
		);

		// Invalidate dogs cache for this user
		CacheService.delete(`dogs_${dog.userId}`);

		console.log("✅ Enhanced dog updated:", updatedDog.id);
		return DogDataMapper.mapToDog(updatedDog);
	}

	static async deleteDog(id: string): Promise<void> {
		console.log("🗑️ Deleting dog with enhanced adapter:", id);

		await DogSupabaseAdapter.executeWithRetry(
			async () => {
				const { error } = await DogSupabaseAdapter.getSupabaseClient()
					.from("dogs")
					.delete()
					.eq("id", id);

				if (error) {
					console.error("❌ Dog deletion error:", error);
					throw new Error(`Failed to delete dog: ${error.message}`);
				}
			},
			{
				maxAttempts: 2,
				baseDelay: 1000,
				maxDelay: 3000,
				backoffFactor: 2,
				timeout: 8000,
			},
			"dog_delete",
		);

		console.log("✅ Enhanced dog deleted:", id);
	}
}

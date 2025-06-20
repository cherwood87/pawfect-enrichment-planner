import { supabase } from "@/integrations/supabase/client";
import type { UserActivity } from "@/types/activity";
import { ActivityMappers } from "./mappers/activityMappers";

export class UserActivityService {
	static async getAll(dogId: string): Promise<UserActivity[]> {
		const { data, error } = await supabase
			.from("user_activities")
			.select("*")
			.eq("dog_id", dogId)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching user activities:", error);
			throw new Error("Failed to fetch user activities");
		}

		return data.map(ActivityMappers.toUserActivity);
	}

	static async create(
		activity: Omit<UserActivity, "id" | "createdAt">,
	): Promise<UserActivity> {
		const { data, error } = await supabase
			.from("user_activities")
			.insert(ActivityMappers.fromUserActivity(activity))
			.select()
			.single();

		if (error) {
			console.error("Error creating user activity:", error);
			throw new Error("Failed to create user activity");
		}

		return ActivityMappers.toUserActivity(data);
	}
}

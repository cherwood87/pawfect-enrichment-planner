import { supabase } from "@/integrations/supabase/client";
import type {
	ContentDiscoveryConfig,
	DiscoveredActivity,
} from "@/types/discovery";

export class ContentDiscoveryService {
	static getDefaultConfig(): ContentDiscoveryConfig {
		return {
			enabled: true,
			frequency: "weekly",
			maxActivitiesPerDiscovery: 8,
			targetSources: [],
			breedSpecific: true,
			qualityThreshold: 0.6,
		};
	}

	static async getDiscoveredActivities(
		dogId: string,
	): Promise<DiscoveredActivity[]> {
		try {
			const { data, error } = await supabase
				.from("discovered_activities")
				.select("*")
				.eq("dog_id", dogId);

			if (error) throw error;

			// Map database response to DiscoveredActivity type
			return (data || []).map((activity) => ({
				id: activity.id,
				title: activity.title,
				pillar: activity.pillar,
				difficulty: activity.difficulty,
				duration: activity.duration,
				materials: activity.materials || [],
				emotionalGoals: activity.emotional_goals || [],
				instructions: activity.instructions || [],
				benefits: activity.benefits || "",
				tags: activity.tags || [],
				ageGroup: activity.age_group || "All Ages",
				energyLevel: activity.energy_level || "Medium",
				source: "discovered" as const,
				sourceUrl: activity.source_url || "",
				discoveredAt: activity.discovered_at,
				verified: activity.is_approved || false,
				qualityScore: Number(activity.confidence_score) || 0.5,
				approved: activity.is_approved || false,
				rejected: activity.is_rejected || false,
			}));
		} catch (error) {
			console.error("Error fetching discovered activities:", error);
			return [];
		}
	}

	static async createDiscoveredActivities(
		activities: DiscoveredActivity[],
		dogId: string,
	): Promise<void> {
		try {
			const activitiesWithDogId = activities.map((activity) => ({
				id: activity.id,
				dog_id: dogId,
				title: activity.title,
				pillar: activity.pillar,
				difficulty: activity.difficulty,
				duration: activity.duration,
				materials: activity.materials || [],
				emotional_goals: activity.emotionalGoals || [],
				instructions: activity.instructions || [],
				benefits: activity.benefits || "",
				tags: activity.tags || [],
				age_group: activity.ageGroup || "All Ages",
				energy_level: activity.energyLevel || "Medium",
				source_url: activity.sourceUrl || "",
				discovered_at: activity.discoveredAt,
				confidence_score: activity.qualityScore || 0.5,
				is_approved: activity.approved || false,
				is_rejected: activity.rejected || false,
			}));

			const { error } = await supabase
				.from("discovered_activities")
				.upsert(activitiesWithDogId);

			if (error) throw error;
		} catch (error) {
			console.error("Error creating discovered activities:", error);
			throw error;
		}
	}

	static async getDiscoveryConfig(
		dogId: string,
	): Promise<ContentDiscoveryConfig | null> {
		try {
			const { data, error } = await supabase
				.from("discovery_configs")
				.select("*")
				.eq("dog_id", dogId)
				.single();

			if (error && error.code !== "PGRST116") throw error;

			if (!data) return null;

			// Map database response to ContentDiscoveryConfig type
			return {
				enabled: data.enabled,
				frequency: data.frequency as "weekly" | "monthly",
				maxActivitiesPerDiscovery: data.max_activities_per_discovery,
				targetSources: data.target_sources || [],
				breedSpecific: data.breed_specific,
				qualityThreshold: Number(data.quality_threshold),
				lastDiscoveryRun: data.last_discovery_run || undefined,
			};
		} catch (error) {
			console.error("Error fetching discovery config:", error);
			return null;
		}
	}

	static async saveDiscoveryConfig(
		config: ContentDiscoveryConfig,
		dogId: string,
	): Promise<void> {
		try {
			const configData = {
				dog_id: dogId,
				enabled: config.enabled,
				frequency: config.frequency,
				max_activities_per_discovery: config.maxActivitiesPerDiscovery,
				target_sources: config.targetSources || [],
				breed_specific: config.breedSpecific,
				quality_threshold: config.qualityThreshold,
				last_discovery_run: config.lastDiscoveryRun || null,
			};

			const { error } = await supabase
				.from("discovery_configs")
				.upsert(configData);

			if (error) throw error;
		} catch (error) {
			console.error("Error saving discovery config:", error);
			throw error;
		}
	}
}

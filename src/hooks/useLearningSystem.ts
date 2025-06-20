import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDog } from "@/contexts/DogContext";
import { useToast } from "@/hooks/use-toast";
import { LearningService } from "@/services/learning/LearningService";
import { RecommendationService } from "@/services/learning/RecommendationService";
import type {
	ActivityFeedback,
	SmartRecommendation,
	UserInteraction,
} from "@/types/learning";

export const useLearningSystem = () => {
	const { user } = useAuth();
	const { currentDog } = useDog();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	// Track user interactions
	const trackInteraction = useCallback(
		async (
			interactionType: UserInteraction["interactionType"],
			contextData?: Record<string, any>,
		) => {
			if (!user || !currentDog) return;

			try {
				await LearningService.trackInteraction({
					userId: user.id,
					dogId: currentDog.id,
					interactionType,
					contextData,
					sessionId: sessionStorage.getItem("session_id") || undefined,
				});
			} catch (error) {
				console.error("Failed to track interaction:", error);
				// Silently fail - don't disrupt user experience
			}
		},
		[user, currentDog],
	);

	// Submit activity feedback
	const submitFeedback = useCallback(
		async (
			activityId: string,
			activityType: "library" | "user" | "discovered",
			feedback: Partial<
				Pick<
					ActivityFeedback,
					| "rating"
					| "difficultyRating"
					| "engagementRating"
					| "enjoymentRating"
					| "feedbackText"
					| "wouldRecommend"
					| "tags"
				>
			>,
		) => {
			if (!user || !currentDog) return;

			setIsLoading(true);
			try {
				await LearningService.submitFeedback({
					userId: user.id,
					dogId: currentDog.id,
					activityId,
					activityType,
					...feedback,
				});

				// Track the feedback submission
				await trackInteraction("feedback_submit", {
					activityId,
					activityType,
					rating: feedback.rating,
				});

				toast({
					title: "Feedback Submitted",
					description:
						"Thank you for your feedback! This helps us improve recommendations.",
				});
			} catch (error) {
				console.error("Failed to submit feedback:", error);
				toast({
					title: "Error",
					description: "Failed to submit feedback. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[user, currentDog, toast, trackInteraction],
	);

	// Get personalized recommendations
	const getRecommendations = useCallback(
		async (
			type:
				| "daily"
				| "weekly"
				| "weather_based"
				| "mood_based"
				| "discovery" = "daily",
			limit: number = 5,
		): Promise<SmartRecommendation[]> => {
			if (!user || !currentDog) return [];

			setIsLoading(true);
			try {
				const recommendations =
					await RecommendationService.generateRecommendations(
						user.id,
						currentDog.id,
						type,
						limit,
					);

				return recommendations;
			} catch (error) {
				console.error("Failed to get recommendations:", error);
				toast({
					title: "Error",
					description: "Failed to load personalized recommendations.",
					variant: "destructive",
				});
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[user, currentDog, toast],
	);

	// Get daily recommendations
	const getDailyRecommendations = useCallback(async (): Promise<
		SmartRecommendation[]
	> => {
		if (!user || !currentDog) return [];

		try {
			return await RecommendationService.getDailyRecommendations(
				user.id,
				currentDog.id,
			);
		} catch (error) {
			console.error("Failed to get daily recommendations:", error);
			return [];
		}
	}, [user, currentDog]);

	// Calculate and update pillar preferences
	const updatePillarPreferences = useCallback(async () => {
		if (!user || !currentDog) return;

		try {
			const preferences = await LearningService.calculatePillarPreferences(
				user.id,
				currentDog.id,
			);

			if (preferences.length > 0) {
				const pillarWeights = preferences.reduce(
					(acc, pref) => {
						acc[pref.pillar] = pref.preferenceScore;
						return acc;
					},
					{} as Record<string, number>,
				);

				await LearningService.updatePreference({
					userId: user.id,
					dogId: currentDog.id,
					preferenceType: "pillar_weights",
					preferenceData: pillarWeights,
					confidenceScore: Math.min(...preferences.map((p) => p.confidence)),
				});
			}
		} catch (error) {
			console.error("Failed to update pillar preferences:", error);
		}
	}, [user, currentDog]);

	return {
		trackInteraction,
		submitFeedback,
		getRecommendations,
		getDailyRecommendations,
		updatePillarPreferences,
		isLoading,
	};
};

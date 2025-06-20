import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useActivity } from "@/contexts/ActivityContext";
import { getPillarActivities } from "@/data/activityLibrary";
import {
	type FavouriteActivity,
	favouritesService,
} from "@/services/favouritesService";
import type { ActivityLibraryItem, UserActivity } from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

export const useFavourites = (dogId: string | null) => {
	const [favourites, setFavourites] = useState<FavouriteActivity[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { userActivities, discoveredActivities } = useActivity();

	// Load favourites when dog changes
	useEffect(() => {
		if (dogId) {
			loadFavourites();
		} else {
			setFavourites([]);
		}
	}, [dogId, loadFavourites]);

	const loadFavourites = async () => {
		if (!dogId) return;

		setIsLoading(true);
		try {
			const data = await favouritesService.getFavourites(dogId);

			// Populate activity details for each favourite
			const enrichedFavourites = data.map((fav) => {
				let activityDetails = null;

				if (fav.activity_type === "library") {
					activityDetails = getPillarActivities().find(
						(a) => a.id === fav.activity_id,
					);
				} else if (fav.activity_type === "user") {
					activityDetails = userActivities.find(
						(a) => a.id === fav.activity_id,
					);
				} else if (fav.activity_type === "discovered") {
					activityDetails = discoveredActivities.find(
						(a) => a.id === fav.activity_id,
					);
				}

				return {
					...fav,
					title: activityDetails?.title || "Unknown Activity",
					pillar: activityDetails?.pillar || "unknown",
					difficulty: activityDetails?.difficulty || "Medium",
					duration: activityDetails?.duration || 0,
				};
			});

			setFavourites(enrichedFavourites);
		} catch (error) {
			console.error("Failed to load favourites:", error);
			toast({
				title: "Error",
				description: "Failed to load favourites",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const addToFavourites = async (
		activity: ActivityLibraryItem | UserActivity | DiscoveredActivity,
		activityType: "library" | "user" | "discovered" = "library",
	) => {
		if (!dogId) return;

		try {
			await favouritesService.addToFavourites(dogId, activity, activityType);
			await loadFavourites(); // Reload to get updated list

			toast({
				title: "Added to Favourites",
				description: `"${activity.title}" has been added to your favourites.`,
			});
		} catch (error: any) {
			console.error("Failed to add to favourites:", error);

			if (error.code === "23505") {
				// Unique constraint violation
				toast({
					title: "Already in Favourites",
					description: `"${activity.title}" is already in your favourites.`,
				});
			} else {
				toast({
					title: "Error",
					description: "Failed to add to favourites",
					variant: "destructive",
				});
			}
		}
	};

	const removeFromFavourites = async (favouriteId: string) => {
		try {
			await favouritesService.removeFromFavourites(favouriteId);
			await loadFavourites(); // Reload to get updated list

			toast({
				title: "Removed from Favourites",
				description: "Activity has been removed from your favourites.",
			});
		} catch (error) {
			console.error("Failed to remove from favourites:", error);
			toast({
				title: "Error",
				description: "Failed to remove from favourites",
				variant: "destructive",
			});
		}
	};

	return {
		favourites,
		isLoading,
		addToFavourites,
		removeFromFavourites,
		loadFavourites,
	};
};

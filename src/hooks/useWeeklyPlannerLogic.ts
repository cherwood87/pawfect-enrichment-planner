import { useCallback, useEffect, useState } from "react";
import { useActivity } from "@/contexts/ActivityContext";
import { useDog } from "@/contexts/DogContext";
import type { ScheduledActivity } from "@/types/activity";
import { WeekUtils } from "@/utils/weekUtils";

export const useWeeklyPlannerLogic = (currentWeekStartDate: Date) => {
	const { currentDog } = useDog();
	const { scheduledActivities } = useActivity();
	const [weeklyActivities, setWeeklyActivities] = useState<ScheduledActivity[]>(
		[],
	);

	const currentWeekNumber = WeekUtils.getISOWeek(currentWeekStartDate);

	// Load activities for the current week with enhanced filtering logic
	useEffect(() => {
		if (currentDog) {
			console.log(
				"🔍 [useWeeklyPlannerLogic] Filtering activities for current week:",
				{
					dogId: currentDog.id,
					dogName: currentDog.name,
					targetWeekNumber: currentWeekNumber,
					currentWeekStartDate: currentWeekStartDate.toDateString(),
					allScheduledActivities: scheduledActivities.map((a) => ({
						id: a.id,
						activityId: a.activityId,
						dogId: a.dogId,
						weekNumber: a.weekNumber,
						scheduledDate: a.scheduledDate,
						dayOfWeek: a.dayOfWeek,
					})),
				},
			);

			const filteredActivities = scheduledActivities.filter((activity) => {
				const matchesDog = activity.dogId === currentDog.id;
				const matchesWeek = activity.weekNumber === currentWeekNumber;

				// Additional validation: check if the scheduled date is actually in the current week
				const activityDate = new Date(activity.scheduledDate);
				const isInCurrentWeek = WeekUtils.isSameWeek(
					activityDate,
					currentWeekStartDate,
				);

				console.log(`🎯 [useWeeklyPlannerLogic] Activity ${activity.id}:`, {
					activityId: activity.activityId,
					scheduledDate: activity.scheduledDate,
					dayOfWeek: activity.dayOfWeek,
					matchesDog,
					matchesWeek: `${matchesWeek} (activity: ${activity.weekNumber}, current: ${currentWeekNumber})`,
					isInCurrentWeek,
					activityDog: activity.dogId,
					included: matchesDog && matchesWeek && isInCurrentWeek,
				});

				return matchesDog && matchesWeek && isInCurrentWeek;
			});

			console.log("✅ [useWeeklyPlannerLogic] Filtered activities result:", {
				count: filteredActivities.length,
				activities: filteredActivities.map((a) => ({
					id: a.id,
					activityId: a.activityId,
					dayOfWeek: a.dayOfWeek,
					scheduledDate: a.scheduledDate,
					weekNumber: a.weekNumber,
				})),
			});

			setWeeklyActivities(filteredActivities);
		} else {
			console.log("⚠️ [useWeeklyPlannerLogic] No current dog selected");
			setWeeklyActivities([]);
		}
	}, [
		scheduledActivities,
		currentDog,
		currentWeekNumber,
		currentWeekStartDate,
	]);

	// Calculate completion status for each day
	const getDayCompletionStatus = useCallback(
		(
			dayIndex: number,
		): { completed: boolean; activity: ScheduledActivity | undefined } => {
			const dayActivities = weeklyActivities.filter(
				(activity) => activity.dayOfWeek === dayIndex,
			);

			console.log(`📅 [useWeeklyPlannerLogic] Day ${dayIndex} status:`, {
				dayActivities: dayActivities.map((a) => ({
					id: a.id,
					activityId: a.activityId,
					completed: a.completed,
				})),
				count: dayActivities.length,
			});

			if (dayActivities.length === 0)
				return { completed: false, activity: undefined };
			const completed = dayActivities.every((activity) => activity.completed);
			return { completed, activity: dayActivities[0] };
		},
		[weeklyActivities],
	);

	return {
		weeklyActivities,
		currentWeekNumber,
		getDayCompletionStatus,
	};
};

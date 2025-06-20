import { useMemo, useState } from "react";
import { useActivity } from "@/contexts/ActivityContext";
import { useDog } from "@/contexts/DogContext";
import type { ScheduledActivity } from "@/types/activity";

const DAY_LABELS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const useWeeklyPlannerState = () => {
	const { scheduledActivities } = useActivity();
	const { currentDog } = useDog();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedActivity, setSelectedActivity] =
		useState<ScheduledActivity | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [viewMode, setViewMode] = useState<"week" | "day">("week");
	const [optimisticUpdates, setOptimisticUpdates] = useState<
		Record<string, boolean>
	>({});
	const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
		{},
	);

	console.log("📊 [useWeeklyPlannerState] State update:", {
		scheduledActivitiesCount: scheduledActivities.length,
		currentDog: currentDog?.name || "None",
		currentDate: currentDate.toDateString(),
	});

	// Get start of rolling 7-day period (today + next 6 days)
	const startOfPeriod = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Reset to start of day
		console.log(
			"📅 [useWeeklyPlannerState] Start of period:",
			today.toDateString(),
		);
		return today;
	}, []); // Always start from today, no dependency on currentDate

	// Build structure: [{ label, date, activities }] for rolling 7-day window
	const weekDays = useMemo(() => {
		const days = Array.from({ length: 7 }).map((_, i) => {
			const dayDate = new Date(startOfPeriod);
			dayDate.setDate(startOfPeriod.getDate() + i);

			const dayActivities = scheduledActivities.filter((a) => {
				const activityDate = new Date(a.scheduledDate).toDateString();
				const dayDateString = dayDate.toDateString();
				const dogMatch = !currentDog || a.dogId === currentDog.id;

				return activityDate === dayDateString && dogMatch;
			});

			return {
				label: DAY_LABELS[dayDate.getDay()],
				date: new Date(dayDate), // clone
				activities: dayActivities,
			};
		});

		console.log(
			"📋 [useWeeklyPlannerState] Week days computed:",
			days.map((day) => ({
				label: day.label,
				date: day.date.toDateString(),
				activitiesCount: day.activities.length,
				activities: day.activities.map((a) => ({
					id: a.id,
					activityId: a.activityId,
					scheduledDate: a.scheduledDate,
				})),
			})),
		);

		return days;
	}, [startOfPeriod, scheduledActivities, currentDog]);

	const allWeekActivities = weekDays.flatMap((day) => day.activities);

	console.log("🎯 [useWeeklyPlannerState] All week activities:", {
		count: allWeekActivities.length,
		activities: allWeekActivities.map((a) => ({
			id: a.id,
			activityId: a.activityId,
			scheduledDate: a.scheduledDate,
			weekNumber: a.weekNumber,
			dayOfWeek: a.dayOfWeek,
		})),
	});

	// Progress summary (used in header and summary)
	const completedActivities = allWeekActivities.filter((a) =>
		optimisticUpdates[a.id] !== undefined
			? optimisticUpdates[a.id]
			: a.completed,
	).length;
	const totalActivities = allWeekActivities.length;

	// Get current week and year for header (based on today)
	const getWeekOfYear = (date: Date) => {
		const start = new Date(date.getFullYear(), 0, 1);
		const diff = date.getTime() - start.getTime();
		const oneWeek = 1000 * 60 * 60 * 24 * 7;
		return Math.floor(diff / oneWeek) + 1;
	};

	const currentWeek = getWeekOfYear(startOfPeriod);
	const currentYear = startOfPeriod.getFullYear();

	// Check if this is the initial load with no activities ever scheduled
	const hasNeverScheduledActivities = scheduledActivities.length === 0;

	console.log("📈 [useWeeklyPlannerState] Summary:", {
		completedActivities,
		totalActivities,
		currentWeek,
		currentYear,
		hasNeverScheduledActivities,
	});

	return {
		currentDate,
		setCurrentDate,
		selectedActivity,
		setSelectedActivity,
		isModalOpen,
		setIsModalOpen,
		viewMode,
		setViewMode,
		optimisticUpdates,
		setOptimisticUpdates,
		loadingStates,
		setLoadingStates,
		startOfWeek: startOfPeriod, // Keep same property name for compatibility
		weekDays,
		allWeekActivities,
		completedActivities,
		totalActivities,
		currentWeek,
		currentYear,
		hasNeverScheduledActivities,
	};
};

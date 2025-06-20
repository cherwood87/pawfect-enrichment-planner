import { useCallback, useMemo, useState } from "react";
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

export const useWeeklyPlannerStateOptimized = () => {
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

	console.log("📊 [useWeeklyPlannerStateOptimized] State update:", {
		scheduledActivitiesCount: scheduledActivities.length,
		currentDog: currentDog?.name || "None",
		currentDate: currentDate.toDateString(),
	});

	// Memoize start of period calculation
	const startOfPeriod = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		console.log(
			"📅 [useWeeklyPlannerStateOptimized] Start of period:",
			today.toDateString(),
		);
		return today;
	}, []);

	// Memoize filtered activities for current dog
	const dogActivities = useMemo(() => {
		if (!currentDog) return [];
		return scheduledActivities.filter((a) => a.dogId === currentDog.id);
	}, [scheduledActivities, currentDog?.id, currentDog]);

	// Memoize week days structure
	const weekDays = useMemo(() => {
		const days = Array.from({ length: 7 }).map((_, i) => {
			const dayDate = new Date(startOfPeriod);
			dayDate.setDate(startOfPeriod.getDate() + i);

			const dayActivities = dogActivities.filter((a) => {
				const activityDate = new Date(a.scheduledDate).toDateString();
				const dayDateString = dayDate.toDateString();
				return activityDate === dayDateString;
			});

			return {
				label: DAY_LABELS[dayDate.getDay()],
				date: new Date(dayDate),
				activities: dayActivities,
			};
		});

		console.log(
			"📋 [useWeeklyPlannerStateOptimized] Week days computed:",
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
	}, [startOfPeriod, dogActivities]);

	// Memoize all week activities
	const allWeekActivities = useMemo(() => {
		return weekDays.flatMap((day) => day.activities);
	}, [weekDays]);

	// Memoize progress calculations
	const { completedActivities, totalActivities } = useMemo(() => {
		const completed = allWeekActivities.filter((a) =>
			optimisticUpdates[a.id] !== undefined
				? optimisticUpdates[a.id]
				: a.completed,
		).length;
		const total = allWeekActivities.length;

		return { completedActivities: completed, totalActivities: total };
	}, [allWeekActivities, optimisticUpdates]);

	// Memoize week calculations
	const { currentWeek, currentYear } = useMemo(() => {
		const getWeekOfYear = (date: Date) => {
			const start = new Date(date.getFullYear(), 0, 1);
			const diff = date.getTime() - start.getTime();
			const oneWeek = 1000 * 60 * 60 * 24 * 7;
			return Math.floor(diff / oneWeek) + 1;
		};

		return {
			currentWeek: getWeekOfYear(startOfPeriod),
			currentYear: startOfPeriod.getFullYear(),
		};
	}, [startOfPeriod]);

	// Memoize check for no activities
	const hasNeverScheduledActivities = useMemo(() => {
		return scheduledActivities.length === 0;
	}, [scheduledActivities.length]);

	// Memoize callback functions
	const setOptimisticUpdate = useCallback(
		(activityId: string, completed: boolean) => {
			setOptimisticUpdates((prev) => ({ ...prev, [activityId]: completed }));
		},
		[],
	);

	const clearOptimisticUpdate = useCallback((activityId: string) => {
		setOptimisticUpdates((prev) => {
			const newUpdates = { ...prev };
			delete newUpdates[activityId];
			return newUpdates;
		});
	}, []);

	const setLoadingState = useCallback(
		(activityId: string, isLoading: boolean) => {
			setLoadingStates((prev) => ({ ...prev, [activityId]: isLoading }));
		},
		[],
	);

	console.log("📈 [useWeeklyPlannerStateOptimized] Summary:", {
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
		startOfWeek: startOfPeriod,
		weekDays,
		allWeekActivities,
		completedActivities,
		totalActivities,
		currentWeek,
		currentYear,
		hasNeverScheduledActivities,
		// Optimized helpers
		setOptimisticUpdate,
		clearOptimisticUpdate,
		setLoadingState,
	};
};

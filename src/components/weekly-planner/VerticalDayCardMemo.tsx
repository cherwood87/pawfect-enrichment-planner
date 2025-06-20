import { memo, useMemo } from "react";
import type { ScheduledActivity } from "@/types/activity";
import DayActivityCard from "./DayActivityCard";

const pastelBg = [
	"bg-purple-50", // Sun
	"bg-cyan-50", // Mon
	"bg-emerald-50", // Tue
	"bg-yellow-50", // Wed
	"bg-pink-50", // Thu
	"bg-blue-50", // Fri
	"bg-orange-50", // Sat
];

interface VerticalDayCardProps {
	label: string;
	date: Date;
	activities: ScheduledActivity[];
	onActivityClick: (activity: ScheduledActivity) => void;
	onToggleCompletion: (activityId: string, completionNotes?: string) => void;
	getActivityDetails: (activityId: string) => any;
	loadingStates?: Record<string, boolean>;
	isRetrying?: boolean;
}

const VerticalDayCard = memo<VerticalDayCardProps>(
	({
		label,
		date,
		activities,
		onActivityClick,
		onToggleCompletion,
		getActivityDetails,
		loadingStates = {},
		isRetrying = false,
	}) => {
		// Memoize completion calculations
		const { completed, total, percent, hasLoadingActivities } = useMemo(() => {
			const completedCount = activities.filter((a) => a.completed).length;
			const totalCount = activities.length;
			const percentComplete = totalCount
				? Math.round((completedCount / totalCount) * 100)
				: 0;
			const hasLoading = activities.some((a) => loadingStates[a.id]);

			return {
				completed: completedCount,
				total: totalCount,
				percent: percentComplete,
				hasLoadingActivities: hasLoading,
			};
		}, [activities, loadingStates]);

		// Memoize background class
		const backgroundClass = useMemo(() => pastelBg[date.getDay()], [date]);

		// Memoize date string
		const dateString = useMemo(() => date.toDateString(), [date]);

		return (
			<div
				className={`rounded-3xl ${backgroundClass} shadow-md border border-purple-100 p-5 flex flex-col gap-2 ${hasLoadingActivities || isRetrying ? "opacity-75" : ""} transition-opacity`}
			>
				<div className="flex items-center justify-between mb-2">
					<span className="font-bold text-lg text-purple-800">{label}</span>
					<span className="text-xs text-purple-600">{dateString}</span>
				</div>
				<div className="mb-4">
					<div className="text-xs font-semibold text-gray-600 mb-1">
						{completed} of {total} activities completed
						{hasLoadingActivities && (
							<span className="ml-2 text-blue-600">(updating...)</span>
						)}
						{isRetrying && (
							<span className="ml-2 text-orange-600">(retrying...)</span>
						)}
					</div>
					<div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
						<div
							className="bg-gradient-to-r from-purple-300 to-cyan-300 h-2 rounded-full transition-all duration-300"
							style={{ width: `${percent}%` }}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-3">
					{activities.length > 0 ? (
						activities.map((activity) => (
							<DayActivityCard
								key={activity.id}
								activity={activity}
								activityDetails={getActivityDetails(activity.activityId)}
								onToggleCompletion={onToggleCompletion}
								onActivityClick={onActivityClick}
								isLoading={loadingStates[activity.id] || false}
							/>
						))
					) : (
						<div className="text-gray-400 text-sm italic py-6 text-center">
							No activities
						</div>
					)}
				</div>
			</div>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison for performance
		return (
			prevProps.label === nextProps.label &&
			prevProps.date.getTime() === nextProps.date.getTime() &&
			prevProps.activities.length === nextProps.activities.length &&
			prevProps.activities.every(
				(activity, index) =>
					activity.id === nextProps.activities[index]?.id &&
					activity.completed === nextProps.activities[index]?.completed,
			) &&
			prevProps.isRetrying === nextProps.isRetrying &&
			JSON.stringify(prevProps.loadingStates) ===
				JSON.stringify(nextProps.loadingStates)
		);
	},
);

VerticalDayCard.displayName = "VerticalDayCard";

export default VerticalDayCard;

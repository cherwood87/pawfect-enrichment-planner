import { Calendar, Target } from "lucide-react";
import type React from "react";
import { useActivity } from "@/contexts/ActivityContext";
import type { ScheduledActivity } from "@/types/activity";

interface AccordionWeeklyGridProps {
	weekActivities: ScheduledActivity[];
	onToggleCompletion: (activityId: string) => void;
	onActivityClick?: (activity: ScheduledActivity) => void;
}

const AccordionWeeklyGrid: React.FC<AccordionWeeklyGridProps> = ({
	weekActivities,
	onToggleCompletion,
	onActivityClick,
}) => {
	const { getActivityDetails } = useActivity();

	const dayNames = [
		{ short: "Sun", full: "Sunday" },
		{ short: "Mon", full: "Monday" },
		{ short: "Tue", full: "Tuesday" },
		{ short: "Wed", full: "Wednesday" },
		{ short: "Thu", full: "Thursday" },
		{ short: "Fri", full: "Friday" },
		{ short: "Sat", full: "Saturday" },
	];

	const currentDayIndex = new Date().getDay();

	const activitiesByDay = dayNames.reduce(
		(acc, _, dayIndex) => {
			acc[dayIndex] = weekActivities.filter(
				(activity) => activity.dayOfWeek === dayIndex,
			);
			return acc;
		},
		{} as Record<number, ScheduledActivity[]>,
	);

	const reorderedDays = [
		...dayNames.slice(currentDayIndex),
		...dayNames.slice(0, currentDayIndex),
	].map((day, index) => ({
		...day,
		originalIndex: (currentDayIndex + index) % 7,
	}));

	const totalActivities = weekActivities.length;

	if (totalActivities === 0) {
		return (
			<div className="text-center py-12 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border border-purple-200">
				<div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl w-16 h-16 mx-auto mb-4">
					<Calendar className="w-10 h-10 text-white mx-auto" />
				</div>
				<h3 className="text-lg font-bold text-purple-800 mb-2">
					No Activities This Week
				</h3>
				<p className="text-purple-600 mb-4">
					Start planning your dog's enrichment journey!
				</p>
				<div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl border border-purple-200">
					<Target className="w-4 h-4" />
					<span className="font-medium">Add activities to get started</span>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{reorderedDays.map((day) => {
				const dayIndex = day.originalIndex;
				const dayActivities = activitiesByDay[dayIndex] || [];
				const completedCount = dayActivities.filter((a) => a.completed).length;
				const isToday = currentDayIndex === dayIndex;

				return (
					<div
						key={dayIndex}
						className="bg-white rounded-3xl shadow-lg p-5 space-y-4 border border-gray-100"
					>
						{/* Day Header */}
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-xl font-bold text-purple-800">
									{day.full}{" "}
									{isToday && (
										<span className="ml-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">
											Today
										</span>
									)}
								</h2>
								<p className="text-sm text-gray-500">
									{completedCount}/{dayActivities.length} completed
								</p>
							</div>
							<div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
								{day.short}
							</div>
						</div>

						{/* Activities List */}
						{dayActivities.length === 0 ? (
							<p className="text-sm text-gray-400 italic">
								No activities scheduled.
							</p>
						) : (
							<div className="space-y-4">
								{dayActivities.map((activity) => {
									const details = getActivityDetails(activity.activityId);
									if (!details) return null;

									return (
										<div
											key={activity.id}
											className="p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 border shadow-sm hover:shadow-md transition cursor-pointer"
											onClick={() => onActivityClick?.(activity)}
										>
											<div className="flex justify-between items-start mb-2">
												<h3 className="font-semibold text-gray-800">
													{details.title}
												</h3>
												<input
													type="checkbox"
													checked={activity.completed}
													onChange={(e) => {
														e.stopPropagation();
														onToggleCompletion(activity.id);
													}}
													className="ml-2"
												/>
											</div>
											<p className="text-sm text-gray-600 mb-1">
												<span className="capitalize">{details.pillar}</span> •{" "}
												{details.duration} min • {details.difficulty}
											</p>
											<p className="text-xs text-gray-500">
												{details.benefits}
											</p>
										</div>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default AccordionWeeklyGrid;

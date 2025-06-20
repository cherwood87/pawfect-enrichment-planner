import { Loader2 } from "lucide-react";
import type React from "react";
import type {
	ActivityLibraryItem,
	ScheduledActivity,
	UserActivity,
} from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

interface DayActivityCardProps {
	activity: ScheduledActivity;
	activityDetails:
		| ActivityLibraryItem
		| UserActivity
		| DiscoveredActivity
		| null;
	onToggleCompletion: (activityId: string, completionNotes?: string) => void;
	onActivityClick: (activity: ScheduledActivity) => void;
	isLoading?: boolean;
}

const DayActivityCard: React.FC<DayActivityCardProps> = ({
	activity,
	activityDetails,
	onToggleCompletion,
	onActivityClick,
	isLoading = false,
}) => {
	if (!activityDetails) {
		return (
			<div className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border shadow-sm">
				<div className="text-gray-500 text-sm">Activity details not found</div>
			</div>
		);
	}

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		if (!isLoading) {
			onToggleCompletion(activity.id);
		}
	};

	const handleCardClick = () => {
		if (!isLoading) {
			onActivityClick(activity);
		}
	};

	return (
		<div
			className={`p-4 rounded-2xl bg-gradient-to-br from-white to-purple-50 border shadow-sm hover:shadow-md transition-all cursor-pointer ${
				isLoading ? "opacity-60 cursor-wait" : "hover:scale-[1.02]"
			} ${activity.completed ? "border-green-200 bg-gradient-to-br from-green-50 to-purple-50" : ""}`}
			onClick={handleCardClick}
		>
			<div className="flex justify-between items-start mb-2">
				<h3
					className={`font-semibold text-gray-800 ${activity.completed ? "line-through text-gray-600" : ""}`}
				>
					{activityDetails.title}
				</h3>
				<div className="flex items-center gap-2 ml-2">
					{isLoading && (
						<Loader2 className="w-4 h-4 animate-spin text-blue-500" />
					)}
					<input
						type="checkbox"
						checked={activity.completed}
						onChange={handleCheckboxChange}
						disabled={isLoading}
						className={`${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} transition-opacity`}
						aria-label={`Mark ${activityDetails.title} as ${activity.completed ? "incomplete" : "complete"}`}
					/>
				</div>
			</div>
			<p className="text-sm text-gray-600 mb-1">
				<span className="capitalize">{activityDetails.pillar}</span> •{" "}
				{activityDetails.duration} min • {activityDetails.difficulty}
			</p>
			<p className="text-xs text-gray-500">{activityDetails.benefits}</p>
			{activity.notes && (
				<p className="text-xs text-purple-600 mt-2 italic">
					Note: {activity.notes}
				</p>
			)}
			{activity.completed && activity.completionNotes && (
				<p className="text-xs text-green-600 mt-2">
					✓ {activity.completionNotes}
				</p>
			)}
		</div>
	);
};

export default DayActivityCard;

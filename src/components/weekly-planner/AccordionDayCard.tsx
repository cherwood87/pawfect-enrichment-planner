import { Calendar, CheckCircle, Circle, Clock } from "lucide-react";
import type React from "react";
import type {
	ActivityLibraryItem,
	ScheduledActivity,
	UserActivity,
} from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

interface AccordionDayCardProps {
	activities: ScheduledActivity[];
	getActivityDetails: (
		id: string,
	) => ActivityLibraryItem | UserActivity | DiscoveredActivity | null;
	onToggleCompletion: (activityId: string) => void;
	onActivityClick?: (activity: ScheduledActivity) => void;
}

const AccordionDayCard: React.FC<AccordionDayCardProps> = ({
	activities,
	getActivityDetails,
	onToggleCompletion,
	onActivityClick,
}) => {
	const getPillarBackground = (pillar: string) => {
		const backgrounds = {
			mental: "bg-purple-100",
			physical: "bg-green-100",
			social: "bg-cyan-100",
			environmental: "bg-teal-100",
			instinctual: "bg-amber-100",
		};
		return backgrounds[pillar as keyof typeof backgrounds] || "bg-gray-100";
	};

	const getPillarBorder = (pillar: string) => {
		const borders = {
			mental: "border-purple-200",
			physical: "border-green-200",
			social: "border-cyan-200",
			environmental: "border-teal-200",
			instinctual: "border-amber-200",
		};
		return borders[pillar as keyof typeof borders] || "border-gray-200";
	};

	const getPillarIcon = (pillar: string) => {
		const icons = {
			mental: "M",
			physical: "P",
			social: "S",
			environmental: "E",
			instinctual: "I",
		};
		return icons[pillar as keyof typeof icons] || "A";
	};

	const getPillarIconColor = (pillar: string) => {
		const colors = {
			mental: "bg-purple-500 text-white",
			physical: "bg-green-500 text-white",
			social: "bg-cyan-500 text-white",
			environmental: "bg-teal-500 text-white",
			instinctual: "bg-amber-500 text-white",
		};
		return colors[pillar as keyof typeof colors] || "bg-gray-500 text-white";
	};

	if (activities.length === 0) {
		return (
			<div className="text-center py-6 text-gray-400">
				<Calendar className="w-6 h-6 mx-auto mb-2 opacity-50" />
				<p className="text-sm">No activities planned</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{activities.map((activity) => {
				const activityDetails = getActivityDetails(activity.activityId);
				if (!activityDetails) return null;

				const pillarBg = getPillarBackground(activityDetails.pillar);
				const pillarBorder = getPillarBorder(activityDetails.pillar);
				const pillarIcon = getPillarIcon(activityDetails.pillar);
				const pillarIconColor = getPillarIconColor(activityDetails.pillar);

				return (
					<div
						key={activity.id}
						onClick={() => onActivityClick?.(activity)}
						className={`
              relative p-4 rounded-2xl cursor-pointer transition-all duration-200
              hover:shadow-lg transform hover:scale-[1.02] border-2
              ${pillarBg} ${pillarBorder}
              shadow-sm
            `}
						style={{
							borderRadius: "16px",
							boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
						}}
					>
						{/* Activity Content */}
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4 flex-1">
								{/* Pillar Icon */}
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${pillarIconColor}`}
								>
									{pillarIcon}
								</div>

								{/* Activity Info */}
								<div className="flex-1 min-w-0">
									<h4
										className={`font-bold text-gray-800 truncate text-lg ${
											activity.completed ? "line-through opacity-75" : ""
										}`}
									>
										{activityDetails.title}
									</h4>
									<div className="flex items-center space-x-2 mt-1">
										<Clock className="w-4 h-4 text-gray-600" />
										<span className="text-sm text-gray-700 font-medium">
											{activityDetails.duration}m
										</span>
									</div>
								</div>
							</div>

							{/* Completion Toggle */}
							<button
								onClick={(e) => {
									e.stopPropagation();
									onToggleCompletion(activity.id);
								}}
								className="flex-shrink-0 p-2 rounded-full hover:bg-white/40 transition-colors"
							>
								{activity.completed ? (
									<CheckCircle className="w-7 h-7 text-emerald-600" />
								) : (
									<Circle className="w-7 h-7 text-gray-500" />
								)}
							</button>
						</div>

						{/* Completion Notes */}
						{activity.completed && activity.completionNotes && (
							<div className="mt-4 text-sm text-gray-800 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/50">
								<span className="font-medium">Note:</span> "
								{activity.completionNotes}"
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default AccordionDayCard;

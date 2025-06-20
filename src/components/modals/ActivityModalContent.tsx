import { Clock, Star } from "lucide-react";
import type React from "react";
import DaySelector from "@/components/DaySelector";
import { Badge } from "@/components/ui/badge";
import type {
	ActivityLibraryItem,
	ScheduledActivity,
	UserActivity,
} from "@/types/activity";
import type { DiscoveredActivity } from "@/types/discovery";

interface ActivityModalContentProps {
	activityDetails: ActivityLibraryItem | UserActivity | DiscoveredActivity;
	mode: "scheduled" | "library";
	scheduledActivity?: ScheduledActivity | null;
	selectedDayOfWeek: number;
	onDaySelect: (day: number) => void;
}

const ActivityModalContent: React.FC<ActivityModalContentProps> = ({
	activityDetails,
	mode,
	scheduledActivity,
	selectedDayOfWeek,
	onDaySelect,
}) => {
	const getPillarColor = (pillar: string) => {
		const colors = {
			mental: "bg-purple-100 text-purple-700",
			physical: "bg-emerald-100 text-emerald-700",
			social: "bg-cyan-100 text-cyan-700",
			environmental: "bg-teal-100 text-teal-700",
			instinctual: "bg-orange-100 text-orange-700",
		};
		return colors[pillar as keyof typeof colors] || "bg-gray-100 text-gray-700";
	};

	const getDifficultyStars = (difficulty: string) => {
		const level = difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : 3;
		return Array.from({ length: 3 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${i < level ? "text-yellow-400 fill-current" : "text-gray-300"}`}
			/>
		));
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				<Badge
					className={`${getPillarColor(activityDetails.pillar)} rounded-2xl px-4 py-2 font-semibold`}
				>
					{activityDetails.pillar.charAt(0).toUpperCase() +
						activityDetails.pillar.slice(1)}
				</Badge>
				<div className="flex items-center space-x-1 text-sm text-purple-700 bg-purple-100 rounded-2xl px-3 py-2">
					<Clock className="w-4 h-4" />
					<span>{activityDetails.duration} minutes</span>
				</div>
				<div className="flex items-center space-x-1 bg-cyan-100 rounded-2xl px-3 py-2">
					<span className="text-sm text-cyan-700 mr-1">Difficulty:</span>
					{getDifficultyStars(activityDetails.difficulty)}
				</div>
			</div>

			{mode === "library" && (
				<div className="bg-white/70 rounded-3xl p-4 border border-purple-200">
					<DaySelector
						selectedDayOfWeek={selectedDayOfWeek}
						onDaySelect={onDaySelect}
					/>
				</div>
			)}

			<div className="bg-white/70 rounded-3xl p-6 border border-purple-200">
				<h3 className="text-lg font-semibold text-purple-800 mb-3">Benefits</h3>
				<p className="text-gray-700 leading-relaxed">
					{activityDetails.benefits}
				</p>
			</div>

			<div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
				<h3 className="text-lg font-semibold text-purple-800 mb-3">
					Instructions
				</h3>
				<div className="text-gray-700 leading-relaxed">
					{Array.isArray(activityDetails.instructions) ? (
						<ol className="list-decimal list-inside space-y-1">
							{activityDetails.instructions.map((step, idx) => (
								<li key={idx}>{step}</li>
							))}
						</ol>
					) : typeof activityDetails.instructions === "string" ? (
						<p>{activityDetails.instructions}</p>
					) : null}
				</div>
			</div>

			{activityDetails.materials && activityDetails.materials.length > 0 && (
				<div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
					<h3 className="text-lg font-semibold text-purple-800 mb-3">
						Materials Needed
					</h3>
					<ul className="list-disc list-inside text-gray-700 space-y-1">
						{activityDetails.materials.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>
			)}

			{mode === "scheduled" && scheduledActivity?.notes && (
				<div className="bg-white/70 rounded-3xl p-6 border border-cyan-200">
					<h3 className="text-lg font-semibold text-purple-800 mb-3">Notes</h3>
					<p className="text-gray-700 bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
						{scheduledActivity.notes}
					</p>
				</div>
			)}

			{mode === "scheduled" &&
				scheduledActivity?.completionNotes &&
				scheduledActivity.completed && (
					<div className="bg-white/70 rounded-3xl p-6 border border-emerald-200">
						<h3 className="text-lg font-semibold text-purple-800 mb-3">
							Completion Notes
						</h3>
						<p className="text-gray-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
							{scheduledActivity.completionNotes}
						</p>
					</div>
				)}
		</div>
	);
};

export default ActivityModalContent;

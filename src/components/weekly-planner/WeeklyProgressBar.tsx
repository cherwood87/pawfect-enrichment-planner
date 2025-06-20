import type React from "react";

interface WeeklyProgressBarProps {
	completedActivities: number;
	totalActivities: number;
}

const WeeklyProgressBar: React.FC<WeeklyProgressBarProps> = ({
	completedActivities,
	totalActivities,
}) => {
	const progressPercentage =
		totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

	return (
		<div className="mt-4">
			<div className="w-full bg-purple-100 rounded-full h-4 shadow-inner border border-purple-200">
				<div
					className="bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
					style={{ width: `${progressPercentage}%` }}
				>
					{/* Enhanced animated shine effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
				</div>
			</div>
			<div className="flex justify-between text-sm text-purple-600 mt-2 font-medium">
				<span>Progress</span>
				<span
					className={`font-semibold ${progressPercentage === 100 ? "text-emerald-600" : ""}`}
				>
					{Math.round(progressPercentage)}% Complete
					{progressPercentage === 100 && " 🎉"}
				</span>
			</div>
		</div>
	);
};

export default WeeklyProgressBar;

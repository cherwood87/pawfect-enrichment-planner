import type React from "react";
import { Button } from "@/components/ui/button";

interface DaySelectorProps {
	selectedDayOfWeek: number;
	onDaySelect: (day: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
	selectedDayOfWeek,
	onDaySelect,
}) => {
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-purple-800 text-sm">
				Select Day for Weekly Plan
			</h3>
			<div className="grid grid-cols-7 gap-2">
				{dayNames.map((day, index) => (
					<Button
						key={day}
						variant={selectedDayOfWeek === index ? "default" : "outline"}
						size="sm"
						onClick={() => onDaySelect(index)}
						className={`text-xs rounded-xl transition-all duration-200 ${
							selectedDayOfWeek === index
								? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
								: "border-purple-300 text-purple-700 hover:bg-purple-50"
						}`}
					>
						{day.slice(0, 3)}
					</Button>
				))}
			</div>
		</div>
	);
};

export default DaySelector;

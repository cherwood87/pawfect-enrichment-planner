import type React from "react";
import { COMMON_BEHAVIORS } from "@/constants/journalConstants";

interface BehaviorTrackingSectionProps {
	selectedBehaviors: string[];
	onBehaviorToggle: (behavior: string) => void;
}

const BehaviorTrackingSection: React.FC<BehaviorTrackingSectionProps> = ({
	selectedBehaviors,
	onBehaviorToggle,
}) => {
	return (
		<div className="space-y-3">
			<h3 className="font-medium text-gray-800">Behaviors observed today</h3>
			<div className="flex flex-wrap gap-2">
				{COMMON_BEHAVIORS.map((behavior) => {
					const isSelected = selectedBehaviors.includes(behavior);
					return (
						<button
							key={behavior}
							onClick={() => onBehaviorToggle(behavior)}
							className={`px-3 py-1 rounded-full text-xs border transition-all ${
								isSelected
									? "bg-green-100 border-green-300 text-green-700"
									: "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
							}`}
						>
							{behavior}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default BehaviorTrackingSection;

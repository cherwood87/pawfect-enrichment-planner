import { Plus } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddActivitiesSectionProps {
	currentDog: { name: string };
	onAddActivities: () => void;
}

const AddActivitiesSection: React.FC<AddActivitiesSectionProps> = ({
	currentDog,
	onAddActivities,
}) => {
	const isMobile = useIsMobile();

	return (
		<div className="mobile-card bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
			<div
				className={`flex items-center ${isMobile ? "flex-col space-y-3 text-center" : "space-x-3"}`}
			>
				<Plus
					className={`${isMobile ? "w-6 h-6" : "w-5 h-5"} text-green-600 flex-shrink-0`}
				/>
				<div className={`${isMobile ? "text-center" : "flex-1"}`}>
					<p className="text-sm font-medium text-gray-800">
						Start Enriching {currentDog.name}'s Life
					</p>
					<p className="text-xs text-gray-600">
						Browse our activity library to get started
					</p>
				</div>
				<Button
					size="sm"
					onClick={onAddActivities}
					className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 touch-target flex-shrink-0"
				>
					Add Activities
				</Button>
			</div>
		</div>
	);
};

export default AddActivitiesSection;

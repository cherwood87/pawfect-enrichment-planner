import type React from "react";
import { Button } from "@/components/ui/button";

interface WeeklyPlannerNavigationProps {
	onPreviousWeek: () => void;
	onCurrentWeek: () => void;
	onNextWeek: () => void;
}

const WeeklyPlannerNavigation: React.FC<WeeklyPlannerNavigationProps> = ({
	onPreviousWeek,
	onCurrentWeek,
	onNextWeek,
}) => {
	return (
		<div className="flex items-center justify-between">
			<Button variant="outline" size="sm" onClick={onPreviousWeek}>
				Previous Week
			</Button>
			<Button variant="secondary" size="sm" onClick={onCurrentWeek}>
				Current Week
			</Button>
			<Button variant="outline" size="sm" onClick={onNextWeek}>
				Next Week
			</Button>
		</div>
	);
};

export default WeeklyPlannerNavigation;

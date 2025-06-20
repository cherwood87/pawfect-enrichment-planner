import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useWeeklyPlannerNavigation = () => {
	const navigate = useNavigate();
	const [currentWeekStartDate, setCurrentWeekStartDate] = useState(new Date());

	const goToNextWeek = () => {
		const nextWeekStartDate = new Date(currentWeekStartDate);
		nextWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
		setCurrentWeekStartDate(nextWeekStartDate);
	};

	const goToPreviousWeek = () => {
		const previousWeekStartDate = new Date(currentWeekStartDate);
		previousWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
		setCurrentWeekStartDate(previousWeekStartDate);
	};

	const goToTodayWeek = () => {
		setCurrentWeekStartDate(new Date());
	};

	const navigateToActivityLibrary = (_pillar: string) => {
		navigate("/activity-library");
	};

	return {
		currentWeekStartDate,
		setCurrentWeekStartDate,
		goToNextWeek,
		goToPreviousWeek,
		goToTodayWeek,
		navigateToActivityLibrary,
	};
};

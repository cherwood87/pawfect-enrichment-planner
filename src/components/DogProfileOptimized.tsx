import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDog } from "@/contexts/DogContext";
import type { Dog } from "@/types/dog";
import type { QuizResults } from "@/types/quiz";
import DogAvatarBlock from "./DogAvatarBlock";
import DogProfileDialogs from "./profile/DogProfileDialogs";
import QuizAndGoalsCard from "./profile/QuizAndGoalsCard";

interface DogProfileProps {
	onEditDogOpen: (dog: Dog) => void;
}

const DogProfileOptimized: React.FC<DogProfileProps> = ({ onEditDogOpen }) => {
	const { currentDog, updateDog } = useDog();
	const navigate = useNavigate();
	const [showQuiz, setShowQuiz] = useState(false);
	const [showResults, setShowResults] = useState(false);

	// Memoize callbacks to prevent unnecessary re-renders
	const handleQuizComplete = useCallback(
		(results: QuizResults) => {
			if (currentDog) {
				updateDog({
					...currentDog,
					quizResults: results,
				});
			}
			setShowQuiz(false);
			setShowResults(true);
		},
		[currentDog, updateDog],
	);

	const handleRetakeQuiz = useCallback(() => {
		setShowResults(false);
		setShowQuiz(true);
	}, []);

	const handleCloseResults = useCallback(() => {
		setShowResults(false);
	}, []);

	const handleEditClick = useCallback(() => {
		if (currentDog) {
			onEditDogOpen(currentDog);
		}
	}, [currentDog, onEditDogOpen]);

	const handleAddActivities = useCallback(() => {
		navigate("/activity-library");
	}, [navigate]);

	const handleViewResults = useCallback(() => {
		setShowResults(true);
	}, []);

	const handleCloseQuiz = useCallback(() => {
		setShowQuiz(false);
	}, []);

	// Memoize dialog props to prevent unnecessary re-renders
	const dialogProps = useMemo(
		() => ({
			showQuiz,
			showResults,
			currentDog,
			onQuizComplete: handleQuizComplete,
			onRetakeQuiz: handleRetakeQuiz,
			onCloseQuiz: handleCloseQuiz,
			onCloseResults: handleCloseResults,
			setShowQuiz,
			setShowResults,
		}),
		[
			showQuiz,
			showResults,
			currentDog,
			handleQuizComplete,
			handleRetakeQuiz,
			handleCloseQuiz,
			handleCloseResults,
		],
	);

	// Early return if no dog
	if (!currentDog) {
		return null;
	}

	return (
		<>
			{/* Enhanced Dog Avatar Block */}
			<DogAvatarBlock dog={currentDog} onEditClick={handleEditClick} />

			{/* Quiz and Goals Section */}
			<QuizAndGoalsCard
				currentDog={currentDog}
				onViewResults={handleViewResults}
				onAddActivities={handleAddActivities}
			/>

			{/* Dialogs */}
			<DogProfileDialogs {...dialogProps} />
		</>
	);
};

export default DogProfileOptimized;

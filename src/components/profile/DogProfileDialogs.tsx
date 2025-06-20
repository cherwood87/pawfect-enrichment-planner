import type React from "react";
import DogPersonalityQuiz from "@/components/DogPersonalityQuiz";
import QuizResultsComponent from "@/components/DogProfileQuiz";
import type { Dog } from "@/types/dog";
import type { QuizResults } from "@/types/quiz";

interface DogProfileDialogsProps {
	showQuiz: boolean;
	showResults: boolean;
	currentDog: Dog;
	onQuizComplete: (results: QuizResults) => void;
	onRetakeQuiz: () => void;
	onCloseQuiz: () => void;
	onCloseResults: () => void;
	setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
	setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const DogProfileDialogs: React.FC<DogProfileDialogsProps> = ({
	showQuiz,
	showResults,
	currentDog,
	onQuizComplete,
	onRetakeQuiz,
	onCloseQuiz,
	onCloseResults,
	setShowQuiz,
	setShowResults,
}) => {
	if (showQuiz) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<DogPersonalityQuiz
					dogName={currentDog.name}
					onComplete={onQuizComplete}
					onClose={onCloseQuiz}
				/>
			</div>
		);
	}

	if (showResults && currentDog.quizResults) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
				<QuizResultsComponent
					results={currentDog.quizResults}
					dogName={currentDog.name}
					onRetakeQuiz={onRetakeQuiz}
					onClose={onCloseResults}
				/>
			</div>
		);
	}

	return null;
};

export default DogProfileDialogs;

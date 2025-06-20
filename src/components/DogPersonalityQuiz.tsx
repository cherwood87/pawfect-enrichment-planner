import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { quizQuestions } from "@/data/quizQuestions";
import type { QuizResults } from "@/types/quiz";
import { analyzeQuizResults } from "@/utils/quizAnalysis";

interface DogPersonalityQuizProps {
	dogName: string;
	onComplete: (results: QuizResults) => void;
	onClose: () => void;
}

const DogPersonalityQuiz: React.FC<DogPersonalityQuizProps> = ({
	dogName,
	onComplete,
	onClose,
}) => {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
	const answeredQuestions = Object.keys(answers).length;
	const canProceed = currentQuestion < quizQuestions.length - 1;
	const isLastQuestion = currentQuestion === quizQuestions.length - 1;

	const handleAnswer = (questionId: string, value: string) => {
		setAnswers((prev) => ({ ...prev, [questionId]: value }));
	};

	const handleNext = async () => {
		if (canProceed) {
			setCurrentQuestion((prev) => prev + 1);
		} else {
			// Quiz completed, analyze results
			setIsAnalyzing(true);

			try {
				// Add a small delay to show the analyzing state
				await new Promise((resolve) => setTimeout(resolve, 1500));

				const results = analyzeQuizResults(answers);
				onComplete(results);
			} catch (error) {
				console.error("Error analyzing quiz results:", error);
				setIsAnalyzing(false);
			}
		}
	};

	const handleBack = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion((prev) => prev - 1);
		}
	};

	const currentQuestionData = quizQuestions[currentQuestion];
	const currentAnswer = answers[currentQuestionData.id];

	// Show analyzing state
	if (isAnalyzing) {
		return (
			<Card className="max-w-2xl mx-auto border border-gray-200 shadow-xl rounded-3xl">
				<CardContent className="p-8 text-center">
					<div className="mb-6">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
							<span className="text-2xl">🧠</span>
						</div>
						<h3 className="text-xl font-bold text-gray-800 mb-2">
							Analyzing {dogName}'s Personality...
						</h3>
						<p className="text-sm text-gray-600 mb-4">
							We're processing the quiz results to create personalized
							enrichment recommendations.
						</p>
						<Progress value={100} className="mb-4" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="max-w-2xl mx-auto border border-gray-200 shadow-xl rounded-3xl">
			<CardHeader className="text-center pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-bold text-gray-800">
						{dogName}'s Personality Quiz
					</CardTitle>
					<Button variant="ghost" size="sm" onClick={onClose}>
						✕
					</Button>
				</div>

				<div className="mt-4">
					<div className="flex justify-between text-sm text-gray-600 mb-2">
						<span>
							Question {currentQuestion + 1} of {quizQuestions.length}
						</span>
						<span>{Math.round(progress)}% Complete</span>
					</div>
					<Progress value={progress} className="w-full" />

					{answeredQuestions < quizQuestions.length && (
						<div className="flex items-center justify-center mt-2 text-xs text-gray-500">
							<AlertCircle className="w-3 h-3 mr-1" />
							<span>
								{quizQuestions.length - answeredQuestions} questions remaining
							</span>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<div>
					<h3 className="text-xl font-semibold text-gray-800 mb-6">
						{currentQuestionData.question}
					</h3>

					<RadioGroup
						value={currentAnswer || ""}
						onValueChange={(value) =>
							handleAnswer(currentQuestionData.id, value)
						}
					>
						{currentQuestionData.options.map((option) => (
							<div
								key={option.value}
								className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
							>
								<RadioGroupItem value={option.value} id={option.value} />
								<Label
									htmlFor={option.value}
									className="text-gray-700 cursor-pointer flex-1 leading-relaxed"
								>
									{option.label}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className="flex justify-between pt-4">
					<Button
						variant="outline"
						onClick={handleBack}
						disabled={currentQuestion === 0}
						className="flex items-center space-x-2"
					>
						<ChevronLeft className="w-4 h-4" />
						<span>Back</span>
					</Button>

					<Button
						onClick={handleNext}
						disabled={!currentAnswer}
						className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white flex items-center space-x-2"
					>
						<span>{isLastQuestion ? "Complete Quiz" : "Next"}</span>
						{!isLastQuestion && <ChevronRight className="w-4 h-4" />}
					</Button>
				</div>

				{/* Quiz progress indicator */}
				<div className="pt-2 border-t border-gray-100">
					<div className="flex justify-center space-x-1">
						{quizQuestions.map((_, index) => (
							<div
								key={index}
								className={`w-2 h-2 rounded-full transition-colors ${
									index <= currentQuestion
										? "bg-blue-500"
										: answers[quizQuestions[index].id]
											? "bg-green-500"
											: "bg-gray-200"
								}`}
							/>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default DogPersonalityQuiz;

import {
	Brain,
	RefreshCw,
	Star,
	Target,
	TreePine,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QuizResults } from "@/types/quiz";

interface QuizResultsProps {
	results: QuizResults;
	dogName?: string;
	onRetakeQuiz: () => void;
	onClose: () => void;
}

const QuizResultsComponent: React.FC<QuizResultsProps> = ({
	results,
	dogName = "Your Dog",
	onRetakeQuiz,
	onClose,
}) => {
	const pillarIcons = {
		mental: Brain,
		physical: Zap,
		social: Users,
		environmental: TreePine,
		instinctual: Target,
	};

	const pillarColors = {
		mental: "purple",
		physical: "green",
		social: "blue",
		environmental: "teal",
		instinctual: "orange",
	};

	const pillarNames = {
		mental: "Mental",
		physical: "Physical",
		social: "Social",
		environmental: "Environmental",
		instinctual: "Instinctual",
	};

	const getScorePercentage = (score: number) => {
		const maxScore = 12;
		return Math.min((score / maxScore) * 100, 100);
	};

	const descriptions = {
		mental:
			"Your dog thrives on mental stimulation and problem-solving tasks. Think puzzles, training games, and nosework challenges.",
		physical:
			"Your dog has energy to spare! Activities that engage their body will help with balance, regulation, and joy.",
		social:
			"Your dog seeks social interaction and co-regulation. Look for games where they can connect and interact with dogs or humans.",
		environmental:
			"Your dog is curious about their environment. Exploring different surfaces, spaces, or setups helps them thrive.",
		instinctual:
			"Your dog is driven by natural instincts—sniffing, foraging, chasing. Enrichment should allow for instinct-safe expression.",
	};

	const topPillar = results.ranking[0];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
			<div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
				<Card className="border-none shadow-none">
					<CardHeader className="sticky top-0 z-20 bg-white border-b border-gray-100">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg font-bold text-gray-800">
								Quiz Results
							</CardTitle>
							<Button variant="ghost" size="sm" onClick={onClose}>
								✕
							</Button>
						</div>

						<div className="mt-4">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
								<Trophy className="w-8 h-8 text-white" />
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								{dogName}'s Personality
							</h3>
							<Badge
								variant="secondary"
								className="text-lg px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 text-gray-800"
							>
								{results.personality}
							</Badge>

							{topPillar && (
								<div className="mt-3 flex items-center justify-center text-sm text-gray-600">
									<Star className="w-4 h-4 mr-1 text-yellow-500" />
									<span>
										Strongest in{" "}
										{pillarNames[topPillar.pillar as keyof typeof pillarNames]}{" "}
										enrichment
									</span>
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent className="space-y-6 p-6">
						<div>
							<h4 className="font-medium text-gray-800 mb-4">
								Enrichment Pillar Rankings
							</h4>
							<div className="space-y-3">
								{results.ranking.map((item) => {
									const IconComponent =
										pillarIcons[item.pillar as keyof typeof pillarIcons];
									const color =
										pillarColors[item.pillar as keyof typeof pillarColors];
									const name =
										pillarNames[item.pillar as keyof typeof pillarNames];
									const percentage = getScorePercentage(item.score);
									const description =
										descriptions[item.pillar as keyof typeof descriptions];

									return (
										<div
											key={item.pillar}
											className="flex items-start space-x-4 p-4 rounded-lg bg-white shadow-sm border border-gray-100"
										>
											<div
												className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
											>
												<IconComponent
													className={`w-5 h-5 text-${color}-600`}
												/>
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex justify-between items-center mb-1">
													<span className="text-sm font-semibold text-gray-800">
														{name}
													</span>
													<div className="flex items-center space-x-2">
														<span className="text-xs text-gray-500">
															#{item.rank}
														</span>
														<span className="text-sm text-gray-600">
															{Math.round(percentage)}%
														</span>
													</div>
												</div>
												<div className="text-xs text-gray-600 mb-2 italic">
													{item.reason}
												</div>
												<div className="text-xs text-gray-500 mb-2 leading-relaxed">
													{description}
												</div>
												<div className="w-full bg-gray-100 rounded-full h-2">
													<div
														className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
														style={{ width: `${percentage}%` }}
													></div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h5 className="font-medium text-blue-800 mb-2">What's Next?</h5>
							<p className="text-sm text-blue-700">
								Based on {dogName}'s results, focus on{" "}
								<strong>
									{pillarNames[topPillar?.pillar as keyof typeof pillarNames]}
								</strong>{" "}
								activities to keep them engaged and happy. You can always retake
								this quiz as your dog's preferences change!
							</p>
						</div>

						<div className="flex space-x-3 pt-4">
							<Button
								variant="outline"
								onClick={onRetakeQuiz}
								className="flex-1 flex items-center justify-center space-x-2"
							>
								<RefreshCw className="w-4 h-4" />
								<span>Retake Quiz</span>
							</Button>
							<Button
								onClick={onClose}
								className="flex-1 bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white"
							>
								Save Results
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default QuizResultsComponent;

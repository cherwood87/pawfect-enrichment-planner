import { AlertCircle, Check, Clock, ExternalLink, Star, X } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivity } from "@/contexts/ActivityContext";
import type { DiscoveredActivity } from "@/types/discovery";

interface DiscoveryReviewProps {
	activities: DiscoveredActivity[];
}

const DiscoveryReview: React.FC<DiscoveryReviewProps> = ({ activities }) => {
	const { approveDiscoveredActivity, rejectDiscoveredActivity } = useActivity();

	const pendingActivities = activities.filter(
		(activity) => !activity.approved && !activity.rejected,
	);

	if (pendingActivities.length === 0) {
		return null;
	}

	const getPillarColor = (pillar: string) => {
		const colors = {
			mental: "purple",
			physical: "green",
			social: "blue",
			environmental: "teal",
			instinctual: "orange",
		};
		return colors[pillar as keyof typeof colors] || "gray";
	};

	const getQualityColor = (score: number) => {
		if (score >= 0.8) return "text-green-600";
		if (score >= 0.6) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<AlertCircle className="w-5 h-5 text-blue-500" />
						<CardTitle className="text-lg font-bold text-gray-800">
							New Discoveries Need Review
						</CardTitle>
					</div>
					<Badge variant="secondary" className="bg-blue-100 text-blue-700">
						{pendingActivities.length} pending
					</Badge>
				</div>
				<p className="text-sm text-gray-600">
					Review these automatically discovered activities before adding them to
					your library
				</p>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{pendingActivities.map((activity) => {
						const pillarColor = getPillarColor(activity.pillar);

						return (
							<div
								key={activity.id}
								className="border rounded-lg p-4 bg-gray-50"
							>
								<div className="flex justify-between items-start mb-3">
									<div className="flex-1">
										<div className="flex items-center space-x-2 mb-2">
											<h3 className="font-semibold text-gray-800">
												{activity.title}
											</h3>
											<Badge
												variant="secondary"
												className={`text-xs bg-${pillarColor}-100 text-${pillarColor}-700`}
											>
												{activity.pillar}
											</Badge>
											<Badge variant="secondary" className="text-xs">
												{activity.difficulty}
											</Badge>
										</div>

										<p className="text-sm text-gray-600 mb-3 line-clamp-2">
											{activity.benefits}
										</p>

										<div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
											<div className="flex items-center space-x-1">
												<Clock className="w-3 h-3" />
												<span>{activity.duration} min</span>
											</div>
											<div className="flex items-center space-x-1">
												<Star className="w-3 h-3" />
												<span
													className={getQualityColor(activity.qualityScore)}
												>
													Quality: {Math.round(activity.qualityScore * 100)}%
												</span>
											</div>
											<div className="flex items-center space-x-1">
												<ExternalLink className="w-3 h-3" />
												<a
													href={activity.sourceUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-500 hover:underline"
												>
													Source
												</a>
											</div>
										</div>

										<div className="mb-3">
											<p className="text-xs font-medium text-gray-700 mb-1">
												Materials:
											</p>
											<p className="text-xs text-gray-600">
												{activity.materials.slice(0, 3).join(", ")}
												{activity.materials.length > 3 ? "..." : ""}
											</p>
										</div>
									</div>
								</div>

								<div className="flex justify-end space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => rejectDiscoveredActivity(activity.id)}
										className="text-red-600 border-red-200 hover:bg-red-50"
									>
										<X className="w-4 h-4 mr-1" />
										Reject
									</Button>
									<Button
										size="sm"
										onClick={() => approveDiscoveredActivity(activity.id)}
										className="bg-green-600 hover:bg-green-700 text-white"
									>
										<Check className="w-4 h-4 mr-1" />
										Approve
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
};

export default DiscoveryReview;

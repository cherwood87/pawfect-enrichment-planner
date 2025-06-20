import { Activity, Clock, Database, TrendingUp, Zap } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimizedQueries } from "@/hooks/useOptimizedQueries";

export const QueryPerformanceMonitor: React.FC = () => {
	const { getPerformanceMetrics } = useOptimizedQueries();
	const [metrics, setMetrics] = useState<any>(null);
	const [isVisible, setIsVisible] = useState(false);

	const refreshMetrics = () => {
		const performanceData = getPerformanceMetrics();
		setMetrics(performanceData);
	};

	useEffect(() => {
		refreshMetrics();
		// Auto-refresh every 30 seconds when visible
		const interval = setInterval(() => {
			if (isVisible) {
				refreshMetrics();
			}
		}, 30000);

		return () => clearInterval(interval);
	}, [isVisible, refreshMetrics]);

	if (!isVisible) {
		return (
			<div className="fixed bottom-4 right-4 z-50">
				<Button
					onClick={() => setIsVisible(true)}
					size="sm"
					variant="outline"
					className="bg-white shadow-lg"
				>
					<Activity className="w-4 h-4 mr-2" />
					Performance
				</Button>
			</div>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 w-80">
			<Card className="shadow-lg border-2">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center justify-between text-sm">
						<div className="flex items-center">
							<Zap className="w-4 h-4 mr-2 text-yellow-500" />
							Query Performance
						</div>
						<Button
							onClick={() => setIsVisible(false)}
							size="sm"
							variant="ghost"
							className="h-6 w-6 p-0"
						>
							×
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{/* Cache Performance */}
					<div className="space-y-2">
						<div className="flex items-center text-sm font-medium">
							<Database className="w-3 h-3 mr-2" />
							Cache Performance
						</div>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<div className="text-gray-600">Hit Rate</div>
								<Badge variant="outline" className="text-xs">
									{metrics?.cacheStats?.hitRate
										? `${(metrics.cacheStats.hitRate * 100).toFixed(1)}%`
										: "N/A"}
								</Badge>
							</div>
							<div>
								<div className="text-gray-600">Entries</div>
								<Badge variant="outline" className="text-xs">
									{metrics?.cacheStats?.memoryEntries || 0}
								</Badge>
							</div>
						</div>
					</div>

					{/* Circuit Breaker Status */}
					<div className="space-y-2">
						<div className="flex items-center text-sm font-medium">
							<TrendingUp className="w-3 h-3 mr-2" />
							Circuit Breakers
						</div>
						<div className="space-y-1">
							{metrics?.circuitBreakerStats &&
								Object.entries(metrics.circuitBreakerStats).map(
									([key, stats]: [string, any]) => (
										<div
											key={key}
											className="flex items-center justify-between text-xs"
										>
											<span className="capitalize">
												{key.replace(/([A-Z])/g, " $1").trim()}
											</span>
											<Badge
												variant={
													stats?.state === "CLOSED" ? "default" : "destructive"
												}
												className="text-xs"
											>
												{stats?.state || "Unknown"}
											</Badge>
										</div>
									),
								)}
						</div>
					</div>

					{/* Quick Actions */}
					<div className="flex gap-2 pt-2">
						<Button
							onClick={refreshMetrics}
							size="sm"
							variant="outline"
							className="flex-1 text-xs"
						>
							<Clock className="w-3 h-3 mr-1" />
							Refresh
						</Button>
					</div>

					<div className="text-xs text-gray-500 text-center">
						Auto-refresh: 30s
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

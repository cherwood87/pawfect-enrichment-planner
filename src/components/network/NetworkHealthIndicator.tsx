import { Activity, Database, Signal, Wifi, WifiOff } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNetworkHealth } from "@/hooks/useNetworkHealth";
import { CircuitBreakerState } from "@/services/network/RetryService";

export const NetworkHealthIndicator: React.FC = () => {
	const {
		isOnline,
		isSupabaseConnected,
		connectionStability,
		retryConnection,
		isRecovering,
		canRetry,
		connectionHistory,
		lastChecked,
		circuitBreakerStates,
		cacheStats,
	} = useNetworkHealth();

	const getCircuitBreakerColor = (state: CircuitBreakerState | null) => {
		switch (state) {
			case CircuitBreakerState.CLOSED:
				return "bg-green-500";
			case CircuitBreakerState.HALF_OPEN:
				return "bg-yellow-500";
			case CircuitBreakerState.OPEN:
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getCircuitBreakerText = (state: CircuitBreakerState | null) => {
		switch (state) {
			case CircuitBreakerState.CLOSED:
				return "Healthy";
			case CircuitBreakerState.HALF_OPEN:
				return "Testing";
			case CircuitBreakerState.OPEN:
				return "Failed";
			default:
				return "Unknown";
		}
	};

	const getConnectionQuality = () => {
		const stability = connectionStability;
		if (stability >= 0.9)
			return { label: "Excellent", color: "text-green-600" };
		if (stability >= 0.7) return { label: "Good", color: "text-yellow-600" };
		if (stability >= 0.5) return { label: "Fair", color: "text-orange-600" };
		return { label: "Poor", color: "text-red-600" };
	};

	if (!isOnline) {
		return (
			<Card className="border-red-200 bg-red-50">
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center text-sm text-red-700">
						<WifiOff className="w-4 h-4 mr-2" />
						Offline Mode
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<p className="text-xs text-red-600">Using cached data</p>
					<Button
						onClick={retryConnection}
						disabled={isRecovering}
						size="sm"
						variant="outline"
						className="mt-2 text-xs"
					>
						{isRecovering ? "Checking..." : "Retry"}
					</Button>
				</CardContent>
			</Card>
		);
	}

	const quality = getConnectionQuality();

	return (
		<Card className="border-gray-200">
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center justify-between text-sm">
					<div className="flex items-center">
						<Activity className="w-4 h-4 mr-2" />
						Network Health
					</div>
					{isRecovering && (
						<Activity className="w-3 h-3 animate-spin text-blue-500" />
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0 space-y-2">
				{/* Connection Status */}
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-600">Status:</span>
					<Badge
						variant={isSupabaseConnected ? "default" : "destructive"}
						className="text-xs"
					>
						{isSupabaseConnected ? (
							<>
								<Wifi className="w-3 h-3 mr-1" />
								Connected
							</>
						) : (
							<>
								<WifiOff className="w-3 h-3 mr-1" />
								Disconnected
							</>
						)}
					</Badge>
				</div>

				{/* Connection Quality */}
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-600">Quality:</span>
					<Badge variant="outline" className="text-xs">
						<Signal className="w-3 h-3 mr-1" />
						<span className={quality.color}>{quality.label}</span>
					</Badge>
				</div>

				{/* Connection History Indicator */}
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-600">History:</span>
					<div className="flex space-x-1">
						{connectionHistory.slice(-5).map((connected, index) => (
							<div
								key={index}
								className={`w-2 h-2 rounded-full ${
									connected ? "bg-green-500" : "bg-red-500"
								}`}
								title={connected ? "Connected" : "Disconnected"}
							/>
						))}
					</div>
				</div>

				{/* Circuit Breaker Status */}
				{Object.keys(circuitBreakerStates).length > 0 && (
					<div className="space-y-1">
						<div className="text-xs text-gray-600">Circuit Breakers:</div>
						{Object.entries(circuitBreakerStates).map(([service, state]) => (
							<div key={service} className="flex items-center justify-between">
								<span className="text-xs capitalize">{service}:</span>
								<Badge variant="outline" className="text-xs">
									<div
										className={`w-2 h-2 rounded-full mr-1 ${getCircuitBreakerColor(state as CircuitBreakerState)}`}
									/>
									{getCircuitBreakerText(state as CircuitBreakerState)}
								</Badge>
							</div>
						))}
					</div>
				)}

				{/* Cache Stats */}
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-600">Cache:</span>
					<Badge variant="outline" className="text-xs">
						<Database className="w-3 h-3 mr-1" />
						{cacheStats.memoryEntries} items
					</Badge>
				</div>

				{/* Last Checked */}
				<div className="text-xs text-gray-500">
					Last checked: {lastChecked.toLocaleTimeString()}
				</div>

				{/* Retry Button for failed connections */}
				{!isSupabaseConnected && canRetry && (
					<Button
						onClick={retryConnection}
						disabled={isRecovering}
						size="sm"
						variant="outline"
						className="w-full mt-2 text-xs"
					>
						{isRecovering ? "Reconnecting..." : "Retry Connection"}
					</Button>
				)}
			</CardContent>
		</Card>
	);
};

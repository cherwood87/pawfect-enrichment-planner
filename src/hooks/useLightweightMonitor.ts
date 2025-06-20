import { useEffect, useRef } from "react";

interface LightweightMetrics {
	componentName: string;
	loadTime: number;
	renderCount: number;
}

// Global performance tracking
const performanceMetrics = new Map<string, LightweightMetrics>();

export const useLightweightMonitor = (componentName: string) => {
	const startTimeRef = useRef(performance.now());
	const renderCountRef = useRef(0);

	useEffect(() => {
		renderCountRef.current += 1;
		const loadTime = performance.now() - startTimeRef.current;

		// Update metrics
		performanceMetrics.set(componentName, {
			componentName,
			loadTime,
			renderCount: renderCountRef.current,
		});

		// Only log in development and only if load time is significant or too many renders
		if (process.env.NODE_ENV === "development") {
			if (loadTime > 100) {
				console.warn(
					`🐌 ${componentName} took ${loadTime.toFixed(2)}ms to load`,
				);
			}

			if (renderCountRef.current > 5) {
				console.warn(
					`🔄 ${componentName} has rendered ${renderCountRef.current} times`,
				);
			}
		}
	}, [componentName]);

	return {
		componentName,
		getMetrics: () => performanceMetrics.get(componentName),
		getAllMetrics: () => Array.from(performanceMetrics.values()),
	};
};

// Export performance data for debugging
export const getPerformanceReport = () => {
	return Array.from(performanceMetrics.values()).sort(
		(a, b) => b.loadTime - a.loadTime,
	);
};

// Clear metrics (useful for testing)
export const clearPerformanceMetrics = () => {
	performanceMetrics.clear();
};

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
	componentName: string;
	renderTime: number;
	propsChanged: boolean;
	renderCount: number;
}

export const usePerformanceMonitor = (componentName: string, props: any) => {
	const renderCountRef = useRef(0);
	const previousPropsRef = useRef(props);
	const renderStartRef = useRef(performance.now());

	useEffect(() => {
		renderCountRef.current += 1;
		const renderTime = performance.now() - renderStartRef.current;
		const propsChanged =
			JSON.stringify(previousPropsRef.current) !== JSON.stringify(props);

		if (process.env.NODE_ENV === "development") {
			const metrics: PerformanceMetrics = {
				componentName,
				renderTime,
				propsChanged,
				renderCount: renderCountRef.current,
			};

			if (renderTime > 16) {
				// Log if render took longer than 16ms (60fps)
				console.warn(`🐌 Slow render detected in ${componentName}:`, metrics);
			}

			if (renderCountRef.current % 10 === 0) {
				// Log every 10th render
				console.log(`📊 ${componentName} performance:`, metrics);
			}
		}

		previousPropsRef.current = props;
		renderStartRef.current = performance.now();
	});

	return {
		renderCount: renderCountRef.current,
	};
};

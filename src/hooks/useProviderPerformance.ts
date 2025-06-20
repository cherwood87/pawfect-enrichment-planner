import { useEffect, useRef, useState } from "react";

interface ProviderMetrics {
	loadTime: number;
	errorCount: number;
	rerenderCount: number;
	lastUpdate: number;
}

export const useProviderPerformance = (providerName: string) => {
	const [metrics, setMetrics] = useState<ProviderMetrics>({
		loadTime: 0,
		errorCount: 0,
		rerenderCount: 0,
		lastUpdate: Date.now(),
	});

	const startTimeRef = useRef<number>(Date.now());
	const rerenderCountRef = useRef<number>(0);

	// Track component mount/load time
	useEffect(() => {
		const loadTime = Date.now() - startTimeRef.current;
		console.log(`🚀 ${providerName} Provider loaded in ${loadTime}ms`);

		setMetrics((prev) => ({
			...prev,
			loadTime,
			lastUpdate: Date.now(),
		}));
	}, [providerName]);

	// Track re-renders
	useEffect(() => {
		rerenderCountRef.current += 1;

		if (rerenderCountRef.current > 1) {
			console.log(
				`🔄 ${providerName} Provider re-rendered (${rerenderCountRef.current} times)`,
			);

			setMetrics((prev) => ({
				...prev,
				rerenderCount: rerenderCountRef.current,
				lastUpdate: Date.now(),
			}));
		}
	});

	// Track errors
	const trackError = (error: Error) => {
		console.error(`❌ ${providerName} Provider error:`, error);

		setMetrics((prev) => ({
			...prev,
			errorCount: prev.errorCount + 1,
			lastUpdate: Date.now(),
		}));
	};

	// Performance warnings
	useEffect(() => {
		if (metrics.loadTime > 2000) {
			console.warn(
				`⚠️ ${providerName} Provider took ${metrics.loadTime}ms to load (slow)`,
			);
		}

		if (metrics.rerenderCount > 10) {
			console.warn(
				`⚠️ ${providerName} Provider has re-rendered ${metrics.rerenderCount} times (excessive)`,
			);
		}

		if (metrics.errorCount > 3) {
			console.warn(
				`⚠️ ${providerName} Provider has ${metrics.errorCount} errors (unstable)`,
			);
		}
	}, [metrics, providerName]);

	return {
		metrics,
		trackError,
		isPerformant:
			metrics.loadTime < 1000 &&
			metrics.rerenderCount < 5 &&
			metrics.errorCount === 0,
	};
};

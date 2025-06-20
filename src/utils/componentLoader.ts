import { type ComponentType, lazy } from "react";
import { loadingDiagnosticService } from "@/services/diagnostics/LoadingDiagnosticService";

interface LoadableComponentOptions {
	fallback?: ComponentType;
	delay?: number;
	timeout?: number;
}

// Enhanced lazy loading with better error handling and diagnostic tracking
export const createLoadableComponent = <T extends ComponentType<any>>(
	importFn: () => Promise<{ default: T }>,
	options: LoadableComponentOptions = {},
) => {
	const LazyComponent = lazy(() => {
		const { delay = 0, timeout = 3000 } = options;
		const startTime = performance.now();

		// Get component name from the import function string
		const componentName =
			importFn.toString().match(/import\(['"`](.+?)['"`]\)/)?.[1] ||
			"Unknown Component";

		loadingDiagnosticService.startStage(`Bundle Load: ${componentName}`, {
			timeout,
			delay,
		});

		return Promise.race([
			// Add artificial delay if specified (useful for testing)
			delay > 0
				? new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
						importFn(),
					)
				: importFn(),

			// Reasonable timeout to prevent infinite loading
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Component load timeout")), timeout),
			),
		])
			.then((result) => {
				const loadTime = performance.now() - startTime;

				loadingDiagnosticService.completeStage(
					`Bundle Load: ${componentName}`,
					{
						loadTime,
						success: true,
					},
				);

				loadingDiagnosticService.recordBundleLoad(componentName, loadTime);

				return result;
			})
			.catch((error) => {
				const loadTime = performance.now() - startTime;

				loadingDiagnosticService.failStage(
					`Bundle Load: ${componentName}`,
					error,
				);
				loadingDiagnosticService.recordBundleLoad(
					`${componentName} (failed)`,
					loadTime,
				);

				throw error;
			}) as Promise<{ default: T }>;
	});

	// Add preload capability with diagnostics
	(LazyComponent as any).preload = () => {
		const startTime = performance.now();
		const componentName =
			importFn.toString().match(/import\(['"`](.+?)['"`]\)/)?.[1] ||
			"Unknown Component";

		loadingDiagnosticService.startStage(`Preload: ${componentName}`);

		return importFn()
			.then((result) => {
				const loadTime = performance.now() - startTime;
				loadingDiagnosticService.completeStage(`Preload: ${componentName}`, {
					loadTime,
				});
				loadingDiagnosticService.recordBundleLoad(
					`${componentName} (preload)`,
					loadTime,
				);
				return result;
			})
			.catch((error) => {
				loadingDiagnosticService.failStage(`Preload: ${componentName}`, error);
				throw error;
			});
	};

	return LazyComponent;
};

// Preload multiple components with diagnostics
export const preloadComponents = (components: Array<() => Promise<any>>) => {
	loadingDiagnosticService.startStage("Bulk Preload", {
		componentCount: components.length,
	});

	const startTime = performance.now();

	return Promise.allSettled(components.map((comp) => comp())).then(
		(results) => {
			const loadTime = performance.now() - startTime;
			const successful = results.filter((r) => r.status === "fulfilled").length;
			const failed = results.filter((r) => r.status === "rejected").length;

			loadingDiagnosticService.completeStage("Bulk Preload", {
				loadTime,
				successful,
				failed,
				total: components.length,
			});

			loadingDiagnosticService.recordMetric(
				"Bulk Preload Time",
				loadTime,
				"bundle",
			);

			return results;
		},
	);
};

// Smart preloader based on user interaction with diagnostics
export const createInteractionPreloader = (
	componentLoader: () => Promise<any>,
	triggerEvents: string[] = ["mouseenter", "focus"],
) => {
	let preloaded = false;

	return (element: HTMLElement | null) => {
		if (!element || preloaded) return;

		const preload = () => {
			if (!preloaded) {
				preloaded = true;
				const startTime = performance.now();

				loadingDiagnosticService.startStage("Interaction Preload");

				componentLoader()
					.then(() => {
						const loadTime = performance.now() - startTime;
						loadingDiagnosticService.completeStage("Interaction Preload", {
							loadTime,
						});
						loadingDiagnosticService.recordMetric(
							"Interaction Preload Time",
							loadTime,
							"bundle",
						);
					})
					.catch((error) => {
						loadingDiagnosticService.failStage("Interaction Preload", error);
					});
			}
		};

		triggerEvents.forEach((event) => {
			element.addEventListener(event, preload, { once: true });
		});

		return () => {
			triggerEvents.forEach((event) => {
				element.removeEventListener(event, preload);
			});
		};
	};
};

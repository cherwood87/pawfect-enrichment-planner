import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppProviders from "@/components/app/AppProviders";
import AppRoutes from "@/components/app/AppRoutes";
import LoadingDiagnosticPanel from "@/components/diagnostics/LoadingDiagnosticPanel";
import EnhancedErrorBoundary from "@/components/error/EnhancedErrorBoundary";
import ProductionErrorBoundary from "@/components/error/ProductionErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { createQueryClient } from "@/config/queryClientConfig";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { useDiagnosticTracking } from "@/hooks/useDiagnosticTracking";
import { loadingDiagnosticService } from "@/services/diagnostics/LoadingDiagnosticService";

// Create query client once and memoize it
const queryClient = createQueryClient();

const AppContent: React.FC = () => {
	const { startCustomStage, completeCustomStage } =
		useDiagnosticTracking("AppContent");

	useAppInitialization();

	React.useEffect(() => {
		console.log("[App] Mounting AppContent with optimized providers...");

		// Track app initialization stages
		startCustomStage("Providers Setup");

		// Mark providers as ready after a brief delay
		setTimeout(() => {
			completeCustomStage("Providers Setup");
			startCustomStage("Routes Ready");

			setTimeout(() => {
				completeCustomStage("Routes Ready");
				loadingDiagnosticService.completeStage("App Initialization");
			}, 100);
		}, 50);
	}, [startCustomStage, completeCustomStage]);

	return (
		<ProductionErrorBoundary>
			<EnhancedErrorBoundary
				showDetails={process.env.NODE_ENV === "development"}
			>
				<AppProviders queryClient={queryClient}>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<AppRoutes />
						{process.env.NODE_ENV === "development" && (
							<LoadingDiagnosticPanel />
						)}
					</BrowserRouter>
				</AppProviders>
			</EnhancedErrorBoundary>
		</ProductionErrorBoundary>
	);
};

const App: React.FC = () => {
	const { startCustomStage, completeCustomStage } =
		useDiagnosticTracking("App");

	React.useEffect(() => {
		console.log("[App] Mounting App with provider optimizations...");

		// Start tracking app initialization
		loadingDiagnosticService.startStage("App Initialization", {
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			viewport: `${window.innerWidth}x${window.innerHeight}`,
			environment: process.env.NODE_ENV || "production",
		});

		startCustomStage("App Mount");

		// Complete app mount stage
		setTimeout(() => {
			completeCustomStage("App Mount");
		}, 10);
	}, [startCustomStage, completeCustomStage]);

	return <AppContent />;
};

export default App;

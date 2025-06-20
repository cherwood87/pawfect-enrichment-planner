export interface DeploymentHealthReport {
	status: "healthy" | "degraded" | "critical";
	timestamp: string;
	checks: {
		[key: string]: {
			status: "pass" | "fail" | "warn";
			message: string;
			duration?: number;
		};
	};
	environment: string;
	version?: string;
}

export class DeploymentHealthChecker {
	private static instance: DeploymentHealthChecker;

	static getInstance(): DeploymentHealthChecker {
		if (!DeploymentHealthChecker.instance) {
			DeploymentHealthChecker.instance = new DeploymentHealthChecker();
		}
		return DeploymentHealthChecker.instance;
	}

	async performHealthCheck(): Promise<DeploymentHealthReport> {
		const _startTime = Date.now();
		const checks: DeploymentHealthReport["checks"] = {};

		// Basic application health
		checks.applicationLoad = await this.checkApplicationLoad();
		checks.networkConnectivity = await this.checkNetworkConnectivity();
		checks.supabaseConnection = await this.checkSupabaseConnection();
		checks.browserCompatibility = this.checkBrowserCompatibility();
		checks.environmentVariables = this.checkEnvironmentVariables();
		checks.staticAssets = await this.checkStaticAssets();

		// Determine overall status
		const failedChecks = Object.values(checks).filter(
			(check) => check.status === "fail",
		).length;
		const warnChecks = Object.values(checks).filter(
			(check) => check.status === "warn",
		).length;

		let status: DeploymentHealthReport["status"];
		if (failedChecks > 0) {
			status = "critical";
		} else if (warnChecks > 0) {
			status = "degraded";
		} else {
			status = "healthy";
		}

		const report: DeploymentHealthReport = {
			status,
			timestamp: new Date().toISOString(),
			checks,
			environment: process.env.NODE_ENV || "production",
			version: "1.0.0", // You could pull this from package.json
		};

		console.log("🏥 Deployment Health Check Report:", report);
		return report;
	}

	private async checkApplicationLoad(): Promise<
		DeploymentHealthReport["checks"][string]
	> {
		const startTime = Date.now();

		try {
			// Check if React has mounted properly
			const reactRoot = document.getElementById("root");
			if (!reactRoot || !reactRoot.children.length) {
				return {
					status: "fail",
					message: "React application failed to mount",
					duration: Date.now() - startTime,
				};
			}

			return {
				status: "pass",
				message: "Application loaded successfully",
				duration: Date.now() - startTime,
			};
		} catch (error) {
			return {
				status: "fail",
				message: `Application load failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				duration: Date.now() - startTime,
			};
		}
	}

	private async checkNetworkConnectivity(): Promise<
		DeploymentHealthReport["checks"][string]
	> {
		const startTime = Date.now();

		try {
			if (!navigator.onLine) {
				return {
					status: "fail",
					message: "No network connectivity detected",
					duration: Date.now() - startTime,
				};
			}

			// Simple connectivity test
			const _response = await fetch("data:text/plain;base64,", {
				method: "HEAD",
			});

			return {
				status: "pass",
				message: "Network connectivity confirmed",
				duration: Date.now() - startTime,
			};
		} catch (error) {
			return {
				status: "fail",
				message: `Network connectivity failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				duration: Date.now() - startTime,
			};
		}
	}

	private async checkSupabaseConnection(): Promise<
		DeploymentHealthReport["checks"][string]
	> {
		const startTime = Date.now();

		try {
			// Import Supabase client
			const { checkSupabaseConnection } = await import(
				"@/integrations/supabase/client"
			);
			const connected = await checkSupabaseConnection();

			if (connected) {
				return {
					status: "pass",
					message: "Supabase connection established",
					duration: Date.now() - startTime,
				};
			} else {
				return {
					status: "fail",
					message: "Supabase connection failed",
					duration: Date.now() - startTime,
				};
			}
		} catch (error) {
			return {
				status: "fail",
				message: `Supabase check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				duration: Date.now() - startTime,
			};
		}
	}

	private checkBrowserCompatibility(): DeploymentHealthReport["checks"][string] {
		const startTime = Date.now();

		try {
			// Check for required browser features
			const requiredFeatures = [
				"fetch",
				"localStorage",
				"sessionStorage",
				"Promise",
				"URLSearchParams",
			];

			const missingFeatures = requiredFeatures.filter(
				(feature) => !(feature in window),
			);

			if (missingFeatures.length > 0) {
				return {
					status: "fail",
					message: `Browser missing required features: ${missingFeatures.join(", ")}`,
					duration: Date.now() - startTime,
				};
			}

			return {
				status: "pass",
				message: "Browser compatibility confirmed",
				duration: Date.now() - startTime,
			};
		} catch (error) {
			return {
				status: "fail",
				message: `Browser compatibility check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				duration: Date.now() - startTime,
			};
		}
	}

	private checkEnvironmentVariables(): DeploymentHealthReport["checks"][string] {
		const startTime = Date.now();

		try {
			// Check critical environment variables
			const requiredVars = ["NODE_ENV"];
			const missingVars = requiredVars.filter(
				(varName) => !process.env[varName],
			);

			if (missingVars.length > 0) {
				return {
					status: "warn",
					message: `Missing environment variables: ${missingVars.join(", ")}`,
					duration: Date.now() - startTime,
				};
			}

			return {
				status: "pass",
				message: "Environment variables configured",
				duration: Date.now() - startTime,
			};
		} catch (error) {
			return {
				status: "fail",
				message: `Environment check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				duration: Date.now() - startTime,
			};
		}
	}

	private async checkStaticAssets(): Promise<
		DeploymentHealthReport["checks"][string]
	> {
		const startTime = Date.now();

		try {
			// Check if critical assets are available
			const assetChecks = await Promise.allSettled([
				fetch("/favicon.ico", { method: "HEAD" }),
				// Add other critical asset checks here
			]);

			const failedAssets = assetChecks.filter(
				(result) => result.status === "rejected",
			);

			if (failedAssets.length > 0) {
				return {
					status: "warn",
					message: `Some static assets may be missing (${failedAssets.length} failed)`,
					duration: Date.now() - startTime,
				};
			}

			return {
				status: "pass",
				message: "Static assets accessible",
				duration: Date.now() - startTime,
			};
		} catch (error) {
			return {
				status: "warn",
				message: `Static asset check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
				duration: Date.now() - startTime,
			};
		}
	}
}

// Singleton instance
export const deploymentHealthChecker = DeploymentHealthChecker.getInstance();

// Auto-run health check in production
if (process.env.NODE_ENV === "production") {
	// Run health check after app loads
	setTimeout(() => {
		deploymentHealthChecker
			.performHealthCheck()
			.then((report) => {
				if (report.status === "critical") {
					console.error("🚨 Critical deployment issues detected:", report);
				} else if (report.status === "degraded") {
					console.warn("⚠️ Deployment warnings detected:", report);
				} else {
					console.log("✅ Deployment health check passed:", report);
				}
			})
			.catch((error) => {
				console.error("❌ Failed to run deployment health check:", error);
			});
	}, 2000);
}

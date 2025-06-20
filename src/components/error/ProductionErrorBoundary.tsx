import { AlertTriangle, Home, Mail, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
	isRetrying: boolean;
}

class ProductionErrorBoundary extends Component<Props, State> {
	private retryCount = 0;
	private maxRetries = 3;

	public state: State = {
		hasError: false,
		isRetrying: false,
	};

	public static getDerivedStateFromError(error: Error): Partial<State> {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(
			"🚨 Production Error Boundary caught an error:",
			error,
			errorInfo,
		);

		this.setState({ errorInfo });

		// Send error to monitoring service in production
		if (process.env.NODE_ENV === "production") {
			this.reportError(error, errorInfo);
		}
	}

	private reportError = async (error: Error, errorInfo: ErrorInfo) => {
		try {
			// Log error for debugging
			console.error("Production Error Report:", {
				message: error.message,
				stack: error.stack,
				componentStack: errorInfo.componentStack,
				timestamp: new Date().toISOString(),
				url: window.location.href,
				userAgent: navigator.userAgent,
			});

			// In a real production app, you would send this to your error tracking service
			// Example: Sentry, LogRocket, Bugsnag, etc.
		} catch (reportingError) {
			console.error("Failed to report error:", reportingError);
		}
	};

	private handleRetry = () => {
		if (this.retryCount >= this.maxRetries) {
			console.warn("Maximum retry attempts reached");
			return;
		}

		this.setState({ isRetrying: true });
		this.retryCount++;

		setTimeout(() => {
			this.setState({
				hasError: false,
				error: undefined,
				errorInfo: undefined,
				isRetrying: false,
			});
		}, 1000);
	};

	private handleReload = () => {
		window.location.reload();
	};

	private handleGoHome = () => {
		window.location.href = "/";
	};

	public render() {
		if (this.state.hasError) {
			const canRetry = this.retryCount < this.maxRetries;

			return (
				<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
					<Card className="w-full max-w-lg">
						<CardHeader className="text-center">
							<div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
								<AlertTriangle className="w-8 h-8 text-red-600" />
							</div>
							<CardTitle className="text-2xl text-gray-900">
								Something went wrong
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-gray-600 text-center">
								We're sorry, but an unexpected error occurred. Our team has been
								notified and is working to fix this issue.
							</p>

							{process.env.NODE_ENV === "development" && this.state.error && (
								<div className="bg-gray-100 p-3 rounded-lg text-sm">
									<p className="font-semibold text-red-700">Error Details:</p>
									<p className="text-gray-700 mt-1">
										{this.state.error.message}
									</p>
								</div>
							)}

							<div className="flex flex-col gap-3">
								{canRetry && (
									<Button
										onClick={this.handleRetry}
										disabled={this.state.isRetrying}
										className="w-full"
									>
										<RefreshCw
											className={`w-4 h-4 mr-2 ${this.state.isRetrying ? "animate-spin" : ""}`}
										/>
										{this.state.isRetrying
											? "Retrying..."
											: `Try Again (${this.maxRetries - this.retryCount} attempts left)`}
									</Button>
								)}

								<Button
									onClick={this.handleReload}
									variant="outline"
									className="w-full"
								>
									<RefreshCw className="w-4 h-4 mr-2" />
									Reload Page
								</Button>

								<Button
									onClick={this.handleGoHome}
									variant="outline"
									className="w-full"
								>
									<Home className="w-4 h-4 mr-2" />
									Go to Homepage
								</Button>
							</div>

							<div className="pt-4 border-t text-center">
								<p className="text-sm text-gray-500 mb-2">
									If this problem persists, please contact support:
								</p>
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										(window.location.href =
											"mailto:support@beyondbusy.app?subject=Website Error Report")
									}
								>
									<Mail className="w-4 h-4 mr-2" />
									Contact Support
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ProductionErrorBoundary;

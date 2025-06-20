import { AlertTriangle, RefreshCw } from "lucide-react";
import {
	Component,
	type ComponentType,
	type ErrorInfo,
	type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";

interface Props {
	children: ReactNode;
	fallbackComponent?: ComponentType;
	componentName?: string;
}

interface State {
	hasError: boolean;
	error: Error | null;
	isRetrying: boolean;
}

class LazyLoadErrorBoundary extends Component<Props, State> {
	private retryTimeoutId: NodeJS.Timeout | null = null;

	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			isRetrying: false,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		// Check if this is a lazy loading timeout error
		const isLazyLoadError =
			error.message.includes("Component load timeout") ||
			error.message.includes("Loading chunk") ||
			error.message.includes("Failed to fetch");

		if (isLazyLoadError) {
			console.error("Lazy loading error detected:", error.message);
			return {
				hasError: true,
				error,
			};
		}

		// Let other error boundaries handle non-lazy loading errors
		throw error;
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("LazyLoadErrorBoundary caught error:", error, errorInfo);
	}

	componentWillUnmount() {
		if (this.retryTimeoutId) {
			clearTimeout(this.retryTimeoutId);
		}
	}

	private handleRetry = () => {
		this.setState({ isRetrying: true });

		// Give a brief delay before retrying to allow network recovery
		this.retryTimeoutId = setTimeout(() => {
			this.setState({
				hasError: false,
				error: null,
				isRetrying: false,
			});
		}, 1000);
	};

	private handleReload = () => {
		window.location.reload();
	};

	render() {
		if (this.state.hasError && !this.state.isRetrying) {
			// Use custom fallback if provided
			if (this.props.fallbackComponent) {
				const FallbackComponent = this.props.fallbackComponent;
				return <FallbackComponent />;
			}

			// Default lazy load error UI
			return (
				<div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-orange-200">
						<div className="mb-4">
							<AlertTriangle className="w-12 h-12 text-orange-500 mx-auto" />
						</div>
						<h2 className="text-xl font-bold text-gray-900 mb-2">
							Loading Failed
						</h2>
						<p className="text-gray-600 mb-1">
							{this.props.componentName
								? `Unable to load ${this.props.componentName}`
								: "Unable to load this page"}
						</p>
						<p className="text-sm text-gray-500 mb-6">
							This might be due to a slow connection or temporary issue.
						</p>
						<div className="space-y-3">
							<Button
								onClick={this.handleRetry}
								className="w-full bg-orange-600 hover:bg-orange-700 text-white"
								disabled={this.state.isRetrying}
							>
								<RefreshCw
									className={`w-4 h-4 mr-2 ${this.state.isRetrying ? "animate-spin" : ""}`}
								/>
								{this.state.isRetrying ? "Retrying..." : "Try Again"}
							</Button>
							<Button
								onClick={this.handleReload}
								variant="outline"
								className="w-full"
							>
								Reload Page
							</Button>
						</div>
					</div>
				</div>
			);
		}

		if (this.state.isRetrying) {
			return (
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
					<div className="text-center space-y-4">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div>
						<p className="text-orange-700 font-medium">Retrying...</p>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default LazyLoadErrorBoundary;

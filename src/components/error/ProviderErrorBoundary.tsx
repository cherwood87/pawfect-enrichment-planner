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
	providerName: string;
	fallback?: ComponentType;
	critical?: boolean;
}

interface State {
	hasError: boolean;
	error: Error | null;
	isRetrying: boolean;
}

class ProviderErrorBoundary extends Component<Props, State> {
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
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(
			`${this.props.providerName} Provider Error:`,
			error,
			errorInfo,
		);
	}

	componentWillUnmount() {
		if (this.retryTimeoutId) {
			clearTimeout(this.retryTimeoutId);
		}
	}

	private handleRetry = () => {
		this.setState({ isRetrying: true });

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
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent />;
			}

			// For critical providers, show full-screen error
			if (this.props.critical) {
				return (
					<div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
						<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center border border-red-200">
							<div className="mb-4">
								<AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
							</div>
							<h2 className="text-xl font-bold text-gray-900 mb-2">
								{this.props.providerName} Error
							</h2>
							<p className="text-gray-600 mb-1">
								Critical system component failed to load
							</p>
							<p className="text-sm text-gray-500 mb-6">
								{this.state.error?.message}
							</p>
							<div className="space-y-3">
								<Button
									onClick={this.handleRetry}
									className="w-full bg-red-600 hover:bg-red-700 text-white"
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
									Reload Application
								</Button>
							</div>
						</div>
					</div>
				);
			}

			// For non-critical providers, show minimal inline error
			return (
				<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<div className="flex items-center space-x-2">
						<AlertTriangle className="w-5 h-5 text-yellow-600" />
						<div className="flex-1">
							<p className="text-sm font-medium text-yellow-800">
								{this.props.providerName} temporarily unavailable
							</p>
							<p className="text-xs text-yellow-600 mt-1">
								Some features may be limited
							</p>
						</div>
						<Button
							onClick={this.handleRetry}
							size="sm"
							variant="outline"
							className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
						>
							Retry
						</Button>
					</div>
				</div>
			);
		}

		if (this.state.isRetrying) {
			return (
				<div className="flex items-center justify-center p-4">
					<div className="text-center space-y-2">
						<div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-500 mx-auto"></div>
						<p className="text-sm text-gray-600">
							Reconnecting {this.props.providerName}...
						</p>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ProviderErrorBoundary;

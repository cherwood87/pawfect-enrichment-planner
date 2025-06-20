export interface RetryOptions {
	maxAttempts: number;
	baseDelay: number;
	maxDelay: number;
	backoffFactor: number;
	timeout?: number;
}

export interface CircuitBreakerOptions {
	failureThreshold: number;
	recoveryTimeout: number;
	monitoringPeriod: number;
}

export enum CircuitBreakerState {
	CLOSED = "closed",
	OPEN = "open",
	HALF_OPEN = "half_open",
}

export class CircuitBreaker {
	private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
	private failureCount = 0;
	private lastFailureTime = 0;
	private successCount = 0;

	constructor(private options: CircuitBreakerOptions) {}

	async execute<T>(operation: () => Promise<T>): Promise<T> {
		if (this.state === CircuitBreakerState.OPEN) {
			if (Date.now() - this.lastFailureTime < this.options.recoveryTimeout) {
				throw new Error("Circuit breaker is OPEN");
			}
			this.state = CircuitBreakerState.HALF_OPEN;
			this.successCount = 0;
		}

		try {
			const result = await operation();
			this.onSuccess();
			return result;
		} catch (error) {
			this.onFailure();
			throw error;
		}
	}

	private onSuccess() {
		this.failureCount = 0;

		if (this.state === CircuitBreakerState.HALF_OPEN) {
			this.successCount++;
			if (this.successCount >= 3) {
				// Require 3 successes to close
				this.state = CircuitBreakerState.CLOSED;
			}
		}
	}

	private onFailure() {
		this.failureCount++;
		this.lastFailureTime = Date.now();

		if (this.failureCount >= this.options.failureThreshold) {
			this.state = CircuitBreakerState.OPEN;
		}
	}

	getState(): CircuitBreakerState {
		return this.state;
	}
}

export class RetryService {
	private static circuitBreakers = new Map<string, CircuitBreaker>();

	static async executeWithRetry<T>(
		operation: () => Promise<T>,
		options: RetryOptions = {
			maxAttempts: 3,
			baseDelay: 1000,
			maxDelay: 10000,
			backoffFactor: 2,
		},
		circuitBreakerKey?: string,
	): Promise<T> {
		// Use circuit breaker if key provided
		if (circuitBreakerKey) {
			const circuitBreaker = RetryService.getCircuitBreaker(circuitBreakerKey);
			return circuitBreaker.execute(() =>
				RetryService.retryOperation(operation, options),
			);
		}

		return RetryService.retryOperation(operation, options);
	}

	private static async retryOperation<T>(
		operation: () => Promise<T>,
		options: RetryOptions,
	): Promise<T> {
		let lastError: Error;

		for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
			try {
				// Add timeout if specified
				if (options.timeout) {
					return await Promise.race([
						operation(),
						new Promise<never>((_, reject) =>
							setTimeout(
								() => reject(new Error("Operation timeout")),
								options.timeout,
							),
						),
					]);
				}

				return await operation();
			} catch (error) {
				lastError = error as Error;

				console.warn(
					`Attempt ${attempt}/${options.maxAttempts} failed:`,
					error,
				);

				// Don't retry on the last attempt
				if (attempt === options.maxAttempts) {
					break;
				}

				// Calculate delay with exponential backoff
				const delay = Math.min(
					options.baseDelay * options.backoffFactor ** (attempt - 1),
					options.maxDelay,
				);

				// Add jitter to prevent thundering herd
				const jitter = Math.random() * 0.1 * delay;
				const totalDelay = delay + jitter;

				console.log(`Retrying in ${totalDelay.toFixed(0)}ms...`);
				await new Promise((resolve) => setTimeout(resolve, totalDelay));
			}
		}

		throw lastError!;
	}

	private static getCircuitBreaker(key: string): CircuitBreaker {
		if (!RetryService.circuitBreakers.has(key)) {
			RetryService.circuitBreakers.set(
				key,
				new CircuitBreaker({
					failureThreshold: 5,
					recoveryTimeout: 30000, // 30 seconds
					monitoringPeriod: 60000, // 1 minute
				}),
			);
		}
		return RetryService.circuitBreakers.get(key)!;
	}

	static getCircuitBreakerState(key: string): CircuitBreakerState | null {
		const breaker = RetryService.circuitBreakers.get(key);
		return breaker ? breaker.getState() : null;
	}
}

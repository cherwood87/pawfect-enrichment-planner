export class AppError extends Error {
  public readonly code: string;
  public readonly context?: any;

  constructor(message: string, code: string, context?: any) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.context = context;
  }
}

export const handleError = (
  error: Error,
  context?: any,
  shouldThrow: boolean = true,
): void => {
  console.error("Error handled:", {
    message: error.message,
    stack: error.stack,
    context,
  });

  if (shouldThrow) {
    throw error;
  }
};

export const getUserFriendlyMessage = (error: any): string => {
  if (error?.message?.includes("Invalid login credentials")) {
    return "Invalid email or password. Please check your credentials and try again.";
  }

  if (error?.message?.includes("User already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (
    error?.message?.includes("network") ||
    error?.message?.includes("fetch")
  ) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (error?.message?.includes("Email not confirmed")) {
    return "Please check your email and click the confirmation link before signing in.";
  }

  return error?.message || "An unexpected error occurred. Please try again.";
};

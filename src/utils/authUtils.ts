import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
	try {
		// Remove standard auth tokens
		localStorage.removeItem("supabase.auth.token");

		// Remove all Supabase auth keys from localStorage
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
				localStorage.removeItem(key);
			}
		});

		// Remove from sessionStorage if in use
		Object.keys(sessionStorage || {}).forEach((key) => {
			if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
				sessionStorage.removeItem(key);
			}
		});

		console.log("🧹 Auth state cleaned up");
	} catch (error) {
		console.warn("⚠️ Error cleaning auth state:", error);
	}
};

export const robustSignOut = async (): Promise<{ error: any }> => {
	try {
		console.log("👋 Starting robust sign out process");

		// Clean up first
		cleanupAuthState();

		// Attempt global sign out with timeout
		const signOutPromise = supabase.auth.signOut({ scope: "global" });
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(() => reject(new Error("Sign out timeout")), 5000),
		);

		try {
			await Promise.race([signOutPromise, timeoutPromise]);
			console.log("✅ Sign out completed successfully");
		} catch (error) {
			console.warn("⚠️ Sign out timeout or error, but continuing:", error);
			// Continue even if sign out fails - cleanup is more important
		}

		return { error: null };
	} catch (error) {
		console.error("❌ Robust sign out failed:", error);
		return { error };
	}
};

export const robustSignIn = async (
	email: string,
	password: string,
): Promise<{ data?: any; error: any }> => {
	try {
		console.log("🔑 Starting robust sign in process for:", email);

		// Clean up existing state first
		cleanupAuthState();

		// Attempt to sign out any existing sessions
		try {
			await supabase.auth.signOut({ scope: "global" });
		} catch (err) {
			console.warn("⚠️ Pre-signin cleanup failed, continuing:", err);
		}

		// Sign in with timeout
		const signInPromise = supabase.auth.signInWithPassword({ email, password });
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(() => reject(new Error("Sign in timeout")), 10000),
		);

		const result = (await Promise.race([signInPromise, timeoutPromise])) as any;

		if (result.error) {
			console.error("❌ Sign in error:", result.error);
			return { error: result.error };
		}

		console.log("✅ Sign in successful");
		return { data: result.data, error: null };
	} catch (error) {
		console.error("❌ Robust sign in failed:", error);
		return { error };
	}
};

export const robustSignUp = async (
	email: string,
	password: string,
): Promise<{ data?: any; error: any }> => {
	try {
		console.log("📝 Starting robust sign up process for:", email);

		// Clean up existing state first
		cleanupAuthState();

		// Sign up with timeout
		const signUpPromise = supabase.auth.signUp({ email, password });
		const timeoutPromise = new Promise((_, reject) =>
			setTimeout(() => reject(new Error("Sign up timeout")), 10000),
		);

		const result = (await Promise.race([signUpPromise, timeoutPromise])) as any;

		if (result.error) {
			console.error("❌ Sign up error:", result.error);
			return { error: result.error };
		}

		console.log("✅ Sign up successful");
		return { data: result.data, error: null };
	} catch (error) {
		console.error("❌ Robust sign up failed:", error);
		return { error };
	}
};

// Enhanced connection validation
export const validateConnection = async (): Promise<boolean> => {
	try {
		const { data, error } = await supabase.from("dogs").select("id").limit(1);

		if (error?.message.includes("row-level security")) {
			// RLS error means we're connected but not authenticated
			return true;
		}

		return !error;
	} catch (error) {
		console.warn("🌐 Connection validation failed:", error);
		return false;
	}
};

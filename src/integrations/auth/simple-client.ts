/**
 * Simple Auth Client
 * Replaces better-auth client with direct API calls to Supabase
 */

const AUTH_TOKEN_KEY = "cvcraft_auth_token";

export const simpleAuthClient = {
	async signUp(data: { name: string; email: string; username: string; password: string }) {
		const response = await fetch("/api/simple-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "signup", ...data }),
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Signup failed");
		}

		// Cookie is set by server via Set-Cookie header (HttpOnly)
		// No need to set it client-side
		return result;
	},

	async signIn(data: { identifier: string; password: string }) {
		const response = await fetch("/api/simple-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "signin", ...data }),
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Sign in failed");
		}

		// Cookie is set by server via Set-Cookie header (HttpOnly)
		// No need to set it client-side
		return result;
	},

	async signOut() {
		// Server will clear the HttpOnly cookie
		await fetch("/api/simple-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "signout" }),
			credentials: "include",
		});
	},

	async forgotPassword(email: string) {
		const response = await fetch("/api/simple-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "forgot-password", email }),
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Password reset failed");
		}

		return result;
	},

	async resetPassword(token: string, password: string) {
		const response = await fetch("/api/simple-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "reset-password", token, password }),
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Password reset failed");
		}

		return result;
	},

	async getSession() {
		// Session is managed via HttpOnly cookie
		// Make request to get session data
		const response = await fetch("/api/simple-auth", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "get-session" }),
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			return { session: null };
		}

		return result;
	},

	getToken() {
		// Token is in HttpOnly cookie, not accessible from JavaScript
		// This method is kept for compatibility but returns undefined
		return undefined;
	},
};

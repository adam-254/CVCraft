/**
 * Auth Client - Compatibility Layer
 * Provides better-auth-like interface using simple auth client
 */

import { useQuery } from '@tanstack/react-query';
import { simpleAuthClient } from "./simple-client";

// Stub auth client for compatibility with existing code
// Most features redirect to simple auth or are not yet implemented
export const authClient = {
	// Session management
	async getSession() {
		const result = await simpleAuthClient.getSession();
		return { data: result.session, error: null };
	},

	// React hook for session
	useSession() {
		return useQuery({
			queryKey: ['session'],
			queryFn: async () => {
				const result = await simpleAuthClient.getSession();
				return result.session;
			},
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: true,
		});
	},

	async signOut() {
		await simpleAuthClient.signOut();
		// Don't do hard redirect - let the caller handle navigation
		// This allows proper router invalidation before navigation
	},

	// Sign up/in - handled by auth pages directly
	signUp: {
		email: async () => {
			console.warn("Use simpleAuthClient.signUp() instead");
			return { error: new Error("Not implemented - use register page") };
		},
	},

	signIn: {
		email: async () => {
			console.warn("Use simpleAuthClient.signIn() instead");
			return { error: new Error("Not implemented - use login page") };
		},
		username: async () => {
			console.warn("Use simpleAuthClient.signIn() instead");
			return { error: new Error("Not implemented - use login page") };
		},
		social: async () => {
			return { error: new Error("Social auth not yet implemented") };
		},
	},

	// Password reset
	async requestPasswordReset() {
		console.warn("Use simpleAuthClient.forgotPassword() instead");
		return { error: new Error("Not implemented - use forgot password page") };
	},

	async resetPassword() {
		console.warn("Use simpleAuthClient.resetPassword() instead");
		return { error: new Error("Not implemented - use reset password page") };
	},

	// 2FA - not yet implemented
	twoFactor: {
		enable: async () => {
			return { error: new Error("2FA not yet implemented") };
		},
		disable: async () => {
			return { error: new Error("2FA not yet implemented") };
		},
		verify: async () => {
			return { error: new Error("2FA not yet implemented") };
		},
	},

	// Passkeys - not yet implemented
	passkey: {
		register: async () => {
			return { error: new Error("Passkeys not yet implemented") };
		},
		authenticate: async () => {
			return { error: new Error("Passkeys not yet implemented") };
		},
	},

	// API Keys - not yet implemented
	apiKey: {
		create: async () => {
			return { error: new Error("API keys not yet implemented") };
		},
		list: async () => {
			return { data: [], error: null };
		},
		delete: async () => {
			return { error: new Error("API keys not yet implemented") };
		},
	},

	// Account management - not yet implemented
	async changePassword() {
		return { error: new Error("Change password not yet implemented") };
	},

	async changeEmail() {
		return { error: new Error("Change email not yet implemented") };
	},

	async updateUser() {
		return { error: new Error("Update user not yet implemented") };
	},

	// Social accounts - not yet implemented
	async linkAccount() {
		return { error: new Error("Link account not yet implemented") };
	},

	async unlinkAccount() {
		return { error: new Error("Unlink account not yet implemented") };
	},
};

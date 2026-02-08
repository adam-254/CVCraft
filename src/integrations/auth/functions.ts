import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { simpleAuthClient } from "./simple-client";
import type { AuthSession } from "./types";

const AUTH_TOKEN_KEY = 'cvcraft_auth_token';

export const getSession = createIsomorphicFn()
	.client(async (): Promise<AuthSession | null> => {
		const { session } = await simpleAuthClient.getSession();
		return session;
	})
	.server(async (): Promise<AuthSession | null> => {
		// Get token from cookie on server side
		const token = getCookie(AUTH_TOKEN_KEY);
		
		if (!token) {
			return null;
		}

		try {
			// Fetch session from API
			const response = await fetch(`${process.env.APP_URL || 'http://localhost:3000'}/api/simple-auth`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'get-session', token }),
			});

			const result = await response.json();
			return result.session || null;
		} catch (error) {
			console.error('Server-side session fetch error:', error);
			return null;
		}
	});

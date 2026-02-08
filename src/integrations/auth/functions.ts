import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { supabase } from "../supabase/client";
import { simpleAuthClient } from "./simple-client";
import type { AuthSession } from "./types";

const AUTH_TOKEN_KEY = "cvcraft_auth_token";

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
			// Query session directly from database on server side
			const { data: sessionData, error } = await supabase
				.from("session")
				.select(`
					*,
					user:user_id (
						id,
						name,
						email,
						username,
						display_username,
						email_verified,
						image,
						two_factor_enabled,
						created_at,
						updated_at
					)
				`)
				.eq("token", token)
				.gte("expires_at", new Date().toISOString())
				.single();

			if (error || !sessionData || !sessionData.user) {
				return null;
			}

			// Transform to match AuthSession type
			return {
				session: {
					id: sessionData.id,
					userId: sessionData.user_id,
					token: sessionData.token,
					expiresAt: new Date(sessionData.expires_at),
					ipAddress: sessionData.ip_address,
					userAgent: sessionData.user_agent,
					createdAt: new Date(sessionData.created_at),
					updatedAt: new Date(sessionData.updated_at),
				},
				user: {
					id: sessionData.user.id,
					name: sessionData.user.name,
					email: sessionData.user.email,
					username: sessionData.user.username,
					displayUsername: sessionData.user.display_username,
					emailVerified: sessionData.user.email_verified,
					image: sessionData.user.image,
					twoFactorEnabled: sessionData.user.two_factor_enabled,
					createdAt: new Date(sessionData.user.created_at),
					updatedAt: new Date(sessionData.user.updated_at),
				},
			};
		} catch (error) {
			console.error("Server-side session fetch error:", error);
			return null;
		}
	});

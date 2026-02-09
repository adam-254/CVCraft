import { ORPCError, os } from "@orpc/server";
import type { User } from "better-auth";
import { eq } from "drizzle-orm";
import { env } from "@/utils/env";
import type { Locale } from "@/utils/locale";
import { db } from "../drizzle/client";
import { user } from "../drizzle/schema";
import { supabase } from "../supabase/client";

interface ORPCContext {
	locale: Locale;
	reqHeaders?: Headers;
}

async function getUserFromHeaders(headers: Headers): Promise<User | null> {
	try {
		// First try Bearer token authentication
		const authHeader = headers.get("authorization");
		if (authHeader?.startsWith("Bearer ")) {
			const token = authHeader.substring(7); // Remove 'Bearer ' prefix

			// Verify the JWT token with Supabase
			const {
				data: { user: supabaseUser },
				error,
			} = await supabase.auth.getUser(token);

			if (!error && supabaseUser) {
				// Get the user from our database
				const [userResult] = await db.select().from(user).where(eq(user.id, supabaseUser.id)).limit(1);
				if (userResult) return userResult;
			}
		}

		// Fallback to cookie-based authentication
		const cookieHeader = headers.get("cookie");
		if (!cookieHeader) return null;

		// Parse cookies to find the auth token
		const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
			const [key, value] = cookie.trim().split('=');
			if (key && value) {
				acc[key] = decodeURIComponent(value);
			}
			return acc;
		}, {} as Record<string, string>);

		const authToken = cookies['cvcraft_auth_token'];
		if (!authToken) return null;

		// Query session from database using the token
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
			.eq("token", authToken)
			.gte("expires_at", new Date().toISOString())
			.single();

		if (error || !sessionData || !sessionData.user) {
			return null;
		}

		// Return the user data
		return {
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
		} as User;
	} catch (error) {
		console.error("Authentication error:", error);
		return null;
	}
}

async function getUserFromApiKey(_apiKey: string): Promise<User | null> {
	try {
		// API key verification not yet implemented with Supabase
		// TODO: Implement API key verification
		console.warn("API key verification not yet implemented");
		return null;
	} catch {
		return null;
	}
}

const base = os.$context<ORPCContext>();

export const publicProcedure = base.use(async ({ context, next }) => {
	const headers = context.reqHeaders ?? new Headers();
	const apiKey = headers.get("x-api-key");

	const user = apiKey ? await getUserFromApiKey(apiKey) : await getUserFromHeaders(headers);

	return next({
		context: {
			...context,
			user: user ?? null,
		},
	});
});

export const protectedProcedure = publicProcedure.use(async ({ context, next }) => {
	if (!context.user) throw new ORPCError("UNAUTHORIZED");

	return next({
		context: {
			...context,
			user: context.user,
		},
	});
});

/**
 * Server-only procedure that can only be called from server-side code (e.g., loaders).
 * Rejects requests from the browser with a 401 UNAUTHORIZED error.
 */
export const serverOnlyProcedure = publicProcedure.use(async ({ context, next }) => {
	const headers = context.reqHeaders ?? new Headers();

	// Check for the custom header that indicates this is a server-side call
	// Server-side calls using createRouterClient have this header set
	const isServerSideCall = env.FLAG_DEBUG_PRINTER || headers.get("x-server-side-call") === "true";

	// If the header is not present, this is a client-side HTTP request - reject it
	if (!isServerSideCall) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "This endpoint can only be called from server-side code",
		});
	}

	return next({ context });
});

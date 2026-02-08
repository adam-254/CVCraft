import { createIsomorphicFn } from "@tanstack/react-start";
import { simpleAuthClient } from "./simple-client";
import type { AuthSession } from "./types";

export const getSession = createIsomorphicFn()
	.client(async (): Promise<AuthSession | null> => {
		const { session } = await simpleAuthClient.getSession();
		return session;
	})
	.server(async (): Promise<AuthSession | null> => {
		// For server-side, we'll need to implement cookie-based session
		// For now, return null and rely on client-side session
		return null;
	});

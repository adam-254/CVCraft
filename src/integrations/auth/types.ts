import z from "zod";

export type AuthSession = {
	session: {
		id: string;
		userId: string;
		token: string;
		expiresAt: Date;
		ipAddress?: string;
		userAgent?: string;
		createdAt: Date;
		updatedAt: Date;
	};
	user: {
		id: string;
		name: string;
		email: string;
		username: string;
		displayUsername: string;
		emailVerified: boolean;
		image?: string;
		twoFactorEnabled: boolean;
		createdAt: Date;
		updatedAt: Date;
	};
};

const authProviderSchema = z.enum(["credential", "google", "github", "custom"]);

export type AuthProvider = z.infer<typeof authProviderSchema>;

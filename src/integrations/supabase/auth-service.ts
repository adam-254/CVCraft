/**
 * Authentication Service using Supabase Client
 * Handles user registration, login, and password reset
 */

import { hashPassword, verifyPassword } from "@/utils/password";
import { generateId } from "@/utils/string";
import { supabase } from "./client";

export interface User {
	id: string;
	name: string;
	email: string;
	username: string;
	displayUsername: string;
	emailVerified: boolean;
	image?: string;
	twoFactorEnabled: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Session {
	id: string;
	userId: string;
	token: string;
	expiresAt: string;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Create a new user account
 */
export async function createUser(data: {
	name: string;
	email: string;
	username: string;
	displayUsername: string;
	password: string;
}) {
	// Check if user already exists
	const { data: existingUser } = await supabase
		.from("user")
		.select("id")
		.or(`email.eq.${data.email},username.eq.${data.username}`)
		.single();

	if (existingUser) {
		throw new Error("User with this email or username already exists");
	}

	// Hash password
	const hashedPassword = await hashPassword(data.password);

	// Create user
	const userId = generateId();
	const { data: user, error: userError } = await supabase
		.from("user")
		.insert({
			id: userId,
			name: data.name,
			email: data.email,
			username: data.username,
			display_username: data.displayUsername,
			email_verified: false,
			two_factor_enabled: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (userError) {
		throw new Error(`Failed to create user: ${userError.message}`);
	}

	// Create account with password
	const accountId = generateId();
	const { error: accountError } = await supabase.from("account").insert({
		id: accountId,
		user_id: userId,
		provider_id: "credential",
		account_id: data.email,
		password: hashedPassword,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	});

	if (accountError) {
		// Rollback user creation
		await supabase.from("user").delete().eq("id", userId);
		throw new Error(`Failed to create account: ${accountError.message}`);
	}

	return user;
}

/**
 * Authenticate user with email/username and password
 */
export async function authenticateUser(identifier: string, password: string) {
	// Find user by email or username
	const { data: user, error: userError } = await supabase
		.from("user")
		.select("*")
		.or(`email.eq.${identifier},username.eq.${identifier}`)
		.single();

	if (userError || !user) {
		throw new Error("Invalid credentials");
	}

	// Get account with password
	const { data: account, error: accountError } = await supabase
		.from("account")
		.select("password")
		.eq("user_id", user.id)
		.eq("provider_id", "credential")
		.single();

	if (accountError || !account || !account.password) {
		throw new Error("Invalid credentials");
	}

	// Verify password
	const isValid = await verifyPassword(password, account.password);
	if (!isValid) {
		throw new Error("Invalid credentials");
	}

	return user;
}

/**
 * Create a session for authenticated user
 */
export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
	const sessionId = generateId();
	const token = generateId() + generateId(); // Double length for security
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

	const { data: session, error } = await supabase
		.from("session")
		.insert({
			id: sessionId,
			user_id: userId,
			token,
			expires_at: expiresAt.toISOString(),
			ip_address: ipAddress,
			user_agent: userAgent,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create session: ${error.message}`);
	}

	return session;
}

/**
 * Get session by token
 */
export async function getSession(token: string) {
	const { data: session, error } = await supabase
		.from("session")
		.select("*, user:user_id(*)")
		.eq("token", token)
		.gte("expires_at", new Date().toISOString())
		.single();

	if (error || !session) {
		return null;
	}

	return session;
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string) {
	const { error } = await supabase.from("session").delete().eq("token", token);

	if (error) {
		throw new Error(`Failed to delete session: ${error.message}`);
	}
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(email: string) {
	// Check if user exists
	const { data: user, error: userError } = await supabase.from("user").select("id, email").eq("email", email).single();

	if (userError || !user) {
		// Don't reveal if user exists
		return { success: true };
	}

	// Create verification token
	const tokenId = generateId();
	const token = generateId() + generateId();
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

	const { error } = await supabase.from("verification").insert({
		id: tokenId,
		identifier: email,
		value: token,
		expires_at: expiresAt.toISOString(),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	});

	if (error) {
		throw new Error(`Failed to create reset token: ${error.message}`);
	}

	return { success: true, token };
}

/**
 * Reset password using token
 */
export async function resetPassword(token: string, newPassword: string) {
	// Find valid token
	const { data: verification, error: verificationError } = await supabase
		.from("verification")
		.select("*")
		.eq("value", token)
		.gte("expires_at", new Date().toISOString())
		.single();

	if (verificationError || !verification) {
		throw new Error("Invalid or expired reset token");
	}

	// Find user
	const { data: user, error: userError } = await supabase
		.from("user")
		.select("id")
		.eq("email", verification.identifier)
		.single();

	if (userError || !user) {
		throw new Error("User not found");
	}

	// Hash new password
	const hashedPassword = await hashPassword(newPassword);

	// Update password
	const { error: updateError } = await supabase
		.from("account")
		.update({
			password: hashedPassword,
			updated_at: new Date().toISOString(),
		})
		.eq("user_id", user.id)
		.eq("provider_id", "credential");

	if (updateError) {
		throw new Error(`Failed to update password: ${updateError.message}`);
	}

	// Delete used token
	await supabase.from("verification").delete().eq("id", verification.id);

	// Invalidate all sessions
	await supabase.from("session").delete().eq("user_id", user.id);

	return { success: true };
}

/**
 * Create email verification token
 */
export async function createEmailVerificationToken(email: string) {
	const tokenId = generateId();
	const token = generateId() + generateId();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

	const { error } = await supabase.from("verification").insert({
		id: tokenId,
		identifier: email,
		value: token,
		expires_at: expiresAt.toISOString(),
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	});

	if (error) {
		throw new Error(`Failed to create verification token: ${error.message}`);
	}

	return { success: true, token };
}

/**
 * Verify email using token
 */
export async function verifyEmail(token: string) {
	// Find valid token
	const { data: verification, error: verificationError } = await supabase
		.from("verification")
		.select("*")
		.eq("value", token)
		.gte("expires_at", new Date().toISOString())
		.single();

	if (verificationError || !verification) {
		throw new Error("Invalid or expired verification token");
	}

	// Update user
	const { error: updateError } = await supabase
		.from("user")
		.update({
			email_verified: true,
			updated_at: new Date().toISOString(),
		})
		.eq("email", verification.identifier);

	if (updateError) {
		throw new Error(`Failed to verify email: ${updateError.message}`);
	}

	// Delete used token
	await supabase.from("verification").delete().eq("id", verification.id);

	return { success: true };
}

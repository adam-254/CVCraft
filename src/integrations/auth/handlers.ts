/**
 * Custom Authentication Handlers using Supabase Client
 * These replace better-auth's database operations with direct Supabase calls
 */

import { supabase } from '../supabase/client';
import { hashPassword, verifyPassword } from '@/utils/password';
import { generateId } from '@/utils/string';

export async function handleSignUp(data: {
  name: string;
  email: string;
  username: string;
  displayUsername: string;
  password: string;
}) {
  // Check if user exists
  const { data: existing } = await supabase
    .from('user')
    .select('id')
    .or(`email.eq.${data.email},username.eq.${data.username}`)
    .single();

  if (existing) {
    throw new Error('User with this email or username already exists');
  }

  // Create user
  const userId = generateId();
  const hashedPassword = await hashPassword(data.password);

  const { data: user, error: userError } = await supabase
    .from('user')
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

  if (userError) throw userError;

  // Create account
  const accountId = generateId();
  const { error: accountError } = await supabase
    .from('account')
    .insert({
      id: accountId,
      user_id: userId,
      provider_id: 'credential',
      account_id: data.email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (accountError) {
    // Rollback
    await supabase.from('user').delete().eq('id', userId);
    throw accountError;
  }

  // Create session
  const sessionId = generateId();
  const token = generateId() + generateId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data: session, error: sessionError } = await supabase
    .from('session')
    .insert({
      id: sessionId,
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  return { user, session };
}

export async function handleSignIn(identifier: string, password: string) {
  // Find user
  const { data: user, error: userError } = await supabase
    .from('user')
    .select('*')
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .single();

  if (userError || !user) {
    throw new Error('Invalid credentials');
  }

  // Get account
  const { data: account, error: accountError } = await supabase
    .from('account')
    .select('password')
    .eq('user_id', user.id)
    .eq('provider_id', 'credential')
    .single();

  if (accountError || !account?.password) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await verifyPassword(password, account.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Create session
  const sessionId = generateId();
  const token = generateId() + generateId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data: session, error: sessionError } = await supabase
    .from('session')
    .insert({
      id: sessionId,
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  return { user, session };
}

export async function handlePasswordReset(email: string) {
  // Check if user exists
  const { data: user } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .single();

  if (!user) {
    // Don't reveal if user exists
    return { success: true };
  }

  // Create reset token
  const tokenId = generateId();
  const token = generateId() + generateId();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await supabase
    .from('verification')
    .insert({
      id: tokenId,
      identifier: email,
      value: token,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  return { success: true, token };
}

export async function handlePasswordUpdate(token: string, newPassword: string) {
  // Find token
  const { data: verification, error: verError } = await supabase
    .from('verification')
    .select('*')
    .eq('value', token)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (verError || !verification) {
    throw new Error('Invalid or expired token');
  }

  // Find user
  const { data: user } = await supabase
    .from('user')
    .select('id')
    .eq('email', verification.identifier)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  // Update password
  const hashedPassword = await hashPassword(newPassword);
  await supabase
    .from('account')
    .update({ password: hashedPassword, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('provider_id', 'credential');

  // Delete token
  await supabase.from('verification').delete().eq('id', verification.id);

  // Invalidate sessions
  await supabase.from('session').delete().eq('user_id', user.id);

  return { success: true };
}

export async function getSessionByToken(token: string) {
  const { data: session, error } = await supabase
    .from('session')
    .select('*, user:user_id(*)')
    .eq('token', token)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (error) return null;
  return session;
}

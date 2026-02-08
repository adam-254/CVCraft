/**
 * Simple Authentication API using Supabase Client
 * TanStack Router API Route
 */

import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { hashPassword, verifyPassword } from '@/utils/password';
import { generateId } from '@/utils/string';

async function handler({ request }: { request: Request }) {
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case 'signup':
        return await handleSignup(body);
      case 'signin':
        return await handleSignin(body);
      case 'forgot-password':
        return await handleForgotPassword(body);
      case 'reset-password':
        return await handleResetPassword(body);
      case 'get-session':
        return await handleGetSession(body);
      case 'signout':
        return await handleSignout(body);
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

async function handleSignup(data: any) {
  const { name, email, username, password } = data;

  // Check if user exists
  const { data: existing } = await supabase
    .from('user')
    .select('id')
    .or(`email.eq.${email},username.eq.${username}`)
    .maybeSingle();

  if (existing) {
    throw new Error('User already exists');
  }

  // Create user
  const userId = generateId();
  const hashedPassword = await hashPassword(password);

  const { error: userError } = await supabase.from('user').insert({
    id: userId,
    name,
    email,
    username,
    display_username: username,
    email_verified: false,
    two_factor_enabled: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (userError) throw userError;

  // Create account
  const { error: accountError } = await supabase.from('account').insert({
    id: generateId(),
    user_id: userId,
    provider_id: 'credential',
    account_id: email,
    password: hashedPassword,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (accountError) {
    await supabase.from('user').delete().eq('id', userId);
    throw accountError;
  }

  // Create session
  const token = generateId() + generateId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await supabase.from('session').insert({
    id: generateId(),
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Set cookie with Secure flag for production
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = `cvcraft_auth_token=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Lax${isProduction ? '; Secure' : ''}`;
  const response = Response.json({ success: true, token, userId });
  response.headers.set('Set-Cookie', cookieOptions);
  return response;
}

async function handleSignin(data: any) {
  const { identifier, password } = data;

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
  const { data: account } = await supabase
    .from('account')
    .select('password')
    .eq('user_id', user.id)
    .eq('provider_id', 'credential')
    .single();

  if (!account?.password) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await verifyPassword(password, account.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Create session
  const token = generateId() + generateId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await supabase.from('session').insert({
    id: generateId(),
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Set cookie with Secure flag for production
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = `cvcraft_auth_token=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Lax${isProduction ? '; Secure' : ''}`;
  const response = Response.json({ success: true, token, user });
  response.headers.set('Set-Cookie', cookieOptions);
  return response;
}

async function handleForgotPassword(data: any) {
  const { email } = data;

  const { data: user } = await supabase
    .from('user')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (!user) {
    return Response.json({ success: true }); // Don't reveal if user exists
  }

  const token = generateId() + generateId();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await supabase.from('verification').insert({
    id: generateId(),
    identifier: email,
    value: token,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return Response.json({ success: true, token });
}

async function handleResetPassword(data: any) {
  const { token, password } = data;

  const { data: verification } = await supabase
    .from('verification')
    .select('*')
    .eq('value', token)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (!verification) {
    throw new Error('Invalid or expired token');
  }

  const { data: user } = await supabase
    .from('user')
    .select('id')
    .eq('email', verification.identifier)
    .single();

  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await hashPassword(password);

  await supabase
    .from('account')
    .update({ password: hashedPassword })
    .eq('user_id', user.id)
    .eq('provider_id', 'credential');

  await supabase.from('verification').delete().eq('id', verification.id);
  await supabase.from('session').delete().eq('user_id', user.id);

  return Response.json({ success: true });
}

async function handleGetSession(data: any) {
  const { token } = data;

  const { data: sessionData, error } = await supabase
    .from('session')
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
    .eq('token', token)
    .gte('expires_at', new Date().toISOString())
    .single();

  if (error || !sessionData || !sessionData.user) {
    return Response.json({ session: null });
  }

  // Transform to match AuthSession type
  const session = {
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

  return Response.json({ session });
}

async function handleSignout(data: any) {
  const { token } = data;

  await supabase.from('session').delete().eq('token', token);

  // Clear cookie with Secure flag for production
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = `cvcraft_auth_token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${isProduction ? '; Secure' : ''}`;
  const response = Response.json({ success: true });
  response.headers.set('Set-Cookie', cookieOptions);
  return response;
}

export const Route = createFileRoute('/api/simple-auth')({
  server: {
    handlers: {
      POST: handler,
    },
  },
});

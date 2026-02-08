/**
 * Simple Auth Client
 * Replaces better-auth client with direct API calls to Supabase
 */

import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'cvcraft_auth_token';

export const simpleAuthClient = {
  async signUp(data: { name: string; email: string; username: string; password: string }) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', ...data }),
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Signup failed');
    }

    // Store token in cookie
    if (result.token) {
      Cookies.set(AUTH_TOKEN_KEY, result.token, { expires: 30, sameSite: 'lax' });
    }

    return result;
  },

  async signIn(data: { identifier: string; password: string }) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signin', ...data }),
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Sign in failed');
    }

    // Store token in cookie
    if (result.token) {
      Cookies.set(AUTH_TOKEN_KEY, result.token, { expires: 30, sameSite: 'lax' });
    }

    return result;
  },

  async signOut() {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    
    if (token) {
      await fetch('/api/simple-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signout', token }),
        credentials: 'include',
      });
    }

    Cookies.remove(AUTH_TOKEN_KEY);
  },

  async forgotPassword(email: string) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'forgot-password', email }),
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Password reset failed');
    }

    return result;
  },

  async resetPassword(token: string, password: string) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset-password', token, password }),
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Password reset failed');
    }

    return result;
  },

  async getSession() {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    
    if (!token) {
      return { session: null };
    }

    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get-session', token }),
      credentials: 'include',
    });

    const result = await response.json();
    
    if (!response.ok) {
      Cookies.remove(AUTH_TOKEN_KEY);
      return { session: null };
    }

    return result;
  },

  getToken() {
    return Cookies.get(AUTH_TOKEN_KEY);
  },
};

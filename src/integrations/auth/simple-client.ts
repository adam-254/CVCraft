/**
 * Simple Auth Client
 * Replaces better-auth client with direct API calls to Supabase
 */

const AUTH_TOKEN_KEY = 'cvcraft_auth_token';

export const simpleAuthClient = {
  async signUp(data: { name: string; email: string; username: string; password: string }) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', ...data }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Signup failed');
    }

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    }

    return result;
  },

  async signIn(data: { identifier: string; password: string }) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signin', ...data }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Sign in failed');
    }

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    }

    return result;
  },

  async signOut() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (token) {
      await fetch('/api/simple-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signout', token }),
      });
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  async forgotPassword(email: string) {
    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'forgot-password', email }),
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
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Password reset failed');
    }

    return result;
  },

  async getSession() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    if (!token) {
      return { session: null };
    }

    const response = await fetch('/api/simple-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get-session', token }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return { session: null };
    }

    return result;
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
};

import { API_BASE_URL, ApiRequestError, TOKEN_KEY, type ApiResult } from './api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export interface AuthUser {
  email: string;
  name: string;
}

// Deliberately bypasses lib/api.ts's request() helper: that helper redirects to
// /login on a 401, which would turn a "wrong password" response into a confusing
// redirect loop instead of an inline error on the login form itself.
export async function login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = (await res.json()) as ApiResult<{ token: string; user: AuthUser }>;
  if (!json.success) {
    throw new ApiRequestError(json.error.message, json.error.fields);
  }
  return json.data;
}

export function logout(): void {
  clearToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

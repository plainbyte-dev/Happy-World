import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

function getSecret(): string {
  // No insecure default here on purpose — a hardcoded fallback secret would let
  // anyone forge admin tokens if this env var is ever left unset in production.
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return JWT_SECRET;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, getSecret()) as AuthTokenPayload;
}

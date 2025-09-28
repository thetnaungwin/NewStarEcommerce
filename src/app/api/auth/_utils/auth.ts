import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export function getTokenFromRequest(req: NextRequest | any): string | null {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookie = req.cookies.get("token")?.value;
  return cookie || null;
}

export function verifyJwt(token: string): AuthTokenPayload | null {
  try {
    return verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

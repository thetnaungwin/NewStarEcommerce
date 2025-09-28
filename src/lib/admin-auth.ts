import { NextRequest } from "next/server";
import { verifyJwt, getTokenFromRequest } from "../app/api/auth/_utils/auth";
import { prisma } from "./prisma";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "MANAGER";
}

export async function getAdminUser(req: NextRequest): Promise<AdminUser | null> {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return null;
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return null;
    }

    return user as AdminUser;
  } catch (error) {
    console.error("Admin auth error:", error);
    return null;
  }
}

export function requireAdmin(handler: (req: NextRequest, admin: AdminUser) => Promise<Response>) {
  return async (req: NextRequest) => {
    const admin = await getAdminUser(req);
    
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Admin access required" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return handler(req, admin);
  };
}

export function requireAdminWithParams(
  handler: (
    req: NextRequest,
    admin: AdminUser,
    context: { params: Record<string, string> }
  ) => Promise<Response>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const admin = await getAdminUser(req);
    
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Admin access required" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const resolvedParams = (await context?.params) ?? {};

    return handler(req, admin, { params: resolvedParams });
  };
}

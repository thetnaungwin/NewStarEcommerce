import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getUsers(req: NextRequest, admin: any) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role = searchParams.get("role") || "";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = {
      ...(role && { role: role as "CUSTOMER" | "ADMIN" | "MANAGER" }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              transportBookings: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return Response.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export const GET = requireAdmin(getUsers);

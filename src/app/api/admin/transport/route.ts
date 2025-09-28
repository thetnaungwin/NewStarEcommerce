import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getTransportBookings(req: NextRequest, admin: any) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status: status as any }),
    };

    const [bookings, total] = await Promise.all([
      prisma.transportBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true, phone: true },
          },
        },
      }),
      prisma.transportBooking.count({ where }),
    ]);

    return Response.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get transport bookings error:", error);
    return Response.json(
      { error: "Failed to fetch transport bookings" },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getTransportBookings);

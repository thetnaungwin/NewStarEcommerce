import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function handler(req: NextRequest, admin: any) {
  try {
    const [
      totalProducts,
      totalOrders,
      totalTransportBookings,
      totalUsers,
      recentOrders,
      recentTransportBookings,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.transportBooking.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.transportBooking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    return Response.json({
      totalProducts,
      totalOrders,
      totalTransportBookings,
      totalUsers,
      recentOrders,
      recentTransportBookings,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(handler);

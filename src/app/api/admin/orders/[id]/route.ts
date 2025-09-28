import { NextRequest } from "next/server";
import { requireAdminWithParams, AdminUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getOrder(
  req: NextRequest,
  admin: AdminUser,
  context: { params: Record<string, string> }
) {
  try {
    if (!context?.params?.id) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: context.params.id },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        orderItems: {
          include: {
            product: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

async function updateOrder(
  req: NextRequest,
  admin: AdminUser,
  context: { params: Record<string, string> }
) {
  try {
    if (!context?.params?.id) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: context.params.id },
      data: { status: status as any },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        orderItems: {
          include: {
            product: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });

    return Response.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}

async function deleteOrder(
  req: NextRequest,
  admin: AdminUser,
  context: { params: Record<string, string> }
) {
  try {
    if (!context?.params?.id) {
      return Response.json({ error: "Order ID is required" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id: context.params.id },
    });

    return Response.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

export const GET = requireAdminWithParams(getOrder);
export const PUT = requireAdminWithParams(updateOrder);
export const DELETE = requireAdminWithParams(deleteOrder);

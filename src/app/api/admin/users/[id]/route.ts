import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getUser(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: context.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            transportBookings: true,
            cartItems: true,
            wishlistItems: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

async function deleteUser(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: context.params.id },
      select: { role: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent admin from deleting other admins
    if (user.role === "ADMIN" && admin.role !== "ADMIN") {
      return Response.json(
        { error: "You cannot delete admin users" },
        { status: 403 }
      );
    }

    // Prevent admin from deleting themselves
    if (context.params.id === admin.id) {
      return Response.json(
        { error: "You cannot delete your own account" },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id: context.params.id },
    });

    return Response.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export const GET = requireAdmin(getUser);
export const DELETE = requireAdmin(deleteUser);

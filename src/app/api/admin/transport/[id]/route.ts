import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getTransportBooking(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json(
        { error: "Transport booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.transportBooking.findUnique({
      where: { id: context.params.id },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!booking) {
      return Response.json(
        { error: "Transport booking not found" },
        { status: 404 }
      );
    }

    return Response.json(booking);
  } catch (error) {
    console.error("Get transport booking error:", error);
    return Response.json(
      { error: "Failed to fetch transport booking" },
      { status: 500 }
    );
  }
}

async function updateTransportBooking(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json(
        { error: "Transport booking ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const booking = await prisma.transportBooking.update({
      where: { id: context.params.id },
      data: { status: status as any },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    return Response.json(booking);
  } catch (error) {
    console.error("Update transport booking error:", error);
    return Response.json(
      { error: "Failed to update transport booking" },
      { status: 500 }
    );
  }
}

async function deleteTransportBooking(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json(
        { error: "Transport booking ID is required" },
        { status: 400 }
      );
    }

    await prisma.transportBooking.delete({
      where: { id: context.params.id },
    });

    return Response.json({ message: "Transport booking deleted successfully" });
  } catch (error) {
    console.error("Delete transport booking error:", error);
    return Response.json(
      { error: "Failed to delete transport booking" },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getTransportBooking);
export const PUT = requireAdmin(updateTransportBooking);
export const DELETE = requireAdmin(deleteTransportBooking);

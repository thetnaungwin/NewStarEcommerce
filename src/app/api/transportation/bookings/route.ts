import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyJwt } from "../../auth/_utils/auth";

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token && verifyJwt(token);

    // Require authentication for booking
    if (!payload) {
      return NextResponse.json(
        { error: "Authentication required to make bookings" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      phone,
      truckLabel,
      weightViss,
      goodsDescription,
      origin,
      destination,
      pickupDate,
      pickupTime,
    } = body ?? {};

    if (
      !truckLabel ||
      !weightViss ||
      !goodsDescription ||
      !origin ||
      !destination
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedWeight = Number(weightViss);
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      return NextResponse.json(
        { error: "weightViss must be a positive number" },
        { status: 400 }
      );
    }

    // Get user information to use their name
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { name: true, phone: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate price: 200 per viss
    const price = Math.floor(parsedWeight) * 200;

    const booking = await prisma.transportBooking.create({
      data: {
        phone: phone || user.phone,
        truckLabel,
        weightViss: Math.floor(parsedWeight),
        price,
        goodsDescription,
        origin,
        destination,
        userId: payload.userId,
        pickupDate: pickupDate ? new Date(pickupDate) : undefined,
        pickupTime: pickupTime ?? undefined,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET: list user's transport bookings
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = token && verifyJwt(token);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bookings = await prisma.transportBooking.findMany({
      where: { userId: payload.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("List bookings error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

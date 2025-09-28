import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyJwt } from "../_utils/auth";

export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    const payload = token && verifyJwt(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone } = await request.json();

    // Validate input
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Basic phone validation (10-15 digits, allows + and spaces/dashes)
    const cleanedPhone = String(phone).trim();
    const phoneRegex = /^\+?[0-9\-\s]{8,20}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name: name.trim(),
        phone: cleanedPhone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getProduct(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: context.params.id },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

async function updateProduct(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      category,
      weight,
      ingredients,
      benefits,
      isFeatured,
      inStock,
    } = body;

    const product = await prisma.product.update({
      where: { id: context.params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image,
        category,
        weight,
        ingredients: ingredients || [],
        benefits: benefits || [],
        isFeatured: isFeatured || false,
        inStock: inStock !== false,
      },
    });

    return Response.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

async function deleteProduct(
  req: NextRequest,
  admin: any,
  context?: { params: { id: string } }
) {
  try {
    if (!context?.params?.id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: context.params.id },
    });

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getProduct);
export const PUT = requireAdmin(updateProduct);
export const DELETE = requireAdmin(deleteProduct);

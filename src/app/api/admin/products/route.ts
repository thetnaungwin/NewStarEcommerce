import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function getProducts(req: NextRequest, admin: any) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return Response.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

async function createProduct(req: NextRequest, admin: any) {
  try {
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

    const product = await prisma.product.create({
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

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export const GET = requireAdmin(getProducts);
export const POST = requireAdmin(createProduct);

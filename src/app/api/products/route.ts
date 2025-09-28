import { NextRequest, NextResponse } from "next/server";
import { getProductsByCategory, searchProducts } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "All";
    const search = searchParams.get("search") || "";

    let products;

    if (search) {
      products = await searchProducts(search);
    } else {
      products = await getProductsByCategory(category);
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

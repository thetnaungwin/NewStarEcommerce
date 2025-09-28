import { prisma } from "./prisma";

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  weight: string;
  ingredients: string[];
  benefits: string[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const categories = [
  "All",
  "Organic Jaggery",
  "Palm Jaggery",
  "Traditional Sweets",
  "Jaggery Powder",
  "Gift Packs",
];

// Get all products from database
export async function getAllProducts(): Promise<ProductWithDetails[]> {
  try {
    const products: any = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Get featured products
export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  try {
    const products: any = await prisma.product.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Get product by ID
export async function getProductById(
  id: string
): Promise<ProductWithDetails | null> {
  try {
    const product: any = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Get products by category
export async function getProductsByCategory(
  category: string
): Promise<ProductWithDetails[]> {
  try {
    if (category === "All") {
      return await getAllProducts();
    }

    const products: any = await prisma.product.findMany({
      where: {
        category,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

// Search products
export async function searchProducts(
  query: string
): Promise<ProductWithDetails[]> {
  try {
    const products: any = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

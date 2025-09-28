import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/lib/products';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: ProductPageProps) {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

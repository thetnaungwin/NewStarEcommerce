import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyJwt } from '../auth/_utils/auth'

// GET: get wishlist items for logged-in user
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const items = await prisma.wishlistItem.findMany({
    where: { userId: payload.userId },
    include: { product: true },
  })

  return NextResponse.json({
    items: items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      description: i.product.description,
      price: i.product.price,
      originalPrice: i.product.originalPrice ?? undefined,
      image: i.product.image,
      category: i.product.category,
      rating: i.product.rating,
      reviews: i.product.reviews,
      inStock: i.product.inStock,
      weight: i.product.weight,
      ingredients: i.product.ingredients,
      benefits: i.product.benefits,
      isFeatured: i.product.isFeatured,
    }))
  })
}

// POST: add to wishlist { productId }
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 })
  }

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: payload.userId, productId } },
    update: {},
    create: { userId: payload.userId, productId },
  })

  return NextResponse.json({ message: 'Added to wishlist' })
}

// DELETE: remove from wishlist (expects ?productId=)
export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 })
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId: payload.userId, productId },
  })

  return NextResponse.json({ message: 'Removed from wishlist' })
}



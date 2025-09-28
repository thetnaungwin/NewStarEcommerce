import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyJwt } from '../auth/_utils/auth'

// GET: get cart items
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.cartItem.findMany({
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
      quantity: i.quantity,
    }))
  })
}

// POST: add/update item { productId, quantity }
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, quantity } = await req.json()
  if (!productId || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'productId and quantity required' }, { status: 400 })
  }

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId: payload.userId, productId } })
  } else {
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: payload.userId, productId } },
      update: { quantity },
      create: { userId: payload.userId, productId, quantity },
    })
  }

  return NextResponse.json({ message: 'Cart updated' })
}

// DELETE: remove item (?productId=)
export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })

  await prisma.cartItem.deleteMany({ where: { userId: payload.userId, productId } })
  return NextResponse.json({ message: 'Removed from cart' })
}



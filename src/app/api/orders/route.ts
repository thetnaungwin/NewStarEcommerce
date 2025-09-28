import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyJwt } from '../auth/_utils/auth'

// POST: create order from current cart { shippingAddress, paymentMethod }
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { shippingAddress, paymentMethod } = await req.json()
  if (!shippingAddress || !paymentMethod) {
    return NextResponse.json({ error: 'shippingAddress and paymentMethod required' }, { status: 400 })
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: payload.userId },
    include: { product: true },
  })

  if (cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const totalAmount = cartItems.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0)

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: payload.userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: 'PENDING',
      },
    })

    await tx.orderItem.createMany({
      data: cartItems.map((ci) => ({
        orderId: created.id,
        productId: ci.productId,
        quantity: ci.quantity,
        price: ci.product.price,
      })),
    })

    await tx.cartItem.deleteMany({ where: { userId: payload.userId } })

    return created
  })

  return NextResponse.json({ message: 'Order created', orderId: order.id })
}

// GET: list user's orders
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req)
  const payload = token && verifyJwt(token)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: { include: { product: true } },
    },
  })

  return NextResponse.json({ orders })
}



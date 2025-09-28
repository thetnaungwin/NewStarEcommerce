'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { state: cartState } = useCart()
  const { state: authState } = useAuth()
  const router = useRouter()
  const [shippingAddress, setShippingAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submitOrder = async () => {
    setError('')
    if (!authState.isAuthenticated || !authState.token) {
      setError('Please login to place an order.')
      return
    }
    if (!shippingAddress) {
      setError('Shipping address is required')
      return
    }
    if (cartState.itemCount === 0) {
      setError('Your cart is empty')
      return
    }
    try {
      setSubmitting(true)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')
      setSuccess('Order placed successfully')
      router.push('/orders')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
        {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">{success}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-900 text-xl font-semibold mb-4">Shipping</h2>
            <textarea
              className="text-gray-900 w-full min-h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Full address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
            <div className="mt-6">
              <h3 className="text-gray-900 text-lg font-semibold mb-2">Payment</h3>
              <select
                className="text-gray-900 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Cash on Delivery</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            <button
              onClick={submitOrder}
              disabled={submitting}
              className="mt-6 inline-flex items-center bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-900 text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cartState.items.map((item:any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className='text-gray-900'>{item.name} × {item.quantity}</span>
                  <span className='text-gray-900'>{(item.price * item.quantity).toLocaleString()} MMK</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between font-semibold">
              <span className='text-gray-900'>Total</span>
              <span className='text-gray-900'>{cartState.total.toLocaleString()} MMK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



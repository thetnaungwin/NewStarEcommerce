'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { state: cartState, dispatch, updateQuantityServer, removeItemServer } = useCart();
  const { state: authState } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (productId: string, newQuantity: number) => {
    updateQuantityServer(productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    removeItemServer(productId);
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleCheckout = () => {
    setIsLoading(true);
    if (!authState.isAuthenticated) {
      setIsLoading(false);
      alert('Please login to proceed to checkout.');
      return;
    }
    router.push('/checkout');
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/products"
              className="bg-amber-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors inline-flex items-center mobile-button"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/products"
            className="text-amber-600 hover:text-amber-700 flex items-center mb-3 sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">{cartState.itemCount} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-gray-900 text-lg sm:text-xl font-semibold">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {cartState.items.map((item:any) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{item.weight}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 mx-auto sm:mx-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-900 p-1 hover:bg-gray-100 rounded touch-button"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10)
                            if (Number.isFinite(val)) {
                              updateQuantity(item.id, val)
                            }
                          }}
                          className="w-12 sm:w-14 text-center border border-gray-300 rounded-md py-1 text-gray-900 text-sm sm:text-base"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-900 p-1 hover:bg-gray-100 rounded touch-button"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <p className="text-base sm:text-lg font-semibold text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} MMK
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">{item.price.toLocaleString()} MMK each</p>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded touch-button mx-auto sm:mx-0"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4 sm:top-8">
              <h2 className="text-gray-900 text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>
              
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">{cartState.total.toLocaleString()} MMK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Shipping</span>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Tax</span>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">0 MMK</span>
                </div>
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-base sm:text-lg font-semibold">Total</span>
                    <span className="text-base sm:text-lg font-semibold text-amber-600">{cartState.total.toLocaleString()} MMK</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mobile-button"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <p className="text-xs text-gray-500 mt-3 sm:mt-4 text-center">
                Secure checkout with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

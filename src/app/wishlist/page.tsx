'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { state: wishlistState, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const addToCart = async (product: any) => {
    if (!product.inStock) {
      alert('This product is currently out of stock and cannot be added to cart.');
      return;
    }
    
    setIsLoading(product.id);
    try {
      await addItem(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(null);
    }
  };

  if (wishlistState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">Save your favorite jaggery products to your wishlist.</p>
            <Link
              href="/products"
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="text-amber-600 hover:text-amber-700 flex items-center mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
          <p className="text-gray-600 mt-2">{wishlistState.items.length} items in your wishlist</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-700 text-xl font-semibold">Saved Items</h2>
            <button
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistState.items.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  {!product.inStock && (
                    <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="text-gray-900 text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">{product.description}</p>
                  <p className="text-sm text-gray-500 mb-3">{product.category} • {product.weight}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-amber-600">{product.price.toLocaleString()} MMK</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString()} MMK</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isLoading === product.id || !product.inStock}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                        product.inStock 
                          ? 'bg-amber-600 text-white hover:bg-amber-700' 
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {isLoading === product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { state: cartState } = useCart();
  const { state: wishlistState } = useWishlist();
  const { state: authState, logout } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Transportation Service', href: '/transportation-service' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-xl">NS</span>
              </div>
              <span className="ml-2 text-sm sm:text-xl font-bold text-gray-900 hidden xs:block">New Star Jaggery</span>
              <span className="ml-2 text-sm font-bold text-gray-900 xs:hidden">New Star</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-600 px-2 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <button 
              onClick={() => router.push('/wishlist')}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-amber-600 transition-colors relative touch-button"
              title="Wishlist"
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
              {wishlistState.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {wishlistState.items.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => router.push('/cart')}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-amber-600 transition-colors relative touch-button"
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
            </button>
            {authState.isAuthenticated ? (
              <button
                onClick={() => router.push('/profile')}
                className="p-1 sm:p-1.5 rounded-full border border-gray-200 hover:border-amber-600 hover:shadow transition-all touch-button"
                title="Profile"
              >
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="p-1.5 sm:p-2 text-gray-700 hover:text-amber-600 transition-colors touch-button"
                title="Login"
              >
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1.5 sm:p-2 text-gray-700 hover:text-amber-600 transition-colors touch-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-amber-600 block px-3 py-3 text-base font-medium mobile-nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile user actions */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {authState.isAuthenticated ? (
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-amber-600 block px-3 py-3 text-base font-medium mobile-nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className="text-gray-700 hover:text-amber-600 block px-3 py-3 text-base font-medium mobile-nav-item w-full text-left"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Filter, Search, Grid, List } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
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
}

const categories = [
  'All',
  'Organic Jaggery',
  'Palm Jaggery',
  'Traditional Sweets',
  'Jaggery Powder',
  'Gift Packs'
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([50000, 90000]);
  const [priceRangeActive, setPriceRangeActive] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { state: wishlistState, addToWishlist, removeFromWishlist } = useWishlist();

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Invalid products data structure:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback: Set empty array if API fails
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      alert('This product is currently out of stock and cannot be added to cart.');
      return;
    }
    addItem(product);
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlistState.items.some(item => item.id === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range (only if user has actively set a range)
    if (priceRangeActive) {
      filtered = filtered.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, priceRange, priceRangeActive, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Our Jaggery Products
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Discover our complete range of premium jaggery products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20 sm:top-24">
              <h3 className="text-gray-900 text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-gray-900 w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base mobile-form-input"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-gray-900 w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base mobile-form-input"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Price Range: {priceRange[0].toLocaleString()} MMK - {priceRange[1].toLocaleString()} MMK
                  </label>
                  {priceRangeActive && (
                    <button
                      onClick={() => {
                        setPriceRangeActive(false);
                        setPriceRange([50000, 90000]);
                      }}
                      className="text-xs text-amber-600 hover:text-amber-700 underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="50000"
                    max="90000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], parseInt(e.target.value)]);
                      setPriceRangeActive(true);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>50,000 MMK</span>
                    <span>90,000 MMK</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-gray-900 w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base mobile-form-input"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-0">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 sm:p-2 rounded-md touch-button ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 sm:p-2 rounded-md touch-button ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-32 sm:w-48 flex-shrink-0' : ''}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={400}
                        height={300}
                        className={`${viewMode === 'list' ? 'h-full' : 'w-full h-40 sm:h-48'} object-cover`}
                      />
                      {product.originalPrice && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-sm font-semibold">
                          Out of Stock
                        </div>
                      )}
                      <button 
                        onClick={() => handleToggleWishlist(product)}
                        className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors touch-button"
                      >
                        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          wishlistState.items.some(item => item.id === product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600'
                        }`} />
                      </button>
                    </div>
                    
                    <div className={`p-4 sm:p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 ml-2">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      
                      <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-2">{product.name}</h3>
                      <p className={`text-gray-600 mb-3 sm:mb-4 ${viewMode === 'list' ? 'text-sm' : 'text-xs sm:text-sm line-clamp-2'}`}>
                        {product.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg sm:text-2xl font-bold text-amber-600">{product.price.toLocaleString()} MMK</span>
                          {product.originalPrice && (
                            <span className="text-sm sm:text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString()} MMK</span>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">{product.weight}</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center mobile-button"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-semibold transition-colors flex items-center justify-center mobile-button ${
                            product.inStock 
                              ? 'bg-amber-600 text-white hover:bg-amber-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

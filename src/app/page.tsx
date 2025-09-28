"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

export interface Product {
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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const {
    state: wishlistState,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  // Hero background slideshow
  const heroImages = [
    "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/oneslides.jpeg?alt=media&token=b7f73054-39a9-4d81-814e-65b169d82dc3",
    "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/twoslide.jpg?alt=media&token=e279c710-0c7d-4893-941a-a550eeeeda39",
    "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/threeslide.webp?alt=media&token=fd94ef2d-030c-474e-a789-20268185ace4",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  // Fetch featured products from database
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products/featured");
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      alert('This product is currently out of stock and cannot be added to cart.');
      return;
    }
    addItem(product);
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlistState.items.some(
      (item) => item.id === product.id
    );
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Slideshow */}
      <section className="relative h-80 sm:h-96 md:h-[500px] lg:h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Hero background"
              fill
              priority={index === 0}
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              sizes="100vw"
            />
          ))}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex items-center justify-center gap-2 z-[5]">
            {heroImages.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-colors duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 drop-shadow">
                  Premium Quality
                  <span className="text-amber-400 block">Jaggery Products</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Discover the finest organic jaggery made with traditional
                  methods. Rich in nutrients, pure in taste, and perfect for
                  your healthy lifestyle.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    href="/products"
                    className="bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center mobile-button"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link
                    href="/about"
                    className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-center mobile-button"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🌿</span>
              </div>
              <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-2">
                100% Organic
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Made from pure organic sugarcane and palm sap without any
                chemicals or additives.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🏆</span>
              </div>
              <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Carefully selected and processed using traditional methods for
                the best taste and nutrition.
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🚚</span>
              </div>
              <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Quick and safe delivery to your doorstep with proper packaging
                to maintain freshness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular jaggery products, carefully selected for
              their quality and taste.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleWishlist(product)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          wishlistState.items.some(
                            (item) => item.id === product.id
                          )
                            ? "text-red-500 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 ml-2">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg sm:text-2xl font-bold text-amber-600">
                          {product.price.toLocaleString()} MMK
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm sm:text-lg text-gray-500 line-through">
                            {product.originalPrice.toLocaleString()} MMK
                          </span>
                        )}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {product.weight}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-semibold transition-colors flex items-center justify-center mobile-button ${
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No featured products available at the moment.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/products"
              className="bg-amber-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors inline-flex items-center mobile-button"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Why Choose Our Jaggery?
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <span className="text-amber-600 font-bold text-sm sm:text-base">1</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Rich in Nutrients
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Packed with iron, calcium, and other essential minerals
                      that support your health.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <span className="text-amber-600 font-bold text-sm sm:text-base">2</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Natural Sweetener
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      A healthier alternative to refined sugar with a lower
                      glycemic index.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <span className="text-amber-600 font-bold text-sm sm:text-base">3</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
                      Traditional Methods
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Made using age-old techniques that preserve the natural
                      goodness and authentic taste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <Image
                src="https://sadheeya.com/cdn/shop/articles/Firefly_create_an_image_comparing_jaggery_vs_sugar_in_a_green_forest_with_natural_podium_67449_ab04a66d-28c8-4015-b1e8-ba27a08b0207.jpg?v=1752050760"
                alt="Jaggery Benefits"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

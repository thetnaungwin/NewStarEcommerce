import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-xl">NS</span>
              </div>
              <span className="ml-2 text-lg sm:text-xl font-bold">New Star Jaggery</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm sm:text-base max-w-md">
              We are committed to providing the finest quality organic jaggery
              products, made with traditional methods and natural ingredients.
              Experience the authentic taste of pure jaggery from our
              family-owned business.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors touch-button"
              >
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors touch-button"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors touch-button"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/transportation-service"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base"
                >
                  Transportation Service
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm sm:text-base"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    New Star Jaggery Store
                    <br />
                    AungMyaeThar 4 Street
                    <br />
                    Nyaung-U, Bagan
                    <br />
                    Myanmar
                    <br />
                    <a
                      href="https://maps.app.goo.gl/uGaoyJKiAr3ruhaQA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline text-xs"
                    >
                      View on Google Maps
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-xs sm:text-sm">+959 2043658</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-xs sm:text-sm">info@newstarjaggery.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 New Star Jaggery. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-amber-400 text-xs sm:text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-amber-400 text-xs sm:text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

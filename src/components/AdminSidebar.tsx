"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },
  { name: "Orders", href: "/admin/orders", icon: ChartBarIcon },
  { name: "Transport Bookings", href: "/admin/transport", icon: TruckIcon },
  { name: "Users", href: "/admin/users", icon: UserGroupIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { state, logout } = useAuth();

  return (
    <div className="w-full lg:w-64 bg-white shadow-lg h-auto lg:h-screen">
      <div className="p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Welcome, {state.user?.name || state.user?.email}
        </p>
        <p className="text-xs text-blue-600 font-medium">
          {state.user?.role}
        </p>
      </div>

      <nav className="mt-4 sm:mt-6">
        <div className="px-2 sm:px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 ${
                    isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 sm:p-4 lg:absolute lg:bottom-0 lg:w-64">
        <button
          onClick={logout}
          className="group flex items-center w-full px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gray-500" />
          Sign out
        </button>
      </div>
    </div>
  );
}

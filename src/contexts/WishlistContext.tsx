"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { Product } from "@/app/page";

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: "ADD_TO_WISHLIST"; payload: Product }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "CLEAR_WISHLIST" };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
} | null>(null);

const wishlistReducer = (
  state: WishlistState,
  action: WishlistAction
): WishlistState => {
  switch (action.type) {
    case "ADD_TO_WISHLIST": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "REMOVE_FROM_WISHLIST": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case "CLEAR_WISHLIST":
      return {
        items: [],
      };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
  });
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!authState.isAuthenticated || !authState.token) return;
      const res = await fetch("/api/wishlist", {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Replace items with server data
        data.items?.forEach((item: any) => {
          dispatch({ type: "ADD_TO_WISHLIST", payload: item });
        });
      }
    };
    // reset when logging out
    if (!authState.isAuthenticated) {
      dispatch({ type: "CLEAR_WISHLIST" });
      return;
    }
    fetchWishlist();
  }, [authState.isAuthenticated, authState.token]);

  const addToWishlist = async (product: Product) => {
    dispatch({ type: "ADD_TO_WISHLIST", payload: product });
    if (authState.isAuthenticated && authState.token) {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => {});
    }
  };

  const removeFromWishlist = async (productId: string) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId });
    if (authState.isAuthenticated && authState.token) {
      await fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authState.token}` },
      }).catch(() => {});
    }
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        dispatch,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

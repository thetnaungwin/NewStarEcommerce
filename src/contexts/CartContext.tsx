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

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (product: Product) => Promise<void>;
  updateQuantityServer: (id: string, quantity: number) => Promise<void>;
  removeItemServer: (id: string) => Promise<void>;
  clearCartServer: () => Promise<void>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });
  const { state: authState } = useAuth();

  // Load server cart on login
  useEffect(() => {
    const fetchCart = async () => {
      if (!authState.isAuthenticated || !authState.token) return;
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Replace local cart with server cart
        const items = data.items || [];
        // Recalculate totals from items
        const total = items.reduce(
          (sum: number, i: any) => sum + i.price * i.quantity,
          0
        );
        const itemCount = items.reduce(
          (sum: number, i: any) => sum + i.quantity,
          0
        );
        // Set state directly by dispatching CLEAR then adding each
        dispatch({ type: "CLEAR_CART" });
        items.forEach((i: any) => {
          // dispatch ADD then UPDATE_QUANTITY to exact qty
          dispatch({ type: "ADD_ITEM", payload: i });
          if (i.quantity > 1) {
            dispatch({
              type: "UPDATE_QUANTITY",
              payload: { id: i.id, quantity: i.quantity },
            });
          }
        });
      }
    };
    if (!authState.isAuthenticated) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }
    fetchCart();
  }, [authState.isAuthenticated, authState.token]);

  const syncTotals = (items: CartItem[]) => {
    return {
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  };

  const addItem = async (product: Product) => {
    // Update local state first
    dispatch({ type: "ADD_ITEM", payload: product });
    if (authState.isAuthenticated && authState.token) {
      // Compute next quantity based on current state
      const existing = state.items.find((i) => i.id === product.id);
      const nextQty = (existing?.quantity || 0) + 1;
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: nextQty }),
      }).catch(() => {});
    }
  };

  const updateQuantityServer = async (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    if (authState.isAuthenticated && authState.token) {
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ productId: id, quantity }),
      }).catch(() => {});
    }
  };

  const removeItemServer = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    if (authState.isAuthenticated && authState.token) {
      await fetch(`/api/cart?productId=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authState.token}` },
      }).catch(() => {});
    }
  };

  const clearCartServer = async () => {
    dispatch({ type: "CLEAR_CART" });
    if (authState.isAuthenticated && authState.token) {
      // naive: fetch all items then delete; or rely on order creation to clear
      await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ productId: "ALL", quantity: 0 }),
      }).catch(() => {});
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        updateQuantityServer,
        removeItemServer,
        clearCartServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

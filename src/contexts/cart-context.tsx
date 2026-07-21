"use client";
// ============================================================
// PC Center — Cart Context
// ============================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem } from "@/lib/data/schema";
import { CartStore } from "@/lib/data/store";
import { useAuth } from "./auth-context";

export interface CartItemWithProduct extends CartItem {
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  // Load cart from storage when user changes
  const loadCart = useCallback(async () => {
    if (!session) {
      setItems([]);
      return;
    }
    const cart = CartStore.get(session.userId);
    const enriched: CartItemWithProduct[] = [];
    for (const item of cart.items) {
      try {
        const res = await fetch(`/api/products/${item.productId}`);
        const data = await res.json();
        if (data.success) {
          const product = data.data;
          enriched.push({
            ...item,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/products/placeholder.jpg",
            stock: product.stock,
          });
        }
      } catch (e) {
        console.error("Failed to load product for cart item", e);
      }
    }
    setItems(enriched);
  }, [session]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!data.success) return;
        const product = data.data;

        setItems((prev) => {
          const existing = prev.find((i) => i.productId === productId);
          let newItems: CartItemWithProduct[];
          if (existing) {
            newItems = prev.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            );
          } else {
            newItems = [
              ...prev,
              {
                productId,
                quantity: Math.min(quantity, product.stock),
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "/products/placeholder.jpg",
                stock: product.stock,
              },
            ];
          }
          // Save async
          if (session) {
            CartStore.save({
              userId: session.userId,
              items: newItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
              updatedAt: new Date().toISOString(),
            });
          }
          return newItems;
        });
      } catch (error) {
        console.error("Failed to add item to cart", error);
      }
    },
    [session]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const newItems = prev.filter((i) => i.productId !== productId);
        if (session) {
          CartStore.save({
            userId: session.userId,
            items: newItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            updatedAt: new Date().toISOString(),
          });
        }
        return newItems;
      });
    },
    [session]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) => {
        const newItems = prev.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        );
        if (session) {
          CartStore.save({
            userId: session.userId,
            items: newItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            updatedAt: new Date().toISOString(),
          });
        }
        return newItems;
      });
    },
    [session, removeItem]
  );

  const clearCart = useCallback(() => {
    if (session) CartStore.clear(session.userId);
    setItems([]);
  }, [session]);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

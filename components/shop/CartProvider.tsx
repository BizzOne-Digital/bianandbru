"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  quantity: number;
  stock?: number;
};

type CartCtx = {
  items: CartItem[];
  ready: boolean;
  count: number;
  subtotal: number; // sum of current prices
  savings: number; // sum of (compareAt - price)
  originalTotal: number;
  bump: number; // increments on add, used for microinteraction
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "bb_cart_v1";
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && typeof i.productId === "string"));
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const cap = (qty: number, stock?: number) => Math.max(1, Math.min(qty, stock && stock > 0 ? stock : 99, 99));

  const add = useCallback((item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) return prev.map((i) => (i.productId === item.productId ? { ...i, ...item, quantity: cap(i.quantity + qty, item.stock) } : i));
      return [...prev, { ...item, quantity: cap(qty, item.stock) }];
    });
    setBump((b) => b + 1);
    toast.success(`${item.name} added to cart`);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: cap(qty, i.stock) } : i)));
  }, []);

  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const originalTotal = items.reduce((s, i) => s + Math.max(i.compareAtPrice || 0, i.price) * i.quantity, 0);
    return { items, ready, count, subtotal, originalTotal, savings: originalTotal - subtotal, bump, add, setQty, remove, clear };
  }, [items, ready, bump, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

/** Wishlist kept per-browser (no account system required). */
const WISH_KEY = "bb_wishlist_v1";
export function useWishlist(productId: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      setOn((JSON.parse(localStorage.getItem(WISH_KEY) || "[]") as string[]).includes(productId));
    } catch {}
  }, [productId]);
  const toggle = () => {
    try {
      const list = new Set(JSON.parse(localStorage.getItem(WISH_KEY) || "[]") as string[]);
      if (list.has(productId)) list.delete(productId);
      else list.add(productId);
      localStorage.setItem(WISH_KEY, JSON.stringify([...list]));
      setOn(list.has(productId));
      toast(list.has(productId) ? "Saved to your wishlist" : "Removed from wishlist");
    } catch {}
  };
  return { on, toggle };
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PLACEHOLDER_PRODUCT = "/images/placeholder-product.svg";
export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/** Single source of truth for rendering any stored image URL safely. */
export function getSafeImageUrl(url?: string | null, fallback = PLACEHOLDER_IMAGE): string {
  if (!url || typeof url !== "string") return fallback;
  const u = url.trim();
  if (!u) return fallback;
  if (u.startsWith("/uploads/")) return fallback; // legacy disk paths never exist in production
  if (u.startsWith("/api/uploads/")) return u;
  if (u.startsWith("/images/")) return u;
  try {
    const parsed = new URL(u);
    if (parsed.protocol === "https:" && parsed.hostname === "images.unsplash.com") return u;
  } catch {}
  return fallback;
}

export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value || 0);
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Serialize Mongo lean docs for passing to client components. */
export function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

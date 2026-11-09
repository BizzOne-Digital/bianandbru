"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice, getSafeImageUrl, PLACEHOLDER_PRODUCT } from "@/lib/utils";

type P = { _id: string; name: string; slug: string; price: number; thumbnail: string; images: string[] };

export function WishlistView() {
  const [items, setItems] = useState<P[] | null>(null);
  useEffect(() => {
    let ids: string[] = [];
    try {
      ids = JSON.parse(localStorage.getItem("bb_wishlist_v1") || "[]");
    } catch {}
    if (!ids.length) return setItems([]);
    fetch(`/api/search?ids=${ids.slice(0, 50).join(",")}`)
      .then((r) => r.json())
      .then((d) => setItems(d.products || []))
      .catch(() => setItems([]));
  }, []);

  if (items === null) return <div className="mt-6 h-32 animate-pulse rounded-[20px] bg-baby/60" />;
  if (!items.length)
    return (
      <div className="mt-6">
        <EmptyState title="Your wishlist is empty" text="Tap the heart on any product to save it here." actionLabel="Browse products" actionHref="/shop" />
      </div>
    );
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((p) => (
        <li key={p._id}>
          <Link href={`/shop/${p.slug}`} className="card block overflow-hidden hover:shadow-card">
            <span className="relative block aspect-square bg-baby">
              <Image src={getSafeImageUrl(p.thumbnail || p.images?.[0], PLACEHOLDER_PRODUCT)} alt={p.name} fill sizes="25vw" className="object-cover" />
            </span>
            <span className="block p-3 font-semibold text-navy">{p.name}</span>
            <span className="block px-3 pb-3 text-sm">{formatPrice(p.price)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

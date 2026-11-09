"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice, getSafeImageUrl, PLACEHOLDER_PRODUCT } from "@/lib/utils";
import { useCart } from "./CartProvider";

export function OrderSummary({ children }: { children?: React.ReactNode }) {
  const { subtotal, savings, originalTotal, count } = useCart();
  return (
    <aside className="h-fit rounded-[22px] bg-white p-6 shadow-soft" aria-label="Resumen del pedido">
      <h2 className="font-serif text-2xl">Order Summary</h2>
      <dl className="mt-4 space-y-2 text-[15px]">
        <div className="flex justify-between">
          <dt>Items ({count})</dt>
          <dd>{formatPrice(originalTotal)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-rose-dark">
            <dt>Discount</dt>
            <dd>-{formatPrice(savings)}</dd>
          </div>
        )}
        <div className="flex justify-between text-muted">
          <dt>Shipping</dt>
          <dd>Calculated at confirmation</dd>
        </div>
        <div className="flex justify-between border-t border-navy/10 pt-3 text-lg font-bold text-navy">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}

export function CartView() {
  const { items, ready, setQty, remove } = useCart();

  if (!ready)
    return (
      <div className="mt-8 space-y-3" aria-busy="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-[20px] bg-baby/60" />
        ))}
      </div>
    );

  if (!items.length)
    return (
      <div className="mt-10">
        <EmptyState title="Your cart is empty" text="Discover keepsakes and essentials made to be treasured." actionLabel="Shop Now" actionHref="/shop" />
      </div>
    );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.productId} className="flex gap-4 rounded-[20px] bg-white p-4 shadow-soft">
            <Link href={`/shop/${i.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-baby sm:h-28 sm:w-28">
              <Image src={getSafeImageUrl(i.image, PLACEHOLDER_PRODUCT)} alt={i.name} fill sizes="112px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/shop/${i.slug}`} className="font-semibold text-navy hover:text-rose-dark">
                  {i.name}
                </Link>
                <button type="button" onClick={() => remove(i.productId)} aria-label={`Eliminar ${i.name}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted hover:bg-blush-soft hover:text-rose-dark">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm">
                <span className="font-semibold text-navy">{formatPrice(i.price)}</span>
                {i.compareAtPrice && i.compareAtPrice > i.price && <s className="ml-2 text-muted">{formatPrice(i.compareAtPrice)}</s>}
              </p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border border-navy/15" role="group" aria-label={`Cantidad de ${i.name}`}>
                  <button type="button" onClick={() => setQty(i.productId, i.quantity - 1)} aria-label="Disminuir" className="grid h-10 w-10 place-items-center rounded-full hover:bg-baby" disabled={i.quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{i.quantity}</span>
                  <button type="button" onClick={() => setQty(i.productId, i.quantity + 1)} aria-label="Aumentar" className="grid h-10 w-10 place-items-center rounded-full hover:bg-baby">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-bold text-navy">{formatPrice(i.price * i.quantity)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <OrderSummary>
        <Link href="/checkout" className="btn-pink mt-6 w-full">
          Proceed to Checkout
        </Link>
        <Link href="/shop" className="mt-3 block text-center text-sm font-semibold text-navy hover:text-rose-dark">
          Continue shopping
        </Link>
      </OrderSummary>
    </div>
  );
}

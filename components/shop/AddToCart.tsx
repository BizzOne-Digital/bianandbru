"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart, useWishlist } from "./CartProvider";
import { cn } from "@/lib/utils";

export type CartProduct = {
  _id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  stock: number;
  trackInventory: boolean;
};

const inStock = (p: CartProduct) => !p.trackInventory || p.stock > 0;

function toItem(p: CartProduct) {
  return {
    productId: p._id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.image,
    stock: p.trackInventory ? p.stock : undefined,
  };
}

export function AddToCartButton({ product, className }: { product: CartProduct; className?: string }) {
  const { add } = useCart();
  const available = inStock(product);
  return (
    <button
      type="button"
      disabled={!available}
      onClick={() => add(toItem(product), 1)}
      className={cn("btn-navy w-full max-w-[150px] px-4 py-2 text-sm active:scale-95", className)}
    >
      {available ? "Add to Cart" : "Sold out"}
    </button>
  );
}

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { on, toggle } = useWishlist(productId);
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={cn("grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy shadow-sm transition hover:scale-105", className)}
    >
      <Heart className={cn("h-[18px] w-[18px]", on && "fill-rose text-rose")} strokeWidth={1.8} />
    </button>
  );
}

/** Product detail purchase box: quantity, Add to Cart, Buy Now. */
export function PurchaseBox({ product }: { product: CartProduct }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const max = product.trackInventory ? Math.max(product.stock, 0) : 99;
  const available = inStock(product);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-ink" id="qty-label">
          Quantity
        </span>
        <div className="flex items-center rounded-full border border-navy/15 bg-white" role="group" aria-labelledby="qty-label">
          <button type="button" aria-label="Disminuir cantidad" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-baby" disabled={!available}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-semibold" aria-live="polite">
            {qty}
          </span>
          <button type="button" aria-label="Aumentar cantidad" onClick={() => setQty((q) => Math.min(max, q + 1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-baby" disabled={!available || qty >= max}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled={!available} onClick={() => add(toItem(product), qty)} className="btn-navy flex-1 py-3.5">
          <ShoppingBag aria-hidden className="h-5 w-5" /> {available ? "Add to Cart" : "Sold out"}
        </button>
        <button
          type="button"
          disabled={!available}
          onClick={() => {
            add(toItem(product), qty);
            router.push("/checkout");
          }}
          className="btn-pink flex-1 py-3.5"
        >
          Buy Now
        </button>
        <WishlistButton productId={product._id} className="h-[52px] w-[52px] self-center border border-navy/10" />
      </div>
    </div>
  );
}

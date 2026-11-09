import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/lib/data";
import { cn, discountPercent, formatPrice, getSafeImageUrl, PLACEHOLDER_PRODUCT } from "@/lib/utils";
import { AddToCartButton, WishlistButton } from "./AddToCart";

export function productImage(p: Pick<ProductDTO, "thumbnail" | "images">) {
  return getSafeImageUrl(p.thumbnail || p.images?.[0], PLACEHOLDER_PRODUCT);
}

export function ProductCard({
  product,
  className,
  priority,
  imageClassName = "aspect-[4/3]",
}: {
  product: ProductDTO;
  className?: string;
  priority?: boolean;
  imageClassName?: string;
}) {
  const img = productImage(product);
  const off = discountPercent(product.price, product.compareAtPrice);
  return (
    <article className={cn("group flex h-full flex-col overflow-hidden rounded-[20px] border border-navy/8 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card", className)}>
      <div className={cn("relative shrink-0 overflow-hidden bg-baby", imageClassName)}>
        <Link href={`/shop/${product.slug}`} tabIndex={-1} aria-hidden>
          <Image
            src={img}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 260px"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {off > 0 && <span className="absolute right-12 top-3 rounded-full bg-rose px-2.5 py-1 text-xs font-bold text-white shadow-sm">-{off}%</span>}
        <WishlistButton productId={product._id} className="absolute right-3 top-2.5" />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
        <h3 className="line-clamp-2 min-h-[2.6em] font-sans text-[15px] font-semibold leading-snug text-ink">
          <Link href={`/shop/${product.slug}`} className="hover:text-rose-dark">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-bold text-navy">{formatPrice(product.price, product.currency)}</span>
          {off > 0 && product.compareAtPrice && (
            <span className="text-sm text-muted line-through">
              <span className="sr-only">Antes </span>
              {formatPrice(product.compareAtPrice, product.currency)}
            </span>
          )}
        </p>
        <div className="mt-auto flex justify-center pt-3">
          <AddToCartButton
            product={{
              _id: product._id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              image: img,
              stock: product.stock,
              trackInventory: product.trackInventory,
            }}
          />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, className }: { products: ProductDTO[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((p, i) => (
        <li key={p._id}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-navy/8 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-baby" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-navy/10" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-navy/10" />
        <div className="mx-auto h-9 w-32 animate-pulse rounded-full bg-navy/10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Sparks } from "@/components/common/Icons";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductDTO } from "@/lib/data";

export function FeaturedProducts({ heading, viewAllLabel, products }: { heading: string; viewAllLabel: string; products: ProductDTO[] }) {
  return (
    <section aria-labelledby="featured-title" className="flex h-full flex-col">
      <div className="flex items-end justify-between gap-4">
        <h2 id="featured-title" className="section-title flex items-center gap-2">
          {heading} <Sparks className="h-6 w-6" />
        </h2>
        <Link href="/shop" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy hover:text-rose-dark">
          {viewAllLabel} <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="mt-5 rounded-[20px] bg-white p-8 text-center text-muted shadow-soft">New products are coming soon.</p>
      ) : (
        <ul className="no-scrollbar -mx-4 mt-5 flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {products.map((p) => (
            <li key={p._id} className="w-[72%] shrink-0 snap-start sm:h-full sm:w-auto">
              <ProductCard product={p} imageClassName="h-48" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

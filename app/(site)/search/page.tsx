import type { Metadata } from "next";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGrid } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q || "").trim().slice(0, 80);
  const products = q ? await getProducts({ q }) : [];
  return (
    <div className="container-x py-10 lg:py-14">
      <form action="/search" role="search" className="mx-auto flex max-w-2xl gap-2">
        <label htmlFor="search-q" className="sr-only">
          Search
        </label>
        <div className="relative flex-1">
          <Search aria-hidden className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/50" />
          <input id="search-q" name="q" defaultValue={q} placeholder="Search products..." className="field rounded-full pl-12" />
        </div>
        <button type="submit" className="btn-navy">
          Search
        </button>
      </form>
      <h1 className="mt-10 font-serif text-3xl">{q ? <>Results for “{q}”</> : "Search our shop"}</h1>
      <div className="mt-6">
        {products === null ? (
          <EmptyState title="Search is temporarily unavailable" text="Please try again in a moment." />
        ) : q && products.length === 0 ? (
          <EmptyState tone="blue" title="No results found" text="Try a different word, such as “journal”, “album” or “blanket”." actionLabel="Browse all products" actionHref="/shop" />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

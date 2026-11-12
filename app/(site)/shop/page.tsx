import { getT } from "@/lib/lang";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/common/PageHero";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid, ProductGridSkeleton } from "@/components/shop/ProductCard";
import { getCategories, getCollections, getProducts, getSection, type ShopQuery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop baby journals, photo albums, keepsakes, blankets, plush toys and baby essentials.",
  alternates: { canonical: "/shop" },
};

type SP = Promise<Record<string, string | undefined>>;

async function ShopResults({ query }: { query: ShopQuery }) {
  const t = await getT();
  const products = await getProducts(query);
  if (products === null) return <EmptyState title={t("shop.errorTitle")} text={t("shop.errorText")} />;
  if (products.length === 0)
    return <EmptyState tone="blue" title={t("shop.emptyTitle")} text={t("shop.emptyText")} actionLabel={t("shop.viewAll")} actionHref="/shop" />;
  return (
    <>
      <p className="mb-4 text-sm text-muted" aria-live="polite">
        {products.length === 1 ? t("shop.count1") : t("shop.count", { n: products.length })}
      </p>
      <ProductGrid products={products} />
    </>
  );
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [{ data }, collections, categories] = await Promise.all([
    getSection<{ shopHeading: string; shopIntro: string }>("pages.misc"),
    getCollections(),
    getCategories(),
  ]);
  const activeCol = collections.find((c) => c.slug === sp.collection);
  const query: ShopQuery = { q: sp.q, collection: sp.collection, category: sp.category, sort: sp.sort };

  return (
    <>
      <PageHero title={activeCol?.name || data.shopHeading} text={activeCol?.description || data.shopIntro} />
      <section className="container-x py-10">
        <Suspense>
          <ProductFilters
            collections={collections.map(({ name, slug }) => ({ name, slug }))}
            categories={categories.map(({ name, slug }) => ({ name, slug }))}
          />
        </Suspense>
        <div className="mt-8">
          <Suspense key={JSON.stringify(query)} fallback={<ProductGridSkeleton />}>
            <ShopResults query={query} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PurchaseBox } from "@/components/shop/AddToCart";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/common/PageHero";
import { getProductBySlug, getRelatedProducts, getSettings } from "@/lib/data";
import { SITE_URL, discountPercent, formatPrice, getSafeImageUrl, PLACEHOLDER_PRODUCT } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: "Product not found" };
  const img = getSafeImageUrl(p.thumbnail || p.images[0], "");
  return {
    title: p.seoTitle || p.name,
    description: p.seoDescription || p.shortDescription || p.description.slice(0, 160),
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { title: p.seoTitle || p.name, description: p.shortDescription, images: img ? [{ url: img }] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const [related, settings] = await Promise.all([getRelatedProducts(p), getSettings()]);

  const imgs = [...new Set([p.thumbnail, ...p.images].filter(Boolean))].map((u) => getSafeImageUrl(u, PLACEHOLDER_PRODUCT));
  if (!imgs.length) imgs.push(PLACEHOLDER_PRODUCT);
  const off = discountPercent(p.price, p.compareAtPrice);
  const available = !p.trackInventory || p.stock > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription || p.description,
    sku: p.sku || undefined,
    image: imgs.map((u) => (u.startsWith("/") ? `${SITE_URL}${u}` : u)),
    brand: { "@type": "Brand", name: settings.businessName },
    category: p.category?.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${p.slug}`,
      priceCurrency: p.currency,
      price: p.price.toFixed(2),
      availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-navy">Home</Link>
            </li>
            <ChevronRight aria-hidden className="h-4 w-4" />
            <li>
              <Link href="/shop" className="hover:text-navy">Shop</Link>
            </li>
            {p.collectionRef && (
              <>
                <ChevronRight aria-hidden className="h-4 w-4" />
                <li>
                  <Link href={`/shop?collection=${p.collectionRef.slug}`} className="hover:text-navy">{p.collectionRef.name}</Link>
                </li>
              </>
            )}
            <ChevronRight aria-hidden className="h-4 w-4" />
            <li aria-current="page" className="font-medium text-navy">{p.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={imgs} name={p.name} badge={off} />
          <div>
            {p.category && (
              <Link href={`/shop?category=${p.category.slug}`} className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-dark hover:underline">
                {p.category.name}
              </Link>
            )}
            <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-[44px]">{p.name}</h1>
            {p.shortDescription && <p className="mt-3 text-lg text-ink/80">{p.shortDescription}</p>}

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold text-navy">{formatPrice(p.price, p.currency)}</span>
              {off > 0 && p.compareAtPrice && (
                <>
                  <s className="text-lg text-muted">{formatPrice(p.compareAtPrice, p.currency)}</s>
                  <span className="rounded-full bg-blush-soft px-3 py-1 text-sm font-bold text-rose-dark">Save {off}%</span>
                </>
              )}
            </div>

            <p className={`mt-3 text-sm font-semibold ${available ? "text-emerald-700" : "text-red-600"}`}>
              {!p.trackInventory ? "In stock" : p.stock > 10 ? "In stock" : p.stock > 0 ? `Only ${p.stock} left` : "Out of stock"}
              {p.sku && <span className="ml-3 font-normal text-muted">SKU: {p.sku}</span>}
            </p>

            <div className="mt-6 rounded-[22px] bg-white p-5 shadow-soft">
              <PurchaseBox
                product={{
                  _id: p._id,
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  image: imgs[0],
                  stock: p.stock,
                  trackInventory: p.trackInventory,
                }}
              />
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-ink/80 sm:grid-cols-3">
              <li className="flex items-center gap-2 rounded-2xl bg-baby/50 p-3">
                <Truck aria-hidden className="h-5 w-5 text-navy" /> {settings.shippingMessage}
              </li>
              <li className="flex items-center gap-2 rounded-2xl bg-blush-soft/70 p-3">
                <PackageCheck aria-hidden className="h-5 w-5 text-navy" /> Gift-ready
              </li>
              <li className="flex items-center gap-2 rounded-2xl bg-baby/50 p-3">
                <ShieldCheck aria-hidden className="h-5 w-5 text-navy" /> Secure shopping
              </li>
            </ul>

            {p.description && (
              <section className="mt-8">
                <h2 className="font-serif text-2xl">Description</h2>
                <div className="mt-3 whitespace-pre-line leading-relaxed text-ink/85">{p.description}</div>
              </section>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <SectionHeading title="You may also love" />
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r._id}>
                  <ProductCard product={r} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/common/PageHero";
import { DiscountBadge } from "@/components/home/HeroSection";
import { EmptyState } from "@/components/common/EmptyState";
import { productImage } from "@/components/shop/ProductCard";
import { getCollections, getOffers, getProducts, getSection } from "@/lib/data";
import { discountPercent, formatPrice, getSafeImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Product prices, collections and current discounts at BIAN&BRU.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [{ data: d }, hero, products, collections, offers] = await Promise.all([
    getSection<{ heading: string; intro: string; promoTitle: string; promoText: string; note: string }>("pricing"),
    getSection<{ badgeTitle: string; badgeSubtitle: string; badgeValue: string; badgeSuffix: string }>("home.hero"),
    getProducts({ sort: "price-asc", limit: 100 }),
    getCollections(),
    getOffers(),
  ]);

  const byCollection = collections
    .map((c) => ({ c, items: (products || []).filter((p) => p.collectionRef?._id === c._id) }))
    .filter((g) => g.items.length);
  const other = (products || []).filter((p) => !p.collectionRef || !collections.some((c) => c._id === p.collectionRef?._id));
  if (other.length) byCollection.push({ c: { _id: "other", name: "More Products", slug: "", description: "", image: "", displayOrder: 999, published: true }, items: other });

  return (
    <>
      <PageHero title={d.heading} text={d.intro} />

      <section className="container-x py-10">
        <div className="grid items-center gap-6 overflow-hidden rounded-[26px] bg-gradient-to-r from-blush-soft to-baby p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-serif text-3xl">{d.promoTitle}</h2>
            <p className="mt-2 text-lg text-ink/80">{d.promoText}</p>
            <Link href="/shop?sort=discounted" className="btn-navy mt-5">
              Ver Ofertas <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <DiscountBadge d={hero.data} className="relative mx-auto h-44 w-44" />
        </div>

        {offers.length > 0 && (
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((o) => (
              <li key={o._id} className="card flex items-center gap-4 p-4">
                {o.image && (
                  <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                    <Image src={getSafeImageUrl(o.image)} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  {o.discountLabel && <span className="rounded-full bg-rose px-2.5 py-0.5 text-xs font-bold text-white">{o.discountLabel}</span>}
                  <h3 className="mt-1 font-serif text-lg">{o.title}</h3>
                  <p className="text-sm text-ink/75">{o.description}</p>
                  <Link href={o.ctaHref} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-rose-dark">
                    {o.ctaLabel} <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="container-x pb-14">
        {products === null ? (
          <EmptyState title="Prices are temporarily unavailable" text="We could not load products right now. Please try again shortly." />
        ) : byCollection.length === 0 ? (
          <EmptyState title="No products published yet" actionLabel="Visit the shop" actionHref="/shop" />
        ) : (
          <div className="space-y-10">
            {byCollection.map(({ c, items }) => (
              <div key={c._id}>
                <SectionHeading title={c.name} />
                <div className="mt-4 overflow-hidden rounded-[22px] border border-navy/10 bg-white shadow-soft">
                  <table className="w-full text-left text-[15px]">
                    <caption className="sr-only">Precios de {c.name}</caption>
                    <thead className="bg-baby/60 text-sm text-navy">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Product</th>
                        <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((p) => {
                        const off = discountPercent(p.price, p.compareAtPrice);
                        return (
                          <tr key={p._id} className="border-t border-navy/5">
                            <td className="px-4 py-3">
                              <Link href={`/shop/${p.slug}`} className="flex items-center gap-3 font-medium text-navy hover:text-rose-dark">
                                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-baby">
                                  <Image src={productImage(p)} alt="" fill sizes="48px" className="object-cover" />
                                </span>
                                {p.name}
                              </Link>
                            </td>
                            <td className="hidden px-4 py-3 text-ink/70 sm:table-cell">{p.category?.name || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-right">
                              <span className="font-bold text-navy">{formatPrice(p.price, p.currency)}</span>
                              {off > 0 && p.compareAtPrice && (
                                <span className="ml-2 inline-flex items-center gap-1 text-sm">
                                  <s className="text-muted">{formatPrice(p.compareAtPrice, p.currency)}</s>
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-blush-soft px-2 py-0.5 text-xs font-bold text-rose-dark">
                                    <Tag aria-hidden className="h-3 w-3" />-{off}%
                                  </span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-8 text-center text-sm text-muted">{d.note}</p>
      </section>
    </>
  );
}

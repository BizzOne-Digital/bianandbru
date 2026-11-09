import type { Metadata } from "next";
import { HeroSection, type HeroData } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { StoryCards } from "@/components/home/StoryCards";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OffersSection } from "@/components/home/OffersSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BestSellers, GallerySection, GiftBanner, StepsSection, WhySection } from "@/components/home/HomeExtras";
import { getBestSellers, getCollections, getFeaturedProducts, getSection, getSettings, getTestimonials } from "@/lib/data";
import { isPreview } from "@/lib/preview";
import { Reveal } from "@/components/common/Reveal";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = { alternates: { canonical: "/" } };


export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const preview = await isPreview(await searchParams);
  const [hero, trust, story, colSec, featSec, offers, testSec, settings] = await Promise.all([
    getSection<HeroData>("home.hero"),
    getSection<{ items: { icon: string; title: string; subtitle: string }[] }>("home.trust"),
    getSection<{ cards: { icon: string; title: string; text: string; ctaLabel: string; ctaHref: string }[] }>("home.story"),
    getSection<{ heading: string; limit: number }>("home.collections"),
    getSection<{ heading: string; viewAllLabel: string; limit: number }>("home.featured"),
    getSection<{ heading: string; text: string; ctaLabel: string; ctaHref: string; image: string }>("home.offers"),
    getSection<{ heading: string }>("home.testimonials"),
    getSettings(),
  ]);
  const [best, why, gift, steps, gallery] = await Promise.all([
    getSection<{ eyebrow: string; heading: string; text: string; limit: number }>("home.bestsellers"),
    getSection<{ eyebrow: string; heading: string; text: string; image: string; points: { icon: string; title: string; text: string }[]; ctaLabel: string; ctaHref: string }>("home.why"),
    getSection<{ eyebrow: string; heading: string; text: string; image: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }>("home.gift"),
    getSection<{ heading: string; steps: { icon: string; title: string; text: string }[] }>("home.steps"),
    getSection<{ heading: string; text: string; images: { src: string; alt: string }[]; ctaLabel: string }>("home.gallery"),
  ]);
  const show = (s: { published: boolean }) => s.published || preview;
  const bestProducts = show(best) ? await getBestSellers(Number(best.data.limit) || 4) : [];

  const [collections, products, testimonials] = await Promise.all([
    show(colSec) ? getCollections() : Promise.resolve([]),
    show(featSec) ? getFeaturedProducts(Number(featSec.data.limit) || 3) : Promise.resolve([]),
    show(testSec) ? getTestimonials({ featuredFirst: true, limit: 9 }) : Promise.resolve([]),
  ]);
  const featuredCollections = collections.slice(0, Number(colSec.data.limit) || 2);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: settings.businessName,
    legalName: settings.companyName,
    url: SITE_URL,
    email: settings.email,
    telephone: settings.phone,
    sameAs: [settings.instagram, settings.facebook].filter(Boolean),
  };

  const hasCols = show(colSec) && featuredCollections.length > 0;
  const hasFeat = show(featSec);
  const hasOffers = show(offers);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      {preview && <p className="bg-amber-100 py-2 text-center text-sm font-semibold text-amber-900">Preview mode — unpublished sections are visible</p>}
      {show(hero) && <HeroSection d={hero.data} />}
      {show(trust) && <TrustStrip items={trust.data.items} />}
      {show(story) && (
        <Reveal>
          <StoryCards cards={story.data.cards} />
        </Reveal>
      )}

      {(hasCols || hasFeat || hasOffers) && (
        <div className="container-x grid grid-cols-1 gap-8 pb-12 [&>*]:min-w-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_250px] xl:gap-6">
          {hasCols && (
            <Reveal className="h-full">
              <CollectionsSection heading={colSec.data.heading} collections={featuredCollections} />
            </Reveal>
          )}
          <div className="grid min-w-0 grid-cols-1 gap-8 [&>*]:min-w-0 md:grid-cols-[1fr_260px] xl:contents">
            {hasFeat && (
              <Reveal delay={120} className="h-full">
                <FeaturedProducts heading={featSec.data.heading} viewAllLabel={featSec.data.viewAllLabel} products={products} />
              </Reveal>
            )}
            {hasOffers && (
              <Reveal delay={240} className="h-full">
                <OffersSection d={offers.data} />
              </Reveal>
            )}
          </div>
        </div>
      )}

      {show(best) && (
        <Reveal>
          <BestSellers d={best.data} products={bestProducts} />
        </Reveal>
      )}
      {show(why) && (
        <Reveal>
          <WhySection d={why.data} />
        </Reveal>
      )}
      {show(gift) && (
        <Reveal>
          <GiftBanner d={gift.data} />
        </Reveal>
      )}
      {show(steps) && (
        <Reveal>
          <StepsSection d={steps.data} />
        </Reveal>
      )}
      {show(testSec) && (
        <Reveal>
          <TestimonialsSection heading={testSec.data.heading} items={testimonials} />
        </Reveal>
      )}
      {show(gallery) && (
        <Reveal>
          <GallerySection d={gallery.data} instagram={settings.instagram} />
        </Reveal>
      )}
    </>
  );
}


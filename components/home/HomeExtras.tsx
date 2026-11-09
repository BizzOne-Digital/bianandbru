import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon, HeartLine, InstagramIcon, Sparks } from "@/components/common/Icons";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductDTO } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

type Pt = { icon: string; title: string; text: string };

export function BestSellers({ d, products }: { d: { eyebrow: string; heading: string; text: string }; products: ProductDTO[] }) {
  if (!products.length) return null;
  return (
    <section aria-labelledby="best-title" className="bg-gradient-to-b from-white to-baby/40">
      <div className="container-x py-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {d.eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark">{d.eyebrow}</p>}
            <h2 id="best-title" className="section-title mt-1 flex items-center gap-3">
              {d.heading} <HeartLine className="h-7 w-8" />
            </h2>
            {d.text && <p className="mt-2 max-w-xl text-ink/75">{d.text}</p>}
          </div>
          <Link href="/shop" className="btn-outline px-5 py-2.5 text-sm">
            Shop All <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <li key={p._id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhySection({ d }: { d: { eyebrow: string; heading: string; text: string; image: string; points: Pt[]; ctaLabel: string; ctaHref: string } }) {
  return (
    <section aria-labelledby="why-title" className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
      <div className="relative">
        <div className="absolute -left-4 -top-4 h-full w-full rounded-[30px] bg-blush-soft" aria-hidden />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-card">
          <Image src={getSafeImageUrl(d.image)} alt="Familia feliz con su bebé" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
        </div>
        <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-card sm:right-8">
          <HeartLine className="h-8 w-9" />
          <div>
            <p className="font-serif text-xl text-navy">Hecho con amor</p>
            <p className="text-xs text-muted">para cada familia</p>
          </div>
        </div>
      </div>
      <div className="pt-6 lg:pt-0">
        {d.eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark">{d.eyebrow}</p>}
        <h2 id="why-title" className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
          {d.heading}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">{d.text}</p>
        <ul className="mt-6 space-y-4">
          {d.points?.map((p, i) => (
            <li key={i} className="flex gap-4">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${i % 2 ? "bg-blush-soft" : "bg-baby"}`}>
                <BrandIcon name={p.icon} className="h-6 w-6 text-navy" />
              </span>
              <span>
                <span className="block font-semibold text-navy">{p.title}</span>
                <span className="block text-[15px] text-ink/75">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
        {d.ctaLabel && (
          <Link href={d.ctaHref || "/about"} className="btn-navy mt-8">
            {d.ctaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}

export function GiftBanner({
  d,
}: {
  d: { eyebrow: string; heading: string; text: string; image: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
}) {
  return (
    <section aria-labelledby="gift-title" className="container-x pb-16">
      <div className="grid overflow-hidden rounded-[30px] bg-gradient-to-r from-blush-soft via-white to-baby shadow-soft md:grid-cols-2">
        <div className="relative order-2 flex flex-col justify-center p-8 sm:p-12 md:order-1">
          <Sparks className="absolute right-6 top-6 h-8 w-8" />
          {d.eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark">{d.eyebrow}</p>}
          <h2 id="gift-title" className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
            {d.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/80">{d.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={d.primaryHref || "/shop"} className="btn-pink">
              {d.primaryLabel}
            </Link>
            {d.secondaryLabel && (
              <Link href={d.secondaryHref || "/booking"} className="btn-outline">
                {d.secondaryLabel}
              </Link>
            )}
          </div>
        </div>
        <div className="relative order-1 aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[420px]">
          <Image src={getSafeImageUrl(d.image)} alt="Caja de regalo rosa con osito y accesorios para bebé" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

export function StepsSection({ d }: { d: { heading: string; steps: Pt[] } }) {
  if (!d.steps?.length) return null;
  return (
    <section aria-labelledby="steps-title" className="bg-navy">
      <div className="container-x py-14">
        <h2 id="steps-title" className="text-center font-serif text-3xl text-white sm:text-4xl">
          {d.heading}
        </h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.steps.map((s, i) => (
            <li key={i} className="rounded-[22px] bg-white/5 p-6 text-center ring-1 ring-white/10 transition hover:-translate-y-1 hover:bg-white/10">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush">
                <BrandIcon name={s.icon} className="h-7 w-7 text-navy" />
              </span>
              <h3 className="mt-4 font-serif text-xl text-white">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function GallerySection({ d, instagram }: { d: { heading: string; text: string; images: { src: string; alt: string }[]; ctaLabel: string }; instagram?: string }) {
  if (!d.images?.length) return null;
  return (
    <section aria-labelledby="gallery-title" className="container-x py-16">
      <div className="text-center">
        <h2 id="gallery-title" className="section-title inline-flex items-center gap-3">
          {d.heading} <HeartLine className="h-7 w-8" />
        </h2>
        {d.text && <p className="mx-auto mt-3 max-w-xl text-ink/75">{d.text}</p>}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
        {d.images.slice(0, 5).map((img, i) => (
          <li
            key={i}
            className={`group relative overflow-hidden rounded-[20px] ${i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-square"}`}
          >
            <Image src={getSafeImageUrl(img.src)} alt={img.alt || ""} fill sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"} className="object-cover transition duration-700 group-hover:scale-[1.05]" />
            <span className="absolute inset-0 bg-navy/0 transition group-hover:bg-navy/15" aria-hidden />
          </li>
        ))}
      </ul>
      {instagram && d.ctaLabel && (
        <div className="mt-8 text-center">
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <InstagramIcon className="h-5 w-5" /> {d.ctaLabel}
          </a>
        </div>
      )}
    </section>
  );
}

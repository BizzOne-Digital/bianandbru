"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HeartLine, StarRating } from "@/components/common/Icons";
import type { TestimonialDTO } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

export function TestimonialCard({ t }: { t: TestimonialDTO }) {
  return (
    <figure className="flex h-full items-start gap-4 rounded-[18px] bg-white p-5 shadow-soft">
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-baby ring-4 ring-blush-soft">
        <Image src={getSafeImageUrl(t.photo)} alt={t.name} fill sizes="64px" className="object-cover" />
      </span>
      <div className="min-w-0">
        <blockquote className="text-[14.5px] leading-relaxed text-ink/90">“{t.review}”</blockquote>
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <StarRating rating={t.rating} />
          <span className="text-sm font-semibold text-navy">
            — {t.name}
            {t.location && <span className="font-normal text-muted">, {t.location}</span>}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

export function TestimonialsSection({ heading, items }: { heading: string; items: TestimonialDTO[] }) {
  const ref = useRef<HTMLUListElement>(null);
  if (!items.length) return null;
  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth / (window.innerWidth >= 1024 ? 3 : 1)), behavior: "smooth" });
  };
  const showArrows = items.length > 3;

  return (
    <section aria-labelledby="testimonials-title" className="bg-blush-soft/80">
      <div className="container-x grid grid-cols-1 items-center gap-6 py-10 [&>*]:min-w-0 lg:grid-cols-[260px_1fr]">
        <h2 id="testimonials-title" className="section-title flex items-center gap-3">
          {heading} <HeartLine className="h-7 w-8" />
        </h2>
        <div className="flex min-w-0 items-center gap-3">
          {showArrows && (
            <button type="button" onClick={() => scroll(-1)} aria-label="Testimonios anteriores" className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-navy/20 bg-white text-navy hover:bg-navy hover:text-white lg:grid">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <ul ref={ref} className="no-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-1">
            {items.map((t) => (
              <li key={t._id} className="w-[88%] shrink-0 snap-start sm:w-[48%] lg:w-[calc((100%-2rem)/3)]">
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
          {showArrows && (
            <button type="button" onClick={() => scroll(1)} aria-label="Siguientes testimonios" className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-navy/20 bg-white text-navy hover:bg-navy hover:text-white lg:grid">
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

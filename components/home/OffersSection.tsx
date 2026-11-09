import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeartLine, Sparks } from "@/components/common/Icons";
import { getSafeImageUrl } from "@/lib/utils";

/** Pastel gift boxes drawn in SVG (used when no promo image is uploaded). */
function GiftBoxes({ className }: { className?: string }) {
  const box = (x: number, w: number, h: number, body: string, lid: string, ribbon: string) => (
    <g>
      <rect x={x} y={150 - h} width={w} height={h} rx="4" fill={body} />
      <rect x={x - 5} y={150 - h - 14} width={w + 10} height="16" rx="3" fill={lid} />
      <rect x={x + w / 2 - 5} y={150 - h - 14} width="10" height={h + 14} fill={ribbon} />
      <path d={`M${x + w / 2} ${150 - h - 14}c-14-18-30-6-16 0M${x + w / 2} ${150 - h - 14}c14-18 30-6 16 0`} stroke={ribbon} strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 230 160" className={className} aria-hidden>
      <ellipse cx="115" cy="152" rx="110" ry="7" fill="#0A3158" opacity=".06" />
      {box(14, 62, 62, "#F8D3DB", "#F6C5CF", "#ffffff")}
      {box(86, 66, 92, "#C8E6F4", "#B4DAEE", "#ffffff")}
      {box(162, 56, 74, "#F6C5CF", "#F2B3C1", "#ffffff")}
    </svg>
  );
}

export function OffersSection({ d }: { d: { heading: string; text: string; ctaLabel: string; ctaHref: string; image?: string } }) {
  const img = d.image ? getSafeImageUrl(d.image, "") : "";
  return (
    <aside aria-labelledby="offers-title" className="relative flex h-full flex-col items-center overflow-hidden rounded-[26px] bg-gradient-to-b from-blush-soft via-white to-white px-5 pb-4 pt-8 text-center">
      <Sparks className="absolute left-3 top-3 h-7 w-7 rotate-[200deg]" />
      <Sparks className="absolute right-3 top-3 h-7 w-7 -scale-x-100 rotate-[200deg]" />
      <div className="relative rounded-[40%_60%_55%_45%/55%_45%_55%_45%] bg-blush/70 px-7 py-5">
        <h2 id="offers-title" className="font-serif text-[26px] leading-tight text-navy sm:text-[30px]">
          {d.heading}
        </h2>
        <HeartLine className="absolute -right-3 bottom-2 h-7 w-8" />
      </div>
      <p className="mt-4 max-w-[220px] text-[15px] font-medium text-ink">{d.text}</p>
      <Link href={d.ctaHref || "/shop?sort=discounted"} className="btn-navy mt-4 px-6 py-2.5 text-sm">
        {d.ctaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
      <div className="relative mt-auto w-full pt-4">
        {img ? (
          <div className="relative mx-auto aspect-[3/2] w-full max-w-[260px] overflow-hidden rounded-2xl">
            <Image src={img} alt="" fill sizes="260px" className="object-cover" />
          </div>
        ) : (
          <GiftBoxes className="mx-auto w-full max-w-[240px]" />
        )}
      </div>
    </aside>
  );
}

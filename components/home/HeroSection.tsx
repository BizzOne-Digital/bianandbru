import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { HeartLine, Sparks } from "@/components/common/Icons";
import { getSafeImageUrl } from "@/lib/utils";

export type HeroData = {
  eyebrow?: string;
  headline: string;
  highlight: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  heroImage: string;
  backgroundImage?: string;
  badgeEnabled: boolean;
  badgeTitle: string;
  badgeSubtitle: string;
  badgeValue: string;
  badgeSuffix: string;
};

/** Scalloped circle path for the promo badge. */
function scallop(cx: number, cy: number, r: number, bumps = 22, depth = 6) {
  const pts: string[] = [];
  const steps = bumps * 8;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r + Math.cos(a * bumps) * depth * 0.5;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}
const BADGE_PATH = scallop(100, 100, 92);

export function DiscountBadge({ d, className = "" }: { d: Pick<HeroData, "badgeTitle" | "badgeSubtitle" | "badgeValue" | "badgeSuffix">; className?: string }) {
  return (
    <Link href="/shop?sort=discounted" aria-label={`${d.badgeTitle}: ${d.badgeSubtitle} ${d.badgeValue} ${d.badgeSuffix}`} className={`group block ${className}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_10px_20px_rgba(224,122,146,0.35)] transition group-hover:scale-[1.03]" aria-hidden>
        <path d={BADGE_PATH} fill="#F6C5CF" />
        <circle cx="100" cy="100" r="80" fill="#FBE5EA" stroke="#fff" strokeWidth="3" strokeDasharray="2 5" />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none text-navy">
        <span className="font-serif text-[clamp(16px,2vw,28px)] font-semibold">{d.badgeTitle}</span>
        <span className="mt-[0.5em] font-serif text-[clamp(11px,1.15vw,17px)] font-semibold">{d.badgeSubtitle}</span>
        <span className="mt-[0.35em] font-serif text-[clamp(22px,2.6vw,38px)] font-bold">
          {d.badgeValue} <span className="text-[0.55em] text-rose-dark">{d.badgeSuffix}</span>
        </span>
      </span>
      <Sparks className="absolute -right-1 top-3 h-6 w-6" />
    </Link>
  );
}

export function HeroSection({ d }: { d: HeroData }) {
  const hero = getSafeImageUrl(d.heroImage);
  const bg = d.backgroundImage ? getSafeImageUrl(d.backgroundImage, "") : "";
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-warm via-[#f3f6fb] to-baby" aria-labelledby="hero-title">
      {bg && <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />}

      {/* Desktop/tablet image: right side, fades into the text area */}
      <div className="absolute inset-y-0 right-0 hidden w-[64%] md:block">
        <Image src={hero} alt="Bebé feliz con accesorios suaves" fill priority sizes="64vw" className="animate-hero-zoom object-cover object-[60%_35%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm via-warm/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blush-soft/70 to-transparent" />
      </div>

      <div className="container-x relative">
        <div className="grid min-h-[auto] items-center md:min-h-[440px] lg:min-h-[480px]">
          <div className="relative z-10 max-w-[660px] py-10 md:py-14">
            {d.eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark">{d.eyebrow}</p>}
            <h1 id="hero-title" className="animate-fade-up [animation-delay:150ms] font-serif text-[38px] font-bold leading-[1.08] text-navy sm:text-5xl lg:text-[52px]">
              {d.headline}
            </h1>
            <p className="mt-4 flex animate-fade-up items-end gap-2 [animation-delay:350ms] font-serif text-[24px] italic leading-snug text-navy sm:text-[30px] lg:text-[34px]">
              <span>{d.highlight}</span>
              <HeartLine className="mb-2 h-8 w-9 shrink-0 animate-float sm:h-10 sm:w-11" />
            </p>
            <p className="mt-5 max-w-md animate-fade-up [animation-delay:500ms] text-[17px] leading-relaxed text-ink/85">{d.description}</p>
            <div className="mt-7 grid animate-fade-up grid-cols-2 gap-3 [animation-delay:650ms] sm:flex sm:gap-5">
              <Link href={d.primaryHref || "/shop"} className="btn-pink px-5 py-3.5 sm:px-8">
                {d.primaryLabel}
                <ShoppingBag aria-hidden className="h-4 w-4" />
              </Link>
              <Link href={d.secondaryHref || "/#collections"} className="btn-outline px-5 py-3.5 sm:px-8">
                {d.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>

        {d.badgeEnabled && <DiscountBadge d={d} className="absolute bottom-8 right-6 z-10 hidden animate-badge-in [animation-delay:900ms] h-[190px] w-[190px] md:block lg:right-10 lg:h-[200px] lg:w-[200px]" />}
      </div>

      {/* Mobile image: below text, face kept in frame */}
      <div className="relative mx-4 mb-8 aspect-[4/3] overflow-hidden rounded-[24px] shadow-card md:hidden">
        <Image src={hero} alt="Bebé feliz con accesorios suaves" fill sizes="100vw" className="animate-hero-zoom object-cover object-[55%_30%]" />
        {d.badgeEnabled && <DiscountBadge d={d} className="absolute right-2 top-2 h-[110px] w-[110px] animate-badge-in [animation-delay:700ms]" />}
      </div>
    </section>
  );
}

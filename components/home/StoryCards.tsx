import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "@/components/common/Icons";

type Card = { icon: string; title: string; text: string; ctaLabel: string; ctaHref: string };

const TONES = ["from-baby/70 to-white", "from-white to-baby/40", "from-blush-soft to-white", "from-baby/60 to-white"];
const ICON_TONES = ["text-navy", "text-navy", "text-rose-dark", "text-navy"];

export function StoryCards({ cards }: { cards: Card[] }) {
  if (!cards?.length) return null;
  return (
    <section aria-label="Sobre nosotros" className="container-x py-8 lg:py-10">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <li key={i} className={`flex flex-col rounded-[22px] border border-navy/5 bg-gradient-to-br p-6 shadow-soft transition hover:-translate-y-1 ${TONES[i % 4]}`}>
            <h2 className="flex items-center gap-3 font-serif text-[22px] text-navy">
              <BrandIcon name={c.icon} className={`h-8 w-8 shrink-0 ${ICON_TONES[i % 4]}`} strokeWidth={1.4} />
              {c.title}
            </h2>
            <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink/85">{c.text}</p>
            {c.ctaLabel && (
              <Link href={c.ctaHref || "/about"} className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-navy hover:text-rose-dark">
                {c.ctaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

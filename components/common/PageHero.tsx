import Image from "next/image";
import { HeartLine } from "@/components/common/Icons";
import { getSafeImageUrl } from "@/lib/utils";

/** Inner-page hero in the same soft blue/pink language as the home hero. */
export function PageHero({ title, text, image, eyebrow }: { title: string; text?: string; image?: string; eyebrow?: string }) {
  const img = image ? getSafeImageUrl(image, "") : "";
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-baby via-warm to-blush-soft">
      <div className="container-x grid items-center gap-8 py-12 md:grid-cols-[1.2fr_1fr] md:py-16">
        <div className="animate-fade-up">
          {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark">{eyebrow}</p>}
          <h1 className="flex items-start gap-3 font-serif text-4xl leading-tight text-navy sm:text-5xl">
            {title}
            <HeartLine className="mt-1 h-8 w-9 shrink-0" />
          </h1>
          {text && <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80">{text}</p>}
        </div>
        {img && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-card md:aspect-[5/4]">
            <Image src={img} alt="" fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({ title, className = "" }: { title: string; className?: string }) {
  return (
    <h2 className={`section-title flex items-center gap-3 ${className}`}>
      {title}
      <HeartLine className="h-6 w-7" />
    </h2>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/PageHero";
import type { TaxonomyDTO } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

export function CollectionCard({ c, i }: { c: TaxonomyDTO; i: number }) {
  const pink = i % 2 === 0;
  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-[22px] border border-navy/5 shadow-soft ${pink ? "bg-blush-soft/70" : "bg-baby/70"}`}>
      <Link href={`/shop?collection=${c.slug}`} tabIndex={-1} aria-hidden className="relative block h-48 shrink-0 overflow-hidden">
        <Image src={getSafeImageUrl(c.image)} alt="" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
      </Link>
      <div className="flex flex-1 flex-col items-center px-5 pb-5 pt-4 text-center">
        <h3 className="font-serif text-[20px] leading-tight text-navy">{c.name}</h3>
        <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink/80">{c.description}</p>
        <Link
          href={`/shop?collection=${c.slug}`}
          className={`btn mt-3 px-5 py-2 text-[13px] text-white ${pink ? "bg-rose hover:bg-rose-dark" : "bg-[#8fb9d6] hover:bg-navy"}`}
        >
          Shop Collection <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function CollectionsSection({ heading, collections }: { heading: string; collections: TaxonomyDTO[] }) {
  if (!collections.length) return null;
  return (
    <section id="collections" aria-labelledby="collections-title" className="flex h-full scroll-mt-28 flex-col">
      <div id="collections-title">
        <SectionHeading title={heading} />
      </div>
      <ul className="mt-5 grid flex-1 gap-4 sm:grid-cols-2">
        {collections.map((c, i) => (
          <li key={c._id} className="h-full">
            <CollectionCard c={c} i={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

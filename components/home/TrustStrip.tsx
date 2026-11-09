import { BrandIcon } from "@/components/common/Icons";

type Item = { icon: string; title: string; subtitle: string };

export function TrustStrip({ items }: { items: Item[] }) {
  if (!items?.length) return null;
  return (
    <section aria-label="Beneficios" className="border-y border-blush/50 bg-blush-soft/80">
      <ul className="container-x grid grid-cols-2 gap-y-5 py-5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-navy/10 lg:py-6">
        {items.map((it, i) => (
          <li key={i} className={`flex items-center gap-3 px-2 lg:justify-center lg:px-4 ${i === items.length - 1 && items.length % 2 ? "col-span-2 sm:col-span-1" : ""}`}>
            <BrandIcon name={it.icon} className="h-9 w-9 shrink-0 text-navy" strokeWidth={1.3} />
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold text-navy sm:text-[15px]">{it.title}</span>
              <span className="block text-[13px] text-ink/75">{it.subtitle}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

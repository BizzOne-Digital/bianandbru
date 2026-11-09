"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { useDebounced } from "@/components/layout/SearchPanel";
import { cn } from "@/lib/utils";

type Opt = { name: string; slug: string };

export const SORTS = [
  { value: "", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "featured", label: "Featured" },
  { value: "discounted", label: "On sale" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ProductFilters({ collections, categories }: { collections: Opt[]; categories: Opt[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");
  const dq = useDebounced(q, 350);
  const [open, setOpen] = useState(false);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  useEffect(() => {
    if ((params.get("q") ?? "") !== dq.trim()) update("q", dq.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq]);

  const active = ["collection", "category", "sort", "q"].some((k) => params.get(k));

  const Chips = ({ label, k, opts }: { label: string; k: string; opts: Opt[] }) =>
    opts.length ? (
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-navy">{label}</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => update(k, "")} aria-pressed={!params.get(k)} className={chip(!params.get(k))}>
            All
          </button>
          {opts.map((o) => (
            <button key={o.slug} type="button" onClick={() => update(k, o.slug)} aria-pressed={params.get(k) === o.slug} className={chip(params.get(k) === o.slug)}>
              {o.name}
            </button>
          ))}
        </div>
      </fieldset>
    ) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="shop-q" className="sr-only">
            Search products
          </label>
          <Search aria-hidden className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/50" />
          <input id="shop-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="field rounded-full pl-12" />
          {pending && <Loader2 aria-label="Loading" className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-navy/50" />}
        </div>
        <div className="flex gap-2">
          <label htmlFor="shop-sort" className="sr-only">
            Sort
          </label>
          <select id="shop-sort" value={params.get("sort") ?? ""} onChange={(e) => update("sort", e.target.value)} className="field flex-1 rounded-full sm:w-56">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="shop-filters" className="btn-outline px-4 py-2.5 md:hidden">
            <SlidersHorizontal aria-hidden className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>
      <div id="shop-filters" className={cn("space-y-4 rounded-[20px] bg-white p-4 shadow-soft md:block", open ? "block" : "hidden")}>
        <Chips label="Collections" k="collection" opts={collections} />
        <Chips label="Categories" k="category" opts={categories} />
        {active && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              start(() => router.replace(pathname, { scroll: false }));
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-rose-dark hover:underline"
          >
            <X aria-hidden className="h-4 w-4" /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

function chip(on: boolean) {
  return cn(
    "min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition",
    on ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40 hover:bg-baby/50"
  );
}

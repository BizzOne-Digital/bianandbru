"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { cn, formatPrice, getSafeImageUrl, PLACEHOLDER_PRODUCT } from "@/lib/utils";

type Hit = { _id: string; name: string; slug: string; price: number; thumbnail: string; images: string[] };

export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const dq = useDebounced(q.trim(), 300);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (dq.length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(dq)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setHits(d.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [dq]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <button type="button" aria-label="Cerrar búsqueda" onClick={onClose} className="absolute inset-0 bg-navy/40" />
      <div className="relative mx-auto mt-0 w-full max-w-2xl bg-white p-4 shadow-2xl sm:mt-24 sm:rounded-3xl sm:p-6">
        <form onSubmit={submit} className="flex items-center gap-2">
          <label htmlFor="site-search" className="sr-only">
            Buscar
          </label>
          <div className="relative flex-1">
            <Search aria-hidden className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/50" />
            <input
              id="site-search"
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search journals, albums, blankets..."
              className="field rounded-full py-3.5 pl-12"
              autoComplete="off"
            />
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid h-11 w-11 place-items-center rounded-full hover:bg-baby">
            <X className="h-6 w-6 text-navy" />
          </button>
        </form>
        <div className="mt-4 max-h-[60vh] overflow-y-auto" aria-live="polite">
          {loading && (
            <p className="flex items-center gap-2 px-2 py-3 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching...
            </p>
          )}
          {!loading && dq.length >= 2 && hits.length === 0 && <p className="px-2 py-3 text-sm text-muted">No products found for “{dq}”.</p>}
          <ul className="space-y-1">
            {hits.map((h) => (
              <li key={h._id}>
                <Link href={`/shop/${h.slug}`} onClick={onClose} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-blush-soft">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-baby">
                    <Image src={getSafeImageUrl(h.thumbnail || h.images?.[0], PLACEHOLDER_PRODUCT)} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="flex-1 font-medium text-navy">{h.name}</span>
                  <span className="font-semibold text-navy">{formatPrice(h.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          {hits.length > 0 && (
            <Link href={`/search?q=${encodeURIComponent(q.trim())}`} onClick={onClose} className={cn("btn-navy mt-3 w-full")}>
              View all results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

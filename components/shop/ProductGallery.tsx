"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name, badge }: { images: string[]; name: string; badge?: number }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-baby shadow-card">
        <Image src={list[active]} alt={`${name} — imagen ${active + 1}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        {badge ? <span className="absolute left-4 top-4 rounded-full bg-rose px-3 py-1 text-sm font-bold text-white">-{badge}%</span> : null}
      </div>
      {list.length > 1 && (
        <ul className="no-scrollbar flex gap-3 overflow-x-auto" aria-label="Galería">
          {list.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={i === active}
                className={cn("relative block h-20 w-20 overflow-hidden rounded-2xl border-2 transition", i === active ? "border-navy" : "border-transparent opacity-75 hover:opacity-100")}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

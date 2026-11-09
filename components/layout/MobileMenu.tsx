"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChevronRight, ShoppingCart, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav";

export function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (h: string) => boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-50 xl:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Cerrar menú"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn("absolute inset-0 bg-navy/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
      />
      <nav
        aria-label="Menú móvil"
        className={cn(
          "absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
          <span className="font-serif text-xl text-navy">Menú</span>
          <button type="button" onClick={onClose} aria-label="Cerrar menú" tabIndex={open ? 0 : -1} className="grid h-11 w-11 place-items-center rounded-full hover:bg-baby">
            <X className="h-6 w-6 text-navy" />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                tabIndex={open ? 0 : -1}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] font-medium text-navy hover:bg-blush-soft",
                  isActive(l.href) && "bg-blush-soft"
                )}
              >
                {l.label}
                <ChevronRight aria-hidden className="h-5 w-5 text-navy/40" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-3 border-t border-navy/10 p-4">
          <Link href="/account" tabIndex={open ? 0 : -1} className="btn-outline py-2.5">
            <User aria-hidden className="h-4 w-4" /> Account
          </Link>
          <Link href="/cart" tabIndex={open ? 0 : -1} className="btn-pink py-2.5">
            <ShoppingCart aria-hidden className="h-4 w-4" /> Cart
          </Link>
        </div>
      </nav>
    </div>
  );
}

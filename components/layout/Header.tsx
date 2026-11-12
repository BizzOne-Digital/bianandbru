"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useCart } from "@/components/shop/CartProvider";
import { useLang } from "@/components/common/LangProvider";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav";
import { MobileMenu } from "./MobileMenu";
import { SearchPanel } from "./SearchPanel";

export function Header({ logo, name, company }: { logo?: string; name: string; company: string }) {
  const pathname = usePathname();
  const { count, bump, ready } = useCart();
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow",
          scrolled ? "border-navy/10 shadow-soft" : "border-transparent"
        )}
      >
        <div className={cn("container-x flex items-center justify-between gap-4 transition-all", scrolled ? "h-[68px]" : "h-[72px] lg:h-[84px]")}>
          <Logo logoUrl={logo} name={name} company={company} />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[15px] font-medium text-navy transition hover:bg-blush-soft",
                      isActive(l.href) && "bg-blush text-navy"
                    )}
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t("nav.search")}
              className="grid h-11 w-11 place-items-center rounded-full text-navy hover:bg-baby"
            >
              <Search className="h-6 w-6" strokeWidth={1.7} />
            </button>
            <Link href="/account" aria-label={t("nav.account")} className="hidden h-11 w-11 place-items-center rounded-full text-navy hover:bg-baby sm:grid">
              <User className="h-6 w-6" strokeWidth={1.7} />
            </Link>
            <Link href="/cart" aria-label={`${t("nav.cart")} (${count})`} className="relative grid h-11 w-11 place-items-center rounded-full text-navy hover:bg-baby">
              <ShoppingCart className="h-6 w-6" strokeWidth={1.7} />
              <span
                key={bump}
                className={cn(
                  "absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 text-[11px] font-bold text-white",
                  bump > 0 && "animate-pop"
                )}
              >
                {ready ? count : 0}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("nav.openMenu")}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full text-navy hover:bg-baby xl:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

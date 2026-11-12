import { getT } from "@/lib/lang";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, ShoppingCart } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { WishlistView } from "@/components/shop/WishlistView";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export default async function AccountPage() {
  const t = await getT();
  return (
    <>
      <PageHero title={t("account.title")} text={t("account.intro")} />
      <div className="container-x py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/cart" className="card flex items-center gap-4 p-6 hover:-translate-y-0.5 transition">
            <ShoppingCart aria-hidden className="h-8 w-8 text-navy" />
            <span>
              <span className="block font-serif text-xl text-navy">{t("account.cart")}</span>
              <span className="text-sm text-muted">{t("account.cartText")}</span>
            </span>
          </Link>
          <Link href="/booking" className="card flex items-center gap-4 p-6 hover:-translate-y-0.5 transition">
            <CalendarHeart aria-hidden className="h-8 w-8 text-rose-dark" />
            <span>
              <span className="block font-serif text-xl text-navy">{t("account.help")}</span>
              <span className="text-sm text-muted">{t("account.helpText")}</span>
            </span>
          </Link>
        </div>
        <h2 className="section-title mt-12">{t("account.wishlist")}</h2>
        <WishlistView />
      </div>
    </>
  );
}

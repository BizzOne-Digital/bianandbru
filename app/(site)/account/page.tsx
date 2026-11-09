import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, ShoppingCart } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { WishlistView } from "@/components/shop/WishlistView";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export default function AccountPage() {
  return (
    <>
      <PageHero title="My Account" text="Your wishlist and cart are saved on this device. No registration is required to shop." />
      <div className="container-x py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/cart" className="card flex items-center gap-4 p-6 hover:-translate-y-0.5 transition">
            <ShoppingCart aria-hidden className="h-8 w-8 text-navy" />
            <span>
              <span className="block font-serif text-xl text-navy">My Cart</span>
              <span className="text-sm text-muted">Review items and checkout</span>
            </span>
          </Link>
          <Link href="/booking" className="card flex items-center gap-4 p-6 hover:-translate-y-0.5 transition">
            <CalendarHeart aria-hidden className="h-8 w-8 text-rose-dark" />
            <span>
              <span className="block font-serif text-xl text-navy">Need help with an order?</span>
              <span className="text-sm text-muted">Contact our team</span>
            </span>
          </Link>
        </div>
        <h2 className="section-title mt-12">My Wishlist</h2>
        <WishlistView />
      </div>
    </>
  );
}

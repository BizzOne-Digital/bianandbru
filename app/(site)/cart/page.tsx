import { getT } from "@/lib/lang";
import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = { title: "Shopping Cart", robots: { index: false } };

export default async function CartPage() {
  const t = await getT();
  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="font-serif text-4xl">{t("cart.title")}</h1>
      <CartView />
    </div>
  );
}

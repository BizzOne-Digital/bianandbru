import { getT } from "@/lib/lang";
import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const t = await getT();
  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="font-serif text-4xl">{t("checkout.title")}</h1>
      <p className="mt-2 max-w-2xl text-ink/75">
        {t("checkout.intro")}
      </p>
      <CheckoutForm />
    </div>
  );
}

"use client";

import { useLang } from "@/components/common/LangProvider";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { useCart } from "./CartProvider";
import { OrderSummary } from "./CartView";
import type { DictKey } from "@/lib/i18n";

const FIELDS: { name: string; label: DictKey; type?: string; auto?: string; full?: boolean; required?: boolean }[] = [
  { name: "name", label: "checkout.name", auto: "name", required: true },
  { name: "email", label: "checkout.email", type: "email", auto: "email", required: true },
  { name: "phone", label: "checkout.phone", type: "tel", auto: "tel", required: true },
  { name: "address", label: "checkout.address", auto: "street-address", full: true, required: true },
  { name: "city", label: "checkout.city", auto: "address-level2", required: true },
  { name: "state", label: "checkout.state", auto: "address-level1" },
  { name: "zip", label: "checkout.zip", auto: "postal-code", required: true },
];

export function CheckoutForm() {
  const { items, ready, clear } = useCart();
  const { t } = useLang();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (ready && !items.length)
    return (
      <div className="mt-10">
        <EmptyState title={t("cart.emptyTitle")} actionLabel={t("cart.shopNow")} actionHref="/shop" />
      </div>
    );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const customer = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("checkout.error"));
      clear();
      router.push(`/order-success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("checkout.error");
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <h2 className="font-serif text-2xl sm:col-span-2">{t("checkout.contact")}</h2>
        {FIELDS.map((f) => (
          <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
            <label htmlFor={`co-${f.name}`} className="label">
              {t(f.label)}
              {f.required && " *"}
            </label>
            <input id={`co-${f.name}`} name={f.name} type={f.type || "text"} autoComplete={f.auto} required={f.required} className="field" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="co-notes" className="label">
            {t("checkout.notes")}
          </label>
          <textarea id="co-notes" name="notes" rows={3} className="field" />
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">
            {error}
          </p>
        )}
      </div>
      <OrderSummary>
        <button type="submit" disabled={loading || !ready} className="btn-pink mt-6 w-full">
          {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Lock aria-hidden className="h-4 w-4" />}
          {loading ? t("checkout.submitting") : t("checkout.submit")}
        </button>
        <p className="mt-3 text-center text-xs text-muted">{t("checkout.note")}</p>
      </OrderSummary>
    </form>
  );
}

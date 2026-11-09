import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Terms & Conditions" text={`Terms for shopping with ${s.businessName}.`} />
      <article className="container-x max-w-3xl space-y-6 py-14 leading-relaxed text-ink/85 [&_h2]:mt-8 [&_h2]:text-2xl">
        <p>By using this website you agree to the terms below. Please have them reviewed by your legal advisor before launch.</p>
        <h2>Products and pricing</h2>
        <p>Prices are shown in {s.currency}. Discounts are shown on each product. We may correct pricing errors before an order is confirmed.</p>
        <h2>Order requests</h2>
        <p>Submitting the checkout form creates an order request. Your order is confirmed only after our team contacts you and payment is completed.</p>
        <h2>Shipping and returns</h2>
        <p>Shipping costs and delivery times are confirmed with you before payment. Contact us about returns of unused items in original condition.</p>
        <h2>Contact</h2>
        <p>
          {s.companyName} — <a className="font-semibold text-navy underline" href={`mailto:${s.footerEmail}`}>{s.footerEmail}</a> · {s.phone}
        </p>
      </article>
    </>
  );
}

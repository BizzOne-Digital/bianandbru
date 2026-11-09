import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="Privacy Policy" text={`How ${s.companyName} (${s.businessName}) handles your information.`} />
      <article className="container-x max-w-3xl space-y-6 py-14 leading-relaxed text-ink/85 [&_h2]:mt-8 [&_h2]:text-2xl">
        <p>This policy explains what information we collect when you use our website and how we use it. Please have it reviewed by your legal advisor before launch.</p>
        <h2>Information we collect</h2>
        <p>Contact details you submit through our booking, newsletter and order request forms (name, email, phone, delivery address and messages).</p>
        <h2>How we use it</h2>
        <p>To respond to your requests, process and deliver orders, and — only if you subscribe — send news and exclusive discounts. We do not sell your personal information.</p>
        <h2>Cart and wishlist</h2>
        <p>Your cart and wishlist are stored in your own browser (local storage) and are not sent to us until you submit an order request.</p>
        <h2>Your choices</h2>
        <p>You can ask us to access, correct or delete your information, or unsubscribe at any time.</p>
        <h2>Contact</h2>
        <p>
          Email <a className="font-semibold text-navy underline" href={`mailto:${s.footerEmail}`}>{s.footerEmail}</a> or call {s.phone}.
        </p>
      </article>
    </>
  );
}

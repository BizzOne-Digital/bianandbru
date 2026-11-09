import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { EmptyState } from "@/components/common/EmptyState";
import { getFaqs, getSection } from "@/lib/data";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about BIAN&BRU orders, products and shipping.", alternates: { canonical: "/faq" } };

export default async function FaqPage() {
  const [{ data }, faqs] = await Promise.all([getSection<{ faqHeading: string; faqIntro: string }>("pages.misc"), getFaqs()]);
  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    (acc[f.category || "General"] ||= []).push(f);
    return acc;
  }, {});
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      {faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <PageHero title={data.faqHeading} text={data.faqIntro} />
      <section className="container-x max-w-4xl py-14">
        {faqs.length === 0 ? (
          <EmptyState title="No questions yet" text="Have a question? We are happy to help." actionLabel="Contact us" actionHref="/booking" />
        ) : (
          <div className="space-y-10">
            {Object.entries(groups).map(([cat, items]) => (
              <div key={cat}>
                <h2 className="section-title text-2xl">{cat}</h2>
                <div className="mt-4 space-y-3">
                  {items.map((f) => (
                    <details key={f._id} className="group rounded-[18px] border border-navy/10 bg-white shadow-soft open:bg-baby/30">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                        {f.question}
                        <ChevronDown aria-hidden className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
                      </summary>
                      <p className="whitespace-pre-line px-5 pb-5 leading-relaxed text-ink/85">{f.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-12 text-center text-ink/75">
          Still have questions?{" "}
          <Link href="/booking" className="font-semibold text-navy underline underline-offset-4 hover:text-rose-dark">
            Send us a message
          </Link>
        </p>
      </section>
    </>
  );
}

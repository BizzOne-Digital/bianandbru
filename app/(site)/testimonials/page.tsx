import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { EmptyState } from "@/components/common/EmptyState";
import { TestimonialCard } from "@/components/home/TestimonialsSection";
import { getSection, getTestimonials } from "@/lib/data";

export const metadata: Metadata = { title: "Testimonials", description: "What families say about BIAN&BRU.", alternates: { canonical: "/testimonials" } };

export default async function TestimonialsPage() {
  const [{ data }, items] = await Promise.all([
    getSection<{ testimonialsHeading: string; testimonialsIntro: string }>("pages.misc"),
    getTestimonials({ featuredFirst: true }),
  ]);
  const avg = items.length ? items.reduce((s, t) => s + t.rating, 0) / items.length : 0;
  return (
    <>
      <PageHero title={data.testimonialsHeading} text={data.testimonialsIntro} />
      <section className="container-x py-14">
        {items.length === 0 ? (
          <EmptyState title="No reviews yet" text="Be one of the first families to share your experience." />
        ) : (
          <>
            <p className="mb-8 text-center text-lg text-ink/80">
              <strong className="font-serif text-3xl text-navy">{avg.toFixed(1)}</strong> / 5 from {items.length} reviews
            </p>
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((t) => (
                <li key={t._id}>
                  <TestimonialCard t={t} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

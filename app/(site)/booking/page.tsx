import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { BookingForm } from "@/components/common/BookingForm";
import { getSection, getSettings } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Booking",
  description: "Request a consultation or contact BIAN&BRU for gift help and personalized keepsakes.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage() {
  const [{ data }, s] = await Promise.all([
    getSection<{ bookingHeading: string; bookingIntro: string; bookingImage: string }>("pages.misc"),
    getSettings(),
  ]);
  return (
    <>
      <PageHero title={data.bookingHeading} text={data.bookingIntro} />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6 sm:p-8">
          <BookingForm />
        </div>
        <aside className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-card">
            <Image src={getSafeImageUrl(data.bookingImage)} alt="" fill sizes="(max-width:1024px) 100vw, 35vw" className="object-cover" />
          </div>
          <div className="rounded-[22px] bg-blush-soft/70 p-6">
            <h2 className="font-serif text-2xl">Contact us directly</h2>
            <ul className="mt-4 space-y-3 text-ink/85">
              <li>
                <a href={`mailto:${s.email}`} className="flex items-center gap-3 hover:text-rose-dark">
                  <Mail aria-hidden className="h-5 w-5 text-navy" /> {s.email}
                </a>
              </li>
              <li>
                <a href={`tel:${s.phone}`} className="flex items-center gap-3 hover:text-rose-dark">
                  <Phone aria-hidden className="h-5 w-5 text-navy" /> {s.phone}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}

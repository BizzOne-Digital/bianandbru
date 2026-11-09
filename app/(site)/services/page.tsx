import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { BrandIcon } from "@/components/common/Icons";
import { getSection } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description: "Ventas de productos y accesorios para bebés: keepsakes, baby essentials and gift-ready products.",
  alternates: { canonical: "/services" },
};

type Services = {
  heading: string;
  mainService: string;
  intro: string;
  heroImage: string;
  items: { icon: string; title: string; text: string; image: string; href: string }[];
};

export default async function ServicesPage() {
  const { data: d } = await getSection<Services>("services");
  return (
    <>
      <PageHero eyebrow={d.heading} title={d.mainService} text={d.intro} image={d.heroImage} />
      <section className="container-x py-14">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {d.items?.map((it, i) => (
            <li key={i} className="group flex flex-col overflow-hidden rounded-[22px] border border-navy/5 bg-white shadow-soft">
              {it.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={getSafeImageUrl(it.image)} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
              )}
              <div className={`flex flex-1 flex-col p-6 ${i % 2 ? "bg-baby/30" : "bg-blush-soft/30"}`}>
                <h2 className="flex items-center gap-3 font-serif text-2xl">
                  <BrandIcon name={it.icon} className="h-7 w-7 text-rose-dark" /> {it.title}
                </h2>
                <p className="mt-3 flex-1 leading-relaxed text-ink/80">{it.text}</p>
                {it.href && (
                  <Link href={it.href} className="mt-4 inline-flex items-center gap-2 self-start font-semibold text-navy hover:text-rose-dark">
                    Explore <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col items-center gap-4 rounded-[24px] bg-navy px-6 py-10 text-center">
          <h2 className="font-serif text-3xl text-white">Need help choosing the perfect gift?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn-pink">
              Shop Now
            </Link>
            <Link href="/booking" className="btn border-2 border-white text-white hover:bg-white hover:text-navy">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

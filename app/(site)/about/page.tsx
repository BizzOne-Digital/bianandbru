import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/common/PageHero";
import { BrandIcon, HeartLine } from "@/components/common/Icons";
import { getSection } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "Bienvenido a BIAN&BRU — nuestra historia, misión y promesa para las familias.",
  alternates: { canonical: "/about" },
};

type About = {
  heroTitle: string;
  heroText: string;
  heroImage: string;
  storyTitle: string;
  storyText: string;
  storyImage: string;
  missionTitle: string;
  missionText: string;
  promiseTitle: string;
  promiseText: string;
  promiseImage: string;
  whyTitle: string;
  whyItems: { icon: string; title: string; text: string }[];
  valuesTitle: string;
  values: { title: string; text: string }[];
  galleryImages: { src: string }[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export default async function AboutPage() {
  const { data: d } = await getSection<About>("about");
  return (
    <>
      <PageHero eyebrow="About Us" title={d.heroTitle} text={d.heroText} image={d.heroImage} />

      <section id="historia" className="container-x grid scroll-mt-28 items-center gap-10 py-14 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-card">
          <Image src={getSafeImageUrl(d.storyImage)} alt="" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <SectionHeading title={d.storyTitle} />
          <p className="mt-4 text-lg leading-relaxed text-ink/85">{d.storyText}</p>
        </div>
      </section>

      <section id="mision" className="scroll-mt-28 bg-baby/60">
        <div className="container-x py-14 text-center">
          <BrandIcon name="target" className="mx-auto h-10 w-10 text-rose-dark" />
          <h2 className="section-title mt-3">{d.missionTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-2xl italic leading-relaxed text-navy">{d.missionText}</p>
        </div>
      </section>

      <section id="promesa" className="container-x grid scroll-mt-28 items-center gap-10 py-14 md:grid-cols-2">
        <div className="md:order-2 relative aspect-[4/3] overflow-hidden rounded-[24px] shadow-card">
          <Image src={getSafeImageUrl(d.promiseImage)} alt="" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <SectionHeading title={d.promiseTitle} />
          <p className="mt-4 text-lg leading-relaxed text-ink/85">{d.promiseText}</p>
        </div>
      </section>

      {d.whyItems?.length > 0 && (
        <section className="bg-blush-soft/70">
          <div className="container-x py-14">
            <h2 className="section-title text-center">{d.whyTitle}</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {d.whyItems.map((w, i) => (
                <li key={i} className="card p-6">
                  <BrandIcon name={w.icon} className="h-9 w-9 text-navy" />
                  <h3 className="mt-3 font-serif text-xl">{w.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {d.galleryImages?.length > 0 && (
        <section className="container-x py-14" aria-label="Galería">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {d.galleryImages.map((g, i) => (
              <li key={i} className={`relative aspect-square overflow-hidden rounded-[20px] ${i === 2 ? "col-span-2 aspect-[2/1] md:col-span-1 md:aspect-square" : ""}`}>
                <Image src={getSafeImageUrl(g.src)} alt="" fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover transition duration-500 hover:scale-[1.03]" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {d.values?.length > 0 && (
        <section className="container-x pb-14">
          <h2 className="section-title text-center">{d.valuesTitle}</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {d.values.map((v, i) => (
              <li key={i} className={`rounded-[22px] p-7 text-center ${i % 2 ? "bg-baby/70" : "bg-blush-soft/80"}`}>
                <HeartLine className="mx-auto h-8 w-9" />
                <h3 className="mt-3 font-serif text-2xl">{v.title}</h3>
                <p className="mt-2 text-ink/80">{v.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-navy">
        <div className="container-x flex flex-col items-center gap-5 py-12 text-center">
          <h2 className="font-serif text-3xl text-white">{d.ctaTitle}</h2>
          <Link href={d.ctaHref || "/shop"} className="btn-pink">
            {d.ctaLabel} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/common/PageHero";
import { EmptyState } from "@/components/common/EmptyState";
import { getSection, getTeam } from "@/lib/data";
import { getSafeImageUrl } from "@/lib/utils";

export const metadata: Metadata = { title: "Our Team", description: "Meet the BIAN&BRU team.", alternates: { canonical: "/team" } };

export default async function TeamPage() {
  const [{ data }, team] = await Promise.all([getSection<{ teamHeading: string; teamIntro: string }>("pages.misc"), getTeam()]);
  return (
    <>
      <PageHero title={data.teamHeading} text={data.teamIntro} />
      <section className="container-x py-14">
        {team.length === 0 ? (
          <EmptyState title="Our team page is being prepared" text="Please check back soon." />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <li key={m._id} className={`overflow-hidden rounded-[24px] border border-navy/5 shadow-soft ${i % 2 ? "bg-baby/50" : "bg-blush-soft/60"}`}>
                <div className="relative aspect-[4/4] bg-white">
                  <Image src={getSafeImageUrl(m.photo)} alt={m.name} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-2xl">{m.name}</h2>
                  {m.role && <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-rose-dark">{m.role}</p>}
                  {m.bio && <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{m.bio}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

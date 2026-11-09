"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { PageHeader } from "@/components/admin/ui";
import { SECTION_MAP, SECTIONS } from "@/lib/content-defaults";
import { cn } from "@/lib/utils";

function ContentInner() {
  const params = useSearchParams();
  const router = useRouter();
  const key = params.get("section") && SECTION_MAP[params.get("section")!] ? params.get("section")! : SECTIONS[0].key;
  const section = SECTION_MAP[key];
  const groups = ["Home Page", "Pages"] as const;

  return (
    <>
      <PageHeader title="Home & Pages" description="Edit each section separately. Toggle “Published” to hide a section. Use Preview to check saved changes." />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Sections" className="space-y-5">
          {groups.map((g) => (
            <div key={g}>
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{g}</p>
              <ul className="mt-1 flex gap-1 overflow-x-auto lg:block lg:space-y-0.5">
                {SECTIONS.filter((s) => s.group === g).map((s) => (
                  <li key={s.key} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => router.replace(`/admin/content?section=${s.key}`, { scroll: false })}
                      aria-current={s.key === key ? "page" : undefined}
                      className={cn(
                        "w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium",
                        s.key === key ? "bg-navy text-white" : "text-slate-700 hover:bg-white"
                      )}
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <SectionEditor key={key} sectionKey={key} title={section.title} fields={section.fields} previewPath={section.previewPath} />
      </div>
    </>
  );
}

export default function ContentAdmin() {
  return (
    <Suspense>
      <ContentInner />
    </Suspense>
  );
}

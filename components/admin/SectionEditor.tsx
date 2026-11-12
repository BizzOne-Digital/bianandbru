"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { translatableFields, type FieldDef } from "@/lib/content-defaults";
import { cn } from "@/lib/utils";
import type { UploadFolder } from "./AdminImageField";
import { FieldRenderer, type AdminField } from "./FieldRenderer";
import { api, Button, Card, Switch, TableSkeleton } from "./ui";

export function SectionEditor({
  sectionKey,
  title,
  fields,
  previewPath,
  showPublish = true,
  folder = "pages",
  translatable = true,
}: {
  sectionKey: string;
  title: string;
  fields: FieldDef[];
  previewPath?: string;
  showPublish?: boolean;
  folder?: UploadFolder;
  /** Shows English / Español tabs (Spanish edits only text fields). */
  translatable?: boolean;
}) {
  const [lang, setLang] = useState<"en" | "es">("en");
  const apiKey = lang === "es" ? `${sectionKey}.es` : sectionKey;
  const shownFields = lang === "es" ? translatableFields(fields) : fields;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(null);
    setDirty(false);
    api<{ data: Record<string, unknown>; published: boolean }>(`/api/admin/content/${apiKey}`)
      .then((d) => {
        setData(d.data);
        setPublished(d.published);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load"));
  }, [apiKey]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    try {
      await api(`/api/admin/content/${apiKey}`, { method: "PUT", body: JSON.stringify({ data, published }) });
      toast.success("Changes saved successfully.");
      setDirty(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-sans text-lg font-semibold text-slate-900">{title}</h2>
          {translatable && (
            <div role="tablist" aria-label="Language" className="inline-flex rounded-lg bg-slate-100 p-0.5 text-sm font-semibold">
              {(["en", "es"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  disabled={saving}
                  onClick={() => {
                    if (l === lang) return;
                    if (dirty && !window.confirm("You have unsaved changes. Switch language anyway?")) return;
                    setLang(l);
                  }}
                  className={cn("rounded-md px-3 py-1.5", lang === l ? "bg-white text-navy shadow-sm" : "text-slate-600 hover:text-slate-900")}
                >
                  {l === "en" ? "English" : "Español"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {showPublish && lang === "en" && (
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Switch
                checked={published}
                onChange={(v) => {
                  setPublished(v);
                  setDirty(true);
                }}
                label="Published"
              />
              {published ? "Published" : "Hidden"}
            </span>
          )}
          {previewPath && (
            <a href={`${previewPath}${previewPath.includes("?") ? "&" : "?"}preview=1`} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold hover:bg-slate-50">
              <ExternalLink aria-hidden className="h-4 w-4" /> Preview
            </a>
          )}
          <Button onClick={save} loading={saving} disabled={!data}>
            Save
          </Button>
        </div>
      </div>
      <div className="p-5">
        {!data ? (
          <TableSkeleton rows={4} />
        ) : (
          <FieldRenderer
            fields={shownFields as AdminField[]}
            values={data}
            folder={folder}
            idPrefix={sectionKey.replace(/\W/g, "-")}
            onChange={(v) => {
              setData(v);
              setDirty(true);
            }}
          />
        )}
        {lang === "es" && (
          <p className="mt-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-900">
            Spanish version: only text is translated here. Images, links and the Published switch are shared with the English version. Empty fields fall back to English.
          </p>
        )}
        {dirty && <p className="mt-4 text-sm font-medium text-amber-700">You have unsaved changes. Preview shows the last saved version.</p>}
      </div>
    </Card>
  );
}

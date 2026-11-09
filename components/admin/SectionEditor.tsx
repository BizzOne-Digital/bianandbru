"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { FieldDef } from "@/lib/content-defaults";
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
}: {
  sectionKey: string;
  title: string;
  fields: FieldDef[];
  previewPath?: string;
  showPublish?: boolean;
  folder?: UploadFolder;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(null);
    setDirty(false);
    api<{ data: Record<string, unknown>; published: boolean }>(`/api/admin/content/${sectionKey}`)
      .then((d) => {
        setData(d.data);
        setPublished(d.published);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load"));
  }, [sectionKey]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    try {
      await api(`/api/admin/content/${sectionKey}`, { method: "PUT", body: JSON.stringify({ data, published }) });
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
        <h2 className="font-sans text-lg font-semibold text-slate-900">{title}</h2>
        <div className="flex flex-wrap items-center gap-3">
          {showPublish && (
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
            fields={fields as AdminField[]}
            values={data}
            folder={folder}
            idPrefix={sectionKey.replace(/\W/g, "-")}
            onChange={(v) => {
              setData(v);
              setDirty(true);
            }}
          />
        )}
        {dirty && <p className="mt-4 text-sm font-medium text-amber-700">You have unsaved changes. Preview shows the last saved version.</p>}
      </div>
    </Card>
  );
}

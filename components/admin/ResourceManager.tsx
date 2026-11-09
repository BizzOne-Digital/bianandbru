"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getSafeImageUrl, slugify } from "@/lib/utils";
import type { UploadFolder } from "./AdminImageField";
import { emptyFor, FieldRenderer, type AdminField } from "./FieldRenderer";
import { api, Button, Card, ConfirmationDialog, inputCls, Modal, PageHeader, Switch, TableSkeleton } from "./ui";

type Row = Record<string, unknown> & { _id: string };

export type Column = { key: string; label: string; kind?: "text" | "image" | "published" | "featured" | "date" | "stars"; className?: string };

export function ResourceManager({
  resource,
  title,
  description,
  singular,
  fields,
  columns,
  folder = "misc",
  defaults,
  validate,
}: {
  resource: string;
  title: string;
  description?: string;
  singular: string;
  fields: AdminField[];
  columns: Column[];
  folder?: UploadFolder;
  defaults?: Record<string, unknown>;
  validate?: (v: Record<string, unknown>) => string | null;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: Row[]; pages: number }>(`/api/admin/${resource}?q=${encodeURIComponent(q)}&page=${page}`);
      setRows(d.items);
      setPages(d.pages);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load data");
      setRows([]);
    }
  }, [resource, q, page]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  async function save() {
    if (!editing) return;
    const err = validate?.(editing);
    if (err) return toast.error(err);
    setSaving(true);
    try {
      const { _id, ...body } = editing as Row;
      for (const f of fields)
        if (f.type === "slug") body[f.name] = slugify(String(body[f.name] || body.name || body.title || ""));
      for (const k of ["createdAt", "updatedAt", "__v"]) delete (body as Record<string, unknown>)[k];
      if (_id) await api(`/api/admin/${resource}/${_id}`, { method: "PUT", body: JSON.stringify(body) });
      else await api(`/api/admin/${resource}`, { method: "POST", body: JSON.stringify(body) });
      toast.success(_id ? "Changes saved successfully." : `${singular} created successfully.`);
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(r: Row, key: string) {
    const next = !r[key];
    setRows((rs) => rs?.map((x) => (x._id === r._id ? { ...x, [key]: next } : x)) ?? null);
    try {
      await api(`/api/admin/${resource}/${r._id}`, { method: "PATCH", body: JSON.stringify({ [key]: next }) });
      toast.success(next ? "Published." : "Unpublished.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update");
      load();
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/admin/${resource}/${toDelete._id}`, { method: "DELETE" });
      toast.success(`${singular} deleted.`);
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setDeleting(false);
    }
  }

  const label = (r: Row) => String(r.name ?? r.title ?? r.question ?? singular);

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => setEditing({ ...emptyFor(fields), ...defaults })}>
            <Plus className="h-4 w-4" /> New {singular.toLowerCase()}
          </Button>
        }
      />
      <Card>
        <div className="border-b border-slate-200 p-3">
          <div className="relative max-w-sm">
            <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor={`${resource}-search`} className="sr-only">
              Search
            </label>
            <input
              id={`${resource}-search`}
              className={`${inputCls} pl-9`}
              placeholder="Search..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        {rows === null ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No {title.toLowerCase()} found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} scope="col" className={`px-4 py-3 font-semibold ${c.className || ""}`}>
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-middle ${c.className || ""}`}>
                        {c.kind === "image" ? (
                          <span className="relative block h-11 w-11 overflow-hidden rounded-lg bg-slate-100">
                            <Image src={getSafeImageUrl(String(r[c.key] || ""))} alt="" fill sizes="44px" className="object-cover" />
                          </span>
                        ) : c.kind === "published" || c.kind === "featured" ? (
                          <Switch checked={!!r[c.key]} onChange={() => togglePublished(r, c.key)} label={`${c.label}: ${label(r)}`} />
                        ) : c.kind === "stars" ? (
                          <span className="text-amber-500" aria-label={`${r[c.key]} stars`}>
                            {"★".repeat(Number(r[c.key]) || 0)}
                          </span>
                        ) : c.kind === "date" ? (
                          new Date(String(r[c.key])).toLocaleDateString()
                        ) : (
                          <span className="line-clamp-2 max-w-md text-slate-800">{String(r[c.key] ?? "")}</span>
                        )}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setEditing({ ...emptyFor(fields), ...r })} aria-label={`Edit ${label(r)}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setToDelete(r)} aria-label={`Delete ${label(r)}`}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-3 text-sm">
            <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Page {page} of {pages}
            </span>
            <Button size="sm" variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>

      <Modal open={!!editing} onClose={() => !saving && setEditing(null)} title={editing?._id ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}>
        {editing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <FieldRenderer fields={fields} values={editing} onChange={setEditing} folder={folder} idPrefix={resource} />
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmationDialog
        open={!!toDelete}
        title={`Delete ${singular.toLowerCase()}?`}
        message={`“${toDelete ? label(toDelete) : ""}” will be permanently deleted, including its uploaded images.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

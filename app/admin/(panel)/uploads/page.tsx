"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadImage, type UploadFolder } from "@/components/admin/AdminImageField";
import { api, Button, Card, ConfirmationDialog, inputCls, PageHeader, TableSkeleton } from "@/components/admin/ui";

type Item = { _id: string; url: string; folder: string; filename: string; size: number; createdAt: string };
const FOLDERS: UploadFolder[] = ["products", "gallery", "pages", "misc"];

export default function UploadsAdmin() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [folder, setFolder] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [target, setTarget] = useState<UploadFolder>("gallery");
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: Item[]; pages: number }>(`/api/admin/uploads?page=${page}${folder ? `&folder=${folder}` : ""}`);
      setItems(d.items);
      setPages(d.pages);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load");
      setItems([]);
    }
  }, [folder, page]);
  useEffect(() => {
    load();
  }, [load]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    for (const f of Array.from(files)) {
      try {
        await uploadImage(f, target);
        toast.success(`${f.name} uploaded.`);
      } catch (e) {
        toast.error(`${f.name}: ${e instanceof Error ? e.message : "Upload failed"}`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    load();
  }

  async function remove() {
    if (!toDelete) return;
    try {
      await api("/api/admin/upload-delete", { method: "POST", body: JSON.stringify({ url: toDelete.url }) });
      toast.success("Image removed.");
      setToDelete(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  }

  return (
    <>
      <PageHeader
        title="Images / Uploads"
        description="All images are stored in MongoDB and persist across deployments. Images used by products or pages are cleaned up automatically when replaced or deleted."
        actions={
          <>
            <label htmlFor="up-target" className="sr-only">
              Upload folder
            </label>
            <select id="up-target" className={`${inputCls} w-36`} value={target} onChange={(e) => setTarget(e.target.value as UploadFolder)}>
              {FOLDERS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <Button onClick={() => inputRef.current?.click()} loading={uploading}>
              {!uploading && <Upload className="h-4 w-4" />} Upload images
            </Button>
            <input ref={inputRef} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" aria-label="Choose images" onChange={(e) => onFiles(e.target.files)} />
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {["", ...FOLDERS].map((f) => (
          <button
            key={f || "all"}
            type="button"
            onClick={() => {
              setFolder(f);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${folder === f ? "bg-navy text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}
          >
            {f || "All"}
          </button>
        ))}
      </div>
      {items === null ? (
        <Card>
          <TableSkeleton />
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-500">No uploads yet.</Card>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((i) => (
            <li key={i._id}>
              <Card className="overflow-hidden">
                <div className="relative aspect-square bg-slate-100">
                  <Image src={i.url} alt={i.filename} fill sizes="200px" className="object-cover" />
                </div>
                <div className="p-2 text-xs">
                  <p className="truncate font-medium text-slate-700" title={i.filename}>
                    {i.folder}/{i.filename}
                  </p>
                  <p className="text-slate-400">{(i.size / 1024).toFixed(0)} KB</p>
                  <div className="mt-1 flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Copy URL"
                      onClick={() => {
                        navigator.clipboard.writeText(i.url);
                        toast.success("URL copied.");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Delete image" onClick={() => setToDelete(i)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span>
            {page} / {pages}
          </span>
          <Button size="sm" variant="secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
      {uploading && (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-500" role="status">
          <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
        </p>
      )}
      <ConfirmationDialog
        open={!!toDelete}
        title="Delete image?"
        message="If this image is still used by a product or page, it will show a placeholder there. This cannot be undone."
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

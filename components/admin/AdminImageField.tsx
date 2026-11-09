"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn, getSafeImageUrl } from "@/lib/utils";

export type UploadFolder = "products" | "gallery" | "pages" | "misc";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX = 8 * 1024 * 1024;

/** Uploads a file to /api/upload and resolves to the public URL string. */
export async function uploadImage(file: File, folder: UploadFolder): Promise<string> {
  if (!ALLOWED.includes(file.type)) throw new Error("Unsupported file format.");
  if (file.size > MAX) throw new Error("File exceeds 8MB.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = "/admin/login?expired=1";
    throw new Error("Session expired.");
  }
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed.");
  return data.url as string;
}

/** Deletes an upload that was never saved to a record. */
export function discardUnsavedUpload(url: string) {
  if (!url.startsWith("/api/uploads/")) return;
  fetch("/api/admin/upload-delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) }).catch(() => {});
}

/**
 * Reusable admin image field. onChange receives ONLY the URL string.
 * Previously-saved images are removed from MongoDB by the server *after* the record saves.
 * Fresh (unsaved) uploads that get replaced/removed are discarded immediately.
 */
export function AdminImageField({
  label,
  value,
  onChange,
  folder = "misc",
  aspect = "aspect-[4/3]",
  className,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  aspect?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // URLs uploaded by this field in this session (not yet saved to any record).
  const uploadedHere = useRef(new Set<string>());
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const id = `img-${label.replace(/\W+/g, "-").toLowerCase()}`;

  async function onFile(file?: File) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) return toast.error("Unsupported file format. Use JPG, PNG, WEBP or GIF.");
    if (file.size > MAX) return toast.error("File exceeds 8MB.");
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      if (value && uploadedHere.current.has(value)) discardUnsavedUpload(value);
      uploadedHere.current.add(url);
      onChange(url);
      toast.success("Image uploaded successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      setLocalPreview(null);
      URL.revokeObjectURL(preview);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove() {
    if (value && uploadedHere.current.has(value)) discardUnsavedUpload(value);
    onChange("");
    toast("Image removed. Save to apply.");
  }

  const shown = localPreview || (value ? getSafeImageUrl(value) : "");
  const isNew = !!value && uploadedHere.current.has(value);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className={cn("relative overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50", aspect)}>
        {shown ? (
          localPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localPreview} alt="New image preview" className="h-full w-full object-cover" />
          ) : (
            <Image src={shown} alt={`${label} preview`} fill sizes="320px" className="object-cover" />
          )
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-100">
            <ImagePlus aria-hidden className="h-8 w-8" />
            <span className="text-sm font-medium">Upload image</span>
            <span className="text-xs">JPG, PNG, WEBP, GIF · max 8MB</span>
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/70" role="status">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
            </span>
          </div>
        )}
        {isNew && !uploading && <span className="absolute left-2 top-2 rounded bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">New — save to apply</span>}
      </div>
      <input id={id} ref={inputRef} type="file" accept={ALLOWED.join(",")} className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
      {value && (
        <div className="mt-2 flex gap-2">
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw aria-hidden className="h-3.5 w-3.5" /> Replace
          </button>
          <button type="button" disabled={uploading} onClick={remove} className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
            <Trash2 aria-hidden className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

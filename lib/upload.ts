import "server-only";
import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const FILENAME_RE = /^\d{10,16}-[a-f0-9]{8,32}\.(jpg|png|webp|gif)$/;

export function isValidFolder(f: unknown): f is UploadFolder {
  return typeof f === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(f);
}

export function isValidFilename(name: unknown): name is string {
  if (typeof name !== "string") return false;
  if (name.includes("..") || name.includes("/") || name.includes("\\") || name.includes("\0")) return false;
  return FILENAME_RE.test(name);
}

/** Checks magic bytes so a renamed non-image cannot be stored. */
export function sniffMatchesMime(buf: Buffer, mime: string) {
  if (buf.length < 12) return false;
  switch (mime) {
    case "image/jpeg":
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "image/png":
      return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif":
      return buf.subarray(0, 4).toString("ascii") === "GIF8";
    case "image/webp":
      return buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
    default:
      return false;
  }
}

export function parseUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  if (typeof url !== "string" || !url.startsWith("/api/uploads/")) return null;
  const parts = url.split("?")[0].slice("/api/uploads/".length).split("/");
  if (parts.length !== 2) return null;
  const [folder, filename] = parts;
  if (!isValidFolder(folder) || !isValidFilename(filename)) return null;
  return { folder, filename };
}

/** Deletes a MongoDB-stored upload. External/static URLs are ignored. */
export async function deleteStoredUploadByUrl(url?: string | null) {
  if (!url) return false;
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  await connectDB();
  const res = await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
  return res.deletedCount > 0;
}

/** Deletes uploads present in `before` but no longer referenced in `after`. */
export async function cleanupRemovedUploads(before: (string | null | undefined)[], after: (string | null | undefined)[]) {
  const keep = new Set(after.filter(Boolean));
  const removed = [...new Set(before.filter((u): u is string => !!u && !keep.has(u)))];
  await Promise.all(removed.map((u) => deleteStoredUploadByUrl(u).catch(() => false)));
}

/** Recursively collects /api/uploads/ URLs from any JSON-like value. */
export function collectUploadUrls(value: unknown, acc: string[] = []): string[] {
  if (typeof value === "string") {
    if (value.startsWith("/api/uploads/")) acc.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectUploadUrls(v, acc));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectUploadUrls(v, acc));
  }
  return acc;
}

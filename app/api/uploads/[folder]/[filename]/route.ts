import { connectDB } from "@/lib/db";
import { isValidFilename, isValidFolder } from "@/lib/upload";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";

/** Serves image binaries stored in MongoDB. Immutable: filenames are unique per upload. */
export async function GET(_req: Request, { params }: { params: Promise<{ folder: string; filename: string }> }) {
  const { folder, filename } = await params;
  if (!isValidFolder(folder) || !isValidFilename(filename)) return new Response("Not found", { status: 404 });

  try {
    await connectDB();
    const doc = await StoredUpload.findOne({ folder, filename }).lean();
    if (!doc) return new Response("Not found", { status: 404 });
    const raw = doc.data as unknown as Buffer | { buffer: ArrayBuffer };
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from((raw as { buffer: ArrayBuffer }).buffer);
    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Length": String(buf.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("[uploads:get]", e);
    return new Response("Server error", { status: 500 });
  }
}

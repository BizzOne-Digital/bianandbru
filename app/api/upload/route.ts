import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isValidFolder, MAX_UPLOAD_BYTES, MIME_TO_EXT, sniffMatchesMime } from "@/lib/upload";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";

const err = (error: string, status = 400) => NextResponse.json({ success: false, error }, { status });

/** Admin upload → validated → stored as binary in MongoDB → returns same-origin URL. */
export async function POST(req: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return err("Invalid form data");
  }

  const folder = form.get("folder");
  const file = form.get("file");

  if (!isValidFolder(folder)) return err("Invalid upload folder");
  if (!(file instanceof File)) return err("No file was provided");
  if (file.size === 0) return err("The file is empty");
  if (file.size > MAX_UPLOAD_BYTES) return err("File exceeds 8MB", 413);

  const ext = MIME_TO_EXT[file.type];
  if (!ext) return err("Unsupported file format. Use JPG, PNG, WEBP or GIF.", 415);

  const data = Buffer.from(await file.arrayBuffer());
  if (!sniffMatchesMime(data, file.type)) return err("File content does not match its image type", 415);

  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  try {
    await connectDB();
    await StoredUpload.create({ folder, filename, mimeType: file.type, size: data.length, data });
  } catch (e) {
    console.error("[upload]", e);
    return err("Upload failed. Please try again.", 500);
  }

  return NextResponse.json({
    success: true,
    url: `/api/uploads/${folder}/${filename}`,
    filename,
    size: data.length,
    folder,
  });
}

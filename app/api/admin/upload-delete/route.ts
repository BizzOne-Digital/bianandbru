import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { deleteStoredUploadByUrl } from "@/lib/upload";

export const runtime = "nodejs";

/**
 * Deletes an upload that was never saved to a record (e.g. admin uploaded an image,
 * then replaced or removed it before saving the form). Saved records are cleaned
 * automatically on save/delete.
 */
export async function POST(req: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const body = await req.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  if (!url.startsWith("/api/uploads/")) return NextResponse.json({ success: true, deleted: false });
  const deleted = await deleteStoredUploadByUrl(url);
  return NextResponse.json({ success: true, deleted });
}

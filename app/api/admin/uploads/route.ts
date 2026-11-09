import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isValidFolder } from "@/lib/upload";
import { StoredUpload } from "@/models/StoredUpload";

export const runtime = "nodejs";

/** Lists stored uploads (metadata only — never the binary). */
export async function GET(req: Request) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const url = new URL(req.url);
  const folder = url.searchParams.get("folder");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = 48;
  const filter = isValidFolder(folder) ? { folder } : {};
  await connectDB();
  const [items, total] = await Promise.all([
    StoredUpload.find(filter).select("folder filename mimeType size createdAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    StoredUpload.countDocuments(filter),
  ]);
  return NextResponse.json({
    items: items.map((i) => ({ ...i, _id: String(i._id), url: `/api/uploads/${i.folder}/${i.filename}` })),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  });
}

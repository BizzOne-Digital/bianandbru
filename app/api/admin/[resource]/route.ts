import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { RESOURCES } from "@/lib/admin-resources";
import { escapeRegex, serialize } from "@/lib/utils";
import { zodMessage } from "@/lib/validations";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const r = RESOURCES[(await params).resource];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim().slice(0, 80);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 20));
  const status = url.searchParams.get("status");

  const filter: Record<string, unknown> = {};
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = r.searchFields.map((f) => ({ [f]: rx }));
  }
  if (status && /^[A-Za-z]{2,20}$/.test(status)) filter.status = status;

  try {
    await connectDB();
    let query = r.model.find(filter).sort(r.sort).skip((page - 1) * limit).limit(limit);
    if (r.populate) query = query.populate(r.populate);
    const [items, total] = await Promise.all([query.lean(), r.model.countDocuments(filter)]);
    return NextResponse.json({ items: serialize(items), total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (e) {
    console.error("[admin:list]", e);
    return NextResponse.json({ error: "Could not load data" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const r = RESOURCES[(await params).resource];
  if (!r?.createSchema) return NextResponse.json({ error: "Not allowed" }, { status: 405 });

  const parsed = r.createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 400 });

  try {
    await connectDB();
    const data = r.beforeSave ? r.beforeSave({ ...parsed.data }) : parsed.data;
    const doc = await r.model.create(data);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, item: serialize(doc.toObject()) }, { status: 201 });
  } catch (e: unknown) {
    if ((e as { code?: number }).code === 11000) return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    console.error("[admin:create]", e);
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}

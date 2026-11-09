import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { imageValues, RESOURCES } from "@/lib/admin-resources";
import { cleanupRemovedUploads } from "@/lib/upload";
import { serialize } from "@/lib/utils";
import { zodMessage } from "@/lib/validations";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function resolve(ctx: Ctx) {
  const { resource, id } = await ctx.params;
  const r = RESOURCES[resource];
  if (!r || !/^[a-f0-9]{24}$/.test(id)) return null;
  return { r, id };
}

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const x = await resolve(ctx);
  if (!x) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await connectDB();
  const doc = await x.r.model.findById(x.id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: serialize(doc) });
}

async function update(req: Request, ctx: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const x = await resolve(ctx);
  if (!x) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = x.r.updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 400 });

  try {
    await connectDB();
    const before = await x.r.model.findById(x.id).lean<Record<string, unknown>>();
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let data: Record<string, unknown> = { ...parsed.data };
    if (x.r.beforeSave) data = x.r.beforeSave({ price: before.price, compareAtPrice: before.compareAtPrice, ...data });

    const after = await x.r.model.findByIdAndUpdate(x.id, { $set: data }, { returnDocument: "after", runValidators: true }).lean<Record<string, unknown>>();
    // New URLs are saved first; only then are replaced/removed Mongo uploads cleaned up.
    if (x.r.imageFields.length) await cleanupRemovedUploads(imageValues(before, x.r.imageFields), imageValues(after, x.r.imageFields));
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, item: serialize(after) });
  } catch (e: unknown) {
    if ((e as { code?: number }).code === 11000) return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    console.error("[admin:update]", e);
    return NextResponse.json({ error: "Could not save changes" }, { status: 500 });
  }
}

export const PUT = update;
export const PATCH = update;

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const x = await resolve(ctx);
  if (!x) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    await connectDB();
    const doc = await x.r.model.findByIdAndDelete(x.id).lean<Record<string, unknown>>();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (x.r.imageFields.length) await cleanupRemovedUploads(imageValues(doc, x.r.imageFields), []);
    if (x.r.onDelete) await x.r.onDelete(x.id);
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin:delete]", e);
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }
}

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { SECTION_MAP, SETTINGS_DEFAULTS, SETTINGS_FIELDS, type FieldDef } from "@/lib/content-defaults";
import { cleanupRemovedUploads, collectUploadUrls } from "@/lib/upload";
import { imageUrl } from "@/lib/validations";
import { PageContent } from "@/models/PageContent";
import { SiteSettings } from "@/models/SiteSettings";

export const runtime = "nodejs";

/** Builds a strict Zod schema from editor field definitions — unknown keys are dropped. */
function schemaFor(fields: FieldDef[]): z.ZodObject {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) {
    switch (f.type) {
      case "image":
        shape[f.name] = imageUrl.default("");
        break;
      case "url":
        shape[f.name] = z
          .string()
          .trim()
          .max(500)
          .refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\//.test(v), "Links must start with / or https://")
          .default("");
        break;
      case "boolean":
        shape[f.name] = z.boolean().default(false);
        break;
      case "number":
        shape[f.name] = z.coerce.number().min(0).max(100000).default(0);
        break;
      case "list":
        shape[f.name] = z.array(schemaFor(f.fields)).max(30).default([]);
        break;
      default:
        shape[f.name] = z.string().trim().max(f.type === "textarea" ? 5000 : 300).default("");
    }
  }
  return z.object(shape);
}

type Ctx = { params: Promise<{ key: string }> };

function defsFor(key: string) {
  if (key === "settings") return { fields: SETTINGS_FIELDS, defaults: SETTINGS_DEFAULTS as unknown as Record<string, unknown> };
  const s = SECTION_MAP[key];
  return s ? { fields: s.fields, defaults: s.defaults } : null;
}

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const key = (await ctx.params).key;
  const defs = defsFor(key);
  if (!defs) return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  await connectDB();
  if (key === "settings") {
    const doc = await SiteSettings.findOne({ key: "main" }).lean();
    return NextResponse.json({ data: { ...defs.defaults, ...(doc?.data || {}) }, published: true });
  }
  const doc = await PageContent.findOne({ key }).lean();
  return NextResponse.json({ data: { ...defs.defaults, ...(doc?.data || {}) }, published: doc ? doc.published !== false : true });
}

export async function PUT(req: Request, ctx: Ctx) {
  const session = await requireAdminApi();
  if (session instanceof NextResponse) return session;
  const key = (await ctx.params).key;
  const defs = defsFor(key);
  if (!defs) return NextResponse.json({ error: "Unknown section" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schemaFor(defs.fields).safeParse(body?.data);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return NextResponse.json({ error: `${i?.path.join(".")}: ${i?.message}` }, { status: 400 });
  }
  const published = body?.published !== false;

  try {
    await connectDB();
    let beforeData: unknown;
    if (key === "settings") {
      const before = await SiteSettings.findOne({ key: "main" }).lean();
      beforeData = before?.data;
      await SiteSettings.updateOne({ key: "main" }, { $set: { data: parsed.data } }, { upsert: true });
    } else {
      const before = await PageContent.findOne({ key }).lean();
      beforeData = before?.data;
      await PageContent.updateOne({ key }, { $set: { data: parsed.data, published } }, { upsert: true });
    }
    await cleanupRemovedUploads(collectUploadUrls(beforeData), collectUploadUrls(parsed.data));
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin:content]", e);
    return NextResponse.json({ error: "Could not save changes" }, { status: 500 });
  }
}

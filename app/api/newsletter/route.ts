import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { newsletterSchema, zodMessage } from "@/lib/validations";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 400 });
  try {
    await connectDB();
    await NewsletterSubscriber.updateOne({ email: parsed.data.email.toLowerCase() }, { $setOnInsert: { email: parsed.data.email.toLowerCase() } }, { upsert: true });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[newsletter]", e);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 500 });
  }
}

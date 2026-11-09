import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { AdminUser } from "@/models/AdminUser";

export const runtime = "nodejs";

// Best-effort throttle per instance (serverless instances are short-lived).
const attempts = new Map<string, { n: number; until: number }>();
// Compared against when the email is unknown, so response timing does not reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const a = attempts.get(ip);
  if (a && a.n >= 8 && a.until > Date.now()) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }

  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });

  try {
    await connectDB();
    const user = await AdminUser.findOne({ email: parsed.data.email.toLowerCase() });
    const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash || DUMMY_HASH);
    if (!user || !ok) {
      attempts.set(ip, { n: (a?.n || 0) + 1, until: Date.now() + 10 * 60_000 });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    attempts.delete(ip);
    user.lastLoginAt = new Date();
    await user.save();
    await setSessionCookie(await createSessionToken({ sub: String(user._id), email: user.email }));
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin:login]", e);
    return NextResponse.json({ error: "Login is temporarily unavailable" }, { status: 500 });
  }
}

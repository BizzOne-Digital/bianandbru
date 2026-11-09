import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { bookingSchema, zodMessage } from "@/lib/validations";
import { Booking } from "@/models/Booking";

export const runtime = "nodejs";

/** Public: booking / contact request. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 400 });
  const { company, ...data } = parsed.data;
  if (company) return NextResponse.json({ success: true }); // honeypot: silently drop bots
  try {
    await connectDB();
    await Booking.create(data);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[bookings]", e);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }
}

import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { checkoutSchema, zodMessage } from "@/lib/validations";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export const runtime = "nodejs";

/**
 * Creates an order REQUEST using server-side prices. No payment is taken here;
 * paymentStatus stays "unpaid". Plug a payment gateway (e.g. Stripe Checkout) in here later.
 */
export async function POST(req: Request) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: zodMessage(parsed.error) }, { status: 400 });
  const { items, customer } = parsed.data;

  try {
    await connectDB();
    const products = await Product.find({ _id: { $in: items.map((i) => i.productId) }, published: true, status: "active" }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const lines = [];
    let subtotal = 0;
    let original = 0;
    for (const i of items) {
      const p = byId.get(i.productId);
      if (!p) return NextResponse.json({ error: "A product in your cart is no longer available" }, { status: 409 });
      if (p.trackInventory && p.stock < i.quantity)
        return NextResponse.json({ error: `Only ${p.stock} of “${p.name}” available` }, { status: 409 });
      subtotal += p.price * i.quantity;
      original += Math.max(p.compareAtPrice || 0, p.price) * i.quantity;
      lines.push({ product: p._id, name: p.name, slug: p.slug, price: p.price, quantity: i.quantity, image: p.thumbnail || p.images?.[0] || "" });
    }

    const orderNumber = `BB-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
    await Order.create({
      orderNumber,
      items: lines,
      subtotal: +original.toFixed(2),
      discount: +(original - subtotal).toFixed(2),
      total: +subtotal.toFixed(2),
      currency: products[0]?.currency || "USD",
      customer,
      status: "pending",
      paymentStatus: "unpaid",
    });
    return NextResponse.json({ success: true, orderNumber });
  } catch (e) {
    console.error("[orders]", e);
    return NextResponse.json({ error: "Could not submit your order request. Please try again." }, { status: 500 });
  }
}

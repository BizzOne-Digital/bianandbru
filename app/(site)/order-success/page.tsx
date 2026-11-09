import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Order request received", robots: { index: false } };

async function findOrder(num?: string) {
  if (!num || !/^BB-[A-Z0-9-]{6,30}$/.test(num)) return null;
  try {
    await connectDB();
    return await Order.findOne({ orderNumber: num }).select("orderNumber total currency items.name items.quantity paymentStatus").lean();
  } catch {
    return null;
  }
}

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: num } = await searchParams;
  const order = await findOrder(num);
  if (!order)
    return (
      <div className="container-x py-16">
        <EmptyState title="Order not found" text="We could not find that order reference." actionLabel="Back to shop" actionHref="/shop" />
      </div>
    );

  return (
    <div className="container-x max-w-2xl py-16 text-center">
      <ClipboardCheck aria-hidden className="mx-auto h-16 w-16 text-navy" strokeWidth={1.4} />
      <h1 className="mt-4 font-serif text-4xl">Order request received</h1>
      <p className="mt-3 text-lg text-ink/80">
        Thank you! Your reference is <strong className="text-navy">{order.orderNumber}</strong>.
      </p>
      <p className="mt-2 text-ink/75">
        Payment has <strong>not</strong> been collected. Our team will contact you to confirm availability, shipping and payment details.
      </p>
      <div className="mt-8 rounded-[22px] bg-white p-6 text-left shadow-soft">
        <ul className="space-y-2">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between">
              <span>
                {i.name} × {i.quantity}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-navy/10 pt-3 font-bold text-navy">
          <span>Total (before shipping)</span>
          <span>{formatPrice(order.total || 0, order.currency || "USD")}</span>
        </p>
      </div>
      <Link href="/shop" className="btn-navy mt-8">
        Continue Shopping
      </Link>
    </div>
  );
}

import Link from "next/link";
import { AlertTriangle, CalendarCheck, FolderTree, Layers, MessageSquareQuote, Package, ShoppingBag } from "lucide-react";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Collection } from "@/models/Collection";
import { Testimonial } from "@/models/Testimonial";
import { Booking } from "@/models/Booking";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

const LOW_STOCK = 5;

async function load() {
  await connectDB();
  const [products, categories, collections, testimonials, bookings, newBookings, orders, lowStock, recentProducts, recentBookings, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Collection.countDocuments(),
    Testimonial.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "New" }),
    Order.countDocuments({ status: "pending" }),
    Product.find({ trackInventory: true, stock: { $lte: LOW_STOCK } }).select("name stock").sort({ stock: 1 }).limit(8).lean(),
    Product.find().select("name updatedAt").sort({ updatedAt: -1 }).limit(5).lean(),
    Booking.find().select("name reason status createdAt").sort({ createdAt: -1 }).limit(5).lean(),
    Order.find().select("orderNumber total createdAt customer.name").sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  const activity = [
    ...recentProducts.map((p) => ({ when: p.updatedAt as Date, text: `Product updated: ${p.name}`, href: `/admin/products/${p._id}` })),
    ...recentBookings.map((b) => ({ when: b.createdAt as Date, text: `Booking from ${b.name} (${b.status})`, href: "/admin/bookings" })),
    ...recentOrders.map((o) => ({ when: o.createdAt as Date, text: `Order request ${o.orderNumber} — ${formatPrice(o.total || 0)}`, href: "/admin/orders" })),
  ]
    .sort((a, b) => +new Date(b.when) - +new Date(a.when))
    .slice(0, 10);
  return { products, categories, collections, testimonials, bookings, newBookings, orders, lowStock, activity };
}

export default async function DashboardPage() {
  let d: Awaited<ReturnType<typeof load>>;
  try {
    d = await load();
  } catch {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="font-sans text-lg font-bold">Database unavailable</h1>
        <p className="mt-1 text-sm">Check that MONGODB_URI is set and your Atlas network access allows this server.</p>
      </div>
    );
  }

  const stats = [
    { label: "Products", value: d.products, icon: Package, href: "/admin/products" },
    { label: "Collections", value: d.collections, icon: Layers, href: "/admin/collections" },
    { label: "Categories", value: d.categories, icon: FolderTree, href: "/admin/categories" },
    { label: "Testimonials", value: d.testimonials, icon: MessageSquareQuote, href: "/admin/testimonials" },
    { label: "Bookings", value: d.bookings, icon: CalendarCheck, href: "/admin/bookings", note: d.newBookings ? `${d.newBookings} new` : "" },
    { label: "Pending orders", value: d.orders, icon: ShoppingBag, href: "/admin/orders" },
  ];

  return (
    <>
      <h1 className="font-sans text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Store overview and items that need attention.</p>

      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-navy/30 hover:shadow">
              <s.icon aria-hidden className="h-5 w-5 text-navy" />
              <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
              {s.note && <p className="mt-1 text-xs font-semibold text-rose-dark">{s.note}</p>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-slate-200 px-5 py-3 font-sans text-base font-semibold text-slate-900">
            <AlertTriangle aria-hidden className="h-4 w-4 text-amber-500" /> Low stock (≤ {LOW_STOCK})
          </h2>
          {d.lowStock.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">All products are well stocked.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {d.lowStock.map((p) => (
                <li key={String(p._id)} className="flex items-center justify-between px-5 py-3 text-sm">
                  <Link href={`/admin/products/${p._id}`} className="font-medium text-slate-800 hover:text-navy">
                    {p.name}
                  </Link>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.stock === 0 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 px-5 py-3 font-sans text-base font-semibold text-slate-900">Recent activity</h2>
          {d.activity.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {d.activity.map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                  <Link href={a.href} className="text-slate-800 hover:text-navy">
                    {a.text}
                  </Link>
                  <time className="shrink-0 text-xs text-slate-400">{new Date(a.when).toLocaleDateString()}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
